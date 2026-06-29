// Renderer color tokens. CSS owns these via custom properties on .curve-view;
// JS only reads them. A missing variable is a CSS bug, not a JS one.
//
// Line colors (grid, subgrid, axis/end, zero) are RGB-only — three space- or
// comma-separated channels with no alpha. The renderer composes
// `rgba(R, G, B, alpha)` at draw time so each line category can carry its own
// alpha multiplier (see tokens.ts) without duplicating the base palette.
export type RendererColors = {
  bg: string;
  grid: string;
  subgrid: string;
  axis: string;
  zero: string;
  curve: string;
  curve2: string;
};

const CSS_VARS = [
  "--bg",
  "--grid",
  "--subgrid",
  "--axis",
  "--zero",
  "--curve",
  "--curve2",
] as const;

export const readColors = (root: HTMLElement): RendererColors => {
  const style = getComputedStyle(root);
  const get = (name: (typeof CSS_VARS)[number]) =>
    style.getPropertyValue(name).trim();
  return {
    bg: get("--bg"),
    grid: get("--grid"),
    subgrid: get("--subgrid"),
    axis: get("--axis"),
    zero: get("--zero"),
    curve: get("--curve"),
    curve2: get("--curve2"),
  };
};

/**
 * Compose a `rgba(...)` string from an RGB base (any css-color-like form) and
 * a 0..1 alpha. Falls back to the base string if alpha is not finite.
 */
export const withAlpha = (rgb: string, alpha: number): string => {
  if (!Number.isFinite(alpha)) return rgb;
  // Normalize: drop a trailing "/a" or "rgba(" wrapper if present, then
  // re-wrap with the requested alpha. This keeps the input format flexible
  // (e.g. "214 225 242", "rgb(214 225 242)", "214,225,242").
  const channels = extractRgbChannels(rgb);
  if (!channels) return rgb;
  return `rgba(${channels}, ${alpha})`;
};

const extractRgbChannels = (value: string): string | null => {
  const v = value.trim();
  if (!v) return null;
  // "rgb(R, G, B)" or "rgba(R, G, B, A)"
  const fnMatch = v.match(/^rgba?\(\s*([^)]+?)\s*\/?\s*[0-9.]*\s*\)$/i);
  if (fnMatch) {
    const parts = fnMatch[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length >= 3) return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  // Bare channels: "R G B" or "R, G, B"
  const parts = v.split(/[\s,/]+/).filter(Boolean);
  if (parts.length === 3 && parts.every((p) => /^[+-]?\d/.test(p))) {
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  return null;
};
