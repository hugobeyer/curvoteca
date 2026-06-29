// ---------------------------------------------------------------------------
// curveViewportMath.ts
// Shared types and pure math for the per-curve viewport (zoom, pan,
// wrap). Defines `CurveWrapMode`, `CurveViewportState`, `CurvePoint`,
// `CurveRect`, `CurveTileMetrics`, and exports `worldToScreen`,
// `screenToWorld`, `parseViewBox`, `getVisibleWorldRect`, and the
// `computeTileMetrics` / `tileVisibleRects` helpers used by both the
// canvas renderer and the inline preview SVGs. No DOM, no I/O.
// ---------------------------------------------------------------------------

export type CurveWrapMode = "clamp" | "repeat" | "mirror" | "loop";

export type CurveViewportState = {
  zoomX: number;
  zoomY: number;
  centerX: number;
  centerY: number;
  wrapMode: CurveWrapMode;
};

export type CurvePoint = {
  x: number;
  y: number;
};

export type CurveRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CurveTileMetrics = {
  x0: number;
  x1: number;
  pitch: number;
  y0: number;
  y1: number;
  dy: number;
};

export const DEFAULT_CURVE_RECT: CurveRect = { x: 0, y: 0, w: 252, h: 128 };

/**
 * Top-level viewport tuning knobs. Single source of truth for the
 * soft floor/ceiling on the per-axis zoom values. `clampViewportState`
 * and any direct zoom-validation in the host should read from here.
 *
 * The host (e.g. index.astro) is expected to clamp to its own tighter
 * ranges before calling update(); `getVisibleWorldRect` trusts the
 * state and does not re-clamp.
 */
export const VIEWPORT_LIMITS = {
  zoomX: { min: 0.05, max: 1 },
  zoomY: { min: 0.2, max: 2 },
  center: { min: 0, max: 1 },
} as const;

/**
 * Gallery pager. Single source of truth for the wall's pagination.
 * `maxPerPage` is the hard ceiling (the cycle button never exceeds it).
 * `sizes` is the cycle order shown on the size button. The first entry
 * that is >= `maxPerPage` doubles as the default; below it, the user can
 * step down for denser previews.
 */
export const PAGER = {
  maxPerPage: 64,
  sizes: [8, 16, 32, 48, 64] as const,
  defaultSize: 32,
} as const;

/**
 * Given the F-key fit padding in screen pixels (applied to all four
 * sides) and the actual canvas size, returns the zoom values that
 * leave that much symmetric screen-space breathing room on each axis.
 *
 * Padding is in **screen pixels**, not viewBox units, so the visible
 * margin is identical on both axes regardless of the viewBox aspect
 * ratio. The conversion is:
 *
 *   pad_world = pad_px * (viewW / canvasW)
 *   zoom = 1 - 2 * pad_world / viewW
 *        = 1 - 2 * pad_px / canvasW
 *
 * `canvasW/H` are the on-screen pixel dimensions of the curve view
 * (before DPR scaling).
 */
