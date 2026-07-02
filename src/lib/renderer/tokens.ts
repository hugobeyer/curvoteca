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
  // Field view offscreen size. The field renderer samples the curve
  // into a square `fieldSize × fieldSize` ImageData and draws it
  // stretched to the live canvas. Bigger = crisper on dense cards
  // (where the source is upscaled), smaller = cheaper. Cost is
  // O(fieldSize²) per static redraw. Keep below 256 to stay under
  // the ramp view's per-frame budget on a 1-column card.
  fieldSize: number;
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
  // Motion view: ms per sweep of the probe across the polyline's X
  // span. One cycle = probe moves from points[0].x to points[last].x.
  motionPeriodMs: number;
  // Motion view: glow alpha multiplier range, scaled by the
  // probe's world velocity (|dy/dx| at the probe's X). Flat
  // sections (|dy/dx| = 0) → min; steep sections (|dy/dx| >=
  // motionGlowVelocityScale) → max. The halo's three color-stop
  // alphas are multiplied by lerp(min, max, min(1, |dy/dx| / scale)).
  motionGlowMin: number;
  motionGlowMax: number;
  // World-velocity scale for the glow ramp. The curve's |dy/dx|
  // is divided by this value (and clamped to 1) to produce the
  // glow multiplier's t parameter. 1.0 is a reasonable default:
  // a 45° slope gives t=1 (max glow), a 30° slope gives t≈0.58.
  motionGlowVelocityScale: number;
  // Motion view: focus disc radius range, in screen pixels,
  // tightened by velocity. The disc around the probe that
  // restores the curve's full intensity is wide on flat sections
  // (radius = max) and tight on steep sections (radius = min).
  // The bright band follows the probe more closely when the
  // curve is moving fast, so the dim / bright transition feels
  // like motion blur, not a static spotlight.
  motionFocusRadiusMin: number;
  motionFocusRadiusMax: number;
  // Motion view: focus stroke line-width range, scaled by
  // velocity. The re-stroke inside the focus disc is thinner
  // on flat sections (width = min) and thicker on steep sections
  // (width = max). Pairs with the alpha / radius ramp so the
  // probe reads as a moving "slug" of intensity, not a fixed
  // marker.
  motionFocusLineWidthMin: number;
  motionFocusLineWidthMax: number;
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
  fieldSize: 96,

  // Edge fade.
  edgeFade: 0,
  edgeFadeInset: 0,

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

  // Motion view: ms per sweep of the probe across the polyline.
  motionPeriodMs: 1600,
  // Motion view: glow range, scaled by the probe's Y. Below
  // the curve's range bottom = min; above the top = max.
  motionGlowMin: 0.01,
  motionGlowMax: 1.4,
  // Motion view: world-velocity scale for the glow ramp.
  motionGlowVelocityScale: 1.0,
  // Motion view: focus disc radius range, tightened by velocity.
  motionFocusRadiusMin: 24,
  motionFocusRadiusMax: 4,
  // Motion view: focus stroke line-width range, scaled by velocity.
  motionFocusLineWidthMin: 1.25,
  motionFocusLineWidthMax: 3.5,
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
  "viewportQuadAlpha",
  "fieldSize",
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
  // Motion view period (no CSS source; read via readTokens -> DEFAULTS).
  "motionPeriodMs",
  // Motion view glow range (no CSS source; read via readTokens -> DEFAULTS).
  "motionGlowMin",
  "motionGlowMax",
  "motionGlowVelocityScale",
  // Motion view focus ramp (no CSS source; read via readTokens -> DEFAULTS).
  "motionFocusRadiusMin",
  "motionFocusRadiusMax",
  "motionFocusLineWidthMin",
  "motionFocusLineWidthMax",
]);

// ---------------------------------------------------------------------------
// CSS → values
// ---------------------------------------------------------------------------
// `NUMERIC_VARS` is the list of tokens that have a CSS custom-property
// source of truth. `JS_ONLY_KEYS` is the list of tokens that are owned by
// `DEFAULTS` in this file (Canvas2D-internal values, see comment block above).
// The two lists must NOT overlap. `readTokens` reads CSS for `NUMERIC_VARS`
// and falls back to `DEFAULTS` for `JS_ONLY_KEYS`.

const NUMERIC_VARS: Partial<Record<keyof RendererTokens, string>> = {
  curveLineWidth: "--curve-line-width",
  viewportQuadAlpha: "--viewport-quad-alpha",
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
    result[key] = parseFloat(style.getPropertyValue(cssName));
  });
  JS_ONLY_KEYS.forEach((key) => {
    result[key] = DEFAULTS[key];
  });
  return result;
};
