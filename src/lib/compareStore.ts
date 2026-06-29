// ---------------------------------------------------------------------------
// compareStore.ts
// Persistence + URL sync for the compare-tray selection. Reads and
// writes the `curvoteca:compare` localStorage key (capped at `MAX`
// entries) and mirrors the selection into the `?c=` query string so
// compare views are shareable. All access is SSR-safe (no-op when
// `window` is undefined) and validates each id against the
// `^[a-z0-9][a-z0-9-]*$` shape.
// ---------------------------------------------------------------------------

import { KEY_COMPARE } from "./storageKeys";

const KEY = KEY_COMPARE;
const PARAM = "c";
const MAX = 8;

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const sanitize = (raw: string): string[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9][a-z0-9-]*$/.test(s))
    .slice(0, MAX);
};

export const readIds = (): string[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return sanitize(parsed.join(","));
    }
  } catch {
    /* ignore */
  }
  return [];
};

export const writeIds = (ids: string[]) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
};

export const readFromQuery = (): string[] | null => {
  if (!isBrowser()) return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    if (!sp.has(PARAM)) return null;
    return sanitize(sp.get(PARAM) || "");
  } catch {
    return null;
  }
};

export const writeToQuery = (ids: string[], replace = true) => {
  if (!isBrowser()) return;
  try {
    const url = new URL(window.location.href);
    if (ids.length === 0) {
      url.searchParams.delete(PARAM);
    } else {
      url.searchParams.set(PARAM, ids.join(","));
    }
    const method = replace ? "replaceState" : "pushState";
    window.history[method](null, "", url.toString());
  } catch {
    /* ignore */
  }
};

export const mergeSeed = (seed: string[]): string[] => {
  const store = readIds();
  const fromQuery = readFromQuery();
  const base = fromQuery !== null ? fromQuery : store;
  const seen = new Set<string>();
  const out: string[] = [];
  [...base, ...seed].forEach((id) => {
    if (!seen.has(id) && out.length < MAX) {
      seen.add(id);
      out.push(id);
    }
  });
  return out;
};

export const toggleId = (ids: string[], id: string): string[] => {
  const i = ids.indexOf(id);
  if (i === -1) {
    if (ids.length >= MAX) return ids;
    return [...ids, id];
  }
  const copy = ids.slice();
  copy.splice(i, 1);
  return copy;
};
