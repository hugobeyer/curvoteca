// ---------------------------------------------------------------------------
// detailSnippetTabs.ts
// Snippet tab-bar builder for the detail overlay. Consumed via
// window.__detailOverlay from inline scripts.
// ---------------------------------------------------------------------------

export interface CurveRegistryEntry {
  id: string;
  name: string;
  family?: string;
  summary?: string;
  previewPoints: [number, number][];
  equation: string;
  snippets?: Record<string, string>;
}

export type TabSelectHandler = (key: string, code: string) => void;

import { LANG_ICONS } from "./langIcons";

export function buildSnippetTabs(
  container: HTMLElement,
  entry: CurveRegistryEntry,
  onSelect: TabSelectHandler,
): void {
  container.innerHTML = "";
  const keys: string[] = ["equation"];
  if (entry.snippets && typeof entry.snippets === "object") {
    for (const k in entry.snippets) {
      if (entry.snippets.hasOwnProperty(k) && k !== "equation") {
        keys.push(k);
      }
    }
  }

  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.className = "chip detail-tab" + (key === "equation" ? " active" : "");
    btn.type = "button";
    const icon = LANG_ICONS[key] ?? LANG_ICONS.equation;
    btn.innerHTML = icon + " " + key;
    btn.setAttribute("data-lang", key);
    btn.addEventListener("click", () => {
      const prev = container.querySelector(".active");
      if (prev) prev.classList.remove("active");
      btn.classList.add("active");
      const snippets = entry.snippets || {};
      const code =
        key === "equation" ? entry.equation : snippets[key] || entry.equation;
      onSelect(key, code);
    });
    container.appendChild(btn);
  });
}