export const fitZoomForPadding = (
  padPx: number,
  canvasW: number,
  canvasH: number,
): { zoomX: number; zoomY: number } => {
  const zx = canvasW > 0 ? Math.max(0.05, 1 - (2 * padPx) / canvasW) : 1;
  const zy = canvasH > 0 ? Math.max(0.05, 1 - (2 * padPx) / canvasH) : 1;
  return { zoomX: zx, zoomY: zy };
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const parseViewBox = (value: string | null | undefined): CurveRect => {
  const parts = (value || "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
  }
  return { ...DEFAULT_CURVE_RECT };
};

// Per-axis zoom limits. Re-exported from VIEWPORT_LIMITS for callers
// that still import the individual names. Edit VIEWPORT_LIMITS, not these.
export const ZOOM_X_MIN = VIEWPORT_LIMITS.zoomX.min;
export const ZOOM_X_MAX = VIEWPORT_LIMITS.zoomX.max;
export const ZOOM_Y_MIN = VIEWPORT_LIMITS.zoomY.min;
export const ZOOM_Y_MAX = VIEWPORT_LIMITS.zoomY.max;

export const clampViewportState = (
  state: CurveViewportState,
): CurveViewportState => ({
  zoomX: clamp(
    state.zoomX,
    VIEWPORT_LIMITS.zoomX.min,
    VIEWPORT_LIMITS.zoomX.max,
  ),
  zoomY: clamp(
    state.zoomY,
    VIEWPORT_LIMITS.zoomY.min,
    VIEWPORT_LIMITS.zoomY.max,
  ),
  centerX: clamp(
    state.centerX,
    VIEWPORT_LIMITS.center.min,
    VIEWPORT_LIMITS.center.max,
  ),
  centerY: clamp(
    state.centerY,
    VIEWPORT_LIMITS.center.min,
    VIEWPORT_LIMITS.center.max,
  ),
  wrapMode: state.wrapMode,
});

export const getVisibleWorldRect = (
  base: CurveRect,
  state: CurveViewportState,
): CurveRect => {
  const w = base.w / state.zoomX;
  const h = base.h / state.zoomY;
  return {
    x: base.x + (base.w - w) * state.centerX,
    y: base.y + (base.h - h) * state.centerY,
    w,
    h,
  };
};

export const worldToScreen = (
  point: CurvePoint,
  visible: CurveRect,
  screen: { width: number; height: number },
): CurvePoint => ({
  x: ((point.x - visible.x) / visible.w) * screen.width,
  y: ((point.y - visible.y) / visible.h) * screen.height,
});

export const screenToWorld = (
  point: CurvePoint,
  visible: CurveRect,
  screen: { width: number; height: number },
): CurvePoint => ({
  x: visible.x + (point.x / Math.max(1, screen.width)) * visible.w,
  y: visible.y + (point.y / Math.max(1, screen.height)) * visible.h,
});

export const DIVISORS_252 = [
  1, 2, 3, 4, 6, 7, 9, 12, 14, 18, 21, 28, 36, 42, 63, 84, 126, 252,
];
export const DIVISORS_128 = [1, 2, 4, 8, 16, 32, 64, 128];

export const gridStepForWidth = (visibleWidth: number, divisors: number[]) => {
  const target = visibleWidth / 10;
  return divisors.reduce((best, step) =>
    Math.abs(target - step) < Math.abs(target - best) ? step : best,
  );
};

export const getGridStep = (visibleWidth: number) => {
  const target = visibleWidth / 10;
  const steps = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192];
  return steps.reduce((best, step) =>
    Math.abs(target - step) < Math.abs(target - best) ? step : best,
  );
};

export const getTileMetrics = (
  points: CurvePoint[],
  fallback: CurveRect = DEFAULT_CURVE_RECT,
): CurveTileMetrics => {
  const first = points[0];
  const last = points[points.length - 1];
  if (first && last) {
    const x0 = Math.min(first.x, last.x);
    const x1 = Math.max(first.x, last.x);
    const pitch = x1 - x0;
    if (pitch > 0.01) {
      return {
        x0,
        x1,
        pitch,
        y0: first.y,
        y1: last.y,
        dy: last.y - first.y,
      };
    }
  }
  return {
    x0: fallback.x,
    x1: fallback.x + fallback.w,
    pitch: fallback.w,
    y0: fallback.y + fallback.h,
    y1: fallback.y,
    dy: -fallback.h,
  };
};

export const wrapWorldX = (
  metrics: CurveTileMetrics,
  worldX: number,
  mode: CurveWrapMode,
) => {
  if (mode === "clamp") {
    return {
      baseX: clamp(worldX, metrics.x0, metrics.x1),
      tile: 0,
      mirrored: false,
    };
  }
  const rel = worldX - metrics.x0;
  const tile = Math.floor(rel / metrics.pitch);
  const local = rel - tile * metrics.pitch;
  const mirrored = mode === "mirror" && tile % 2 !== 0;
  return {
    baseX: metrics.x0 + (mirrored ? metrics.pitch - local : local),
    tile,
    mirrored,
  };
};

export const unwrapBaseX = (
  metrics: CurveTileMetrics,
  baseX: number,
  tile: number,
  mirrored: boolean,
) => {
  const tileStart = metrics.x0 + tile * metrics.pitch;
  const local = baseX - metrics.x0;
  return tileStart + (mirrored ? metrics.pitch - local : local);
};

export const getLoopWorldY = (
  metrics: CurveTileMetrics,
  baseY: number,
  tile: number,
  mode: CurveWrapMode,
) => (mode === "loop" ? baseY + tile * metrics.dy : baseY);
