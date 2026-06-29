// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RendererTokens = {
  // Curve + scaffolding lines.
  curveLineWidth: number;
  gridLineWidth: number;
  endLineWidth: number;
  zeroLineWidth: number;
  gridLineAlpha: number;
  subgridLineAlpha: number;
  endLineAlpha: number;
  zeroLineAlpha: number;
  viewportQuadAlpha: number;
  // Edge fade.
  edgeFade: number;
  edgeFadeInset: number;
  // Axis tick labels.
  labelSize: number;
  labelInsetX: number;
  labelInsetY: number;
  labelAlpha: number;
  labelMinGap: number;
  labelZoomOcta: number;
  labelZoomQuart: number;
  labelZoomHalf: number;
  // Custom cursor.
  cursorReach: number;
  cursorGapRatio: number;
  cursorAlpha: number;
  cursorLineWidth: number;
  // Probe.
  probeDotRadius: number;
  probeBoxSize: number;
  probeBoxArmRatio: number;
  probeBoxLineWidth: number;
  probeNearRadius: number;
  probeAppearMs: number;
  probeDisappearMs: number;
  // Probe crosshair line mask.
  lineMaskStart: number;
  lineMaskEnd: number;
  // Misc.
  tileMarginFactor: number;
  dprMin: number;
  dprMax: number;
  // F-key fit padding: screen-pixel margin on each side of the canvas
  // when the user presses F. Read by `fitStateFor` in src/pages/index.astro.
  fitPadding: number;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULTS = {
  // Curve + scaffolding lines.
  curveLineWidth: 1.25,
  gridLineWidth: 1,
  endLineWidth: 1.5,
  zeroLineWidth: 1,
  gridLineAlpha: 0.022,
  subgridLineAlpha: 0.008,
  endLineAlpha: 0.055,
  zeroLineAlpha: 0.14,
  viewportQuadAlpha: 0.35,

  // Edge fade.
  edgeFade: 24,
  edgeFadeInset: 2,

  // Axis tick labels.
  labelSize: 9,
  labelInsetX: 6,
  labelInsetY: 5,
  labelAlpha: 0.6,
  labelMinGap: 60,
  labelZoomOcta: 0.9,
  labelZoomQuart: 0.75,
  labelZoomHalf: 0.33,

  // Custom cursor.
  cursorReach: 12,
  cursorGapRatio: 0.4,
  cursorAlpha: 0.5,
  cursorLineWidth: 1,

  // Probe.
  probeDotRadius: 8,
  probeBoxSize: 12,
  probeBoxArmRatio: 0.22,
  probeBoxLineWidth: 1.75,
  probeNearRadius: 18,
  probeAppearMs: 4,
  probeDisappearMs: 12,

  // Probe crosshair line mask (fraction of the line that fades).
  lineMaskStart: 0.0,
  lineMaskEnd: 0.3,

  // Misc.
  tileMarginFactor: 0.25,
  dprMin: 1,
  dprMax: 2,
  fitPadding: 18,
} as const;

const JS_ONLY_KEYS: ReadonlySet<keyof RendererTokens> = new Set([
  // Curve + scaffolding lines.
  "gridLineWidth",
  "endLineWidth",
  "zeroLineWidth",
  "gridLineAlpha",
  "subgridLineAlpha",
  "endLineAlpha",
  "zeroLineAlpha",
  // Edge fade.
  "edgeFade",
  "edgeFadeInset",
  // Axis tick labels.
  "labelSize",
  "labelInsetX",
  "labelInsetY",
  "labelAlpha",
  "labelMinGap",
  "labelZoomOcta",
  "labelZoomQuart",
  "labelZoomHalf",
  // Custom cursor.
  "cursorReach",
  "cursorGapRatio",
  "cursorAlpha",
  "cursorLineWidth",
  // Probe.
  "probeDotRadius",
  "probeBoxSize",
  "probeBoxArmRatio",
  "probeBoxLineWidth",
  "probeNearRadius",
  "probeAppearMs",
  "probeDisappearMs",
  // Probe crosshair line mask.
  "lineMaskStart",
  "lineMaskEnd",
  // F-key fit padding (no CSS source; read via readTokens -> DEFAULTS).
  "fitPadding",
]);

// ---------------------------------------------------------------------------
// CSS → values
// ---------------------------------------------------------------------------

const NUMERIC_VARS: Partial<Record<keyof RendererTokens, string>> = {
  curveLineWidth: "--curve-line-width",
  cursorReach: "--cursor-reach",
  cursorGapRatio: "--cursor-gap-ratio",
  viewportQuadAlpha: "--viewport-quad-alpha",
  probeDotRadius: "--probe-dot-radius",
  probeBoxSize: "--probe-box-size",
  probeBoxArmRatio: "--probe-box-arm-ratio",
  probeBoxLineWidth: "--probe-box-line-width",
  probeNearRadius: "--probe-near-radius",
  probeAppearMs: "--probe-appear-ms",
  probeDisappearMs: "--probe-disappear-ms",
  lineMaskStart: "--line-mask-start",
  lineMaskEnd: "--line-mask-end",
  tileMarginFactor: "--tile-margin-factor",
  dprMin: "--dpr-min",
  dprMax: "--dpr-max",
};

export const readTokens = (root: HTMLElement): RendererTokens => {
  const style = getComputedStyle(root);
  const result = {} as Record<keyof RendererTokens, number>;
  (Object.keys(NUMERIC_VARS) as Array<keyof RendererTokens>).forEach((key) => {
    const cssName = NUMERIC_VARS[key];
    if (!cssName) return;
    const raw = parseFloat(style.getPropertyValue(cssName));
    result[key] = Number.isFinite(raw) ? raw : DEFAULTS[key];
  });
  JS_ONLY_KEYS.forEach((key) => {
    result[key] = DEFAULTS[key];
  });
  return result;
};
