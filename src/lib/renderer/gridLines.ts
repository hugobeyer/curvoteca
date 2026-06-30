import {
  gridStepForWidth,
  type CurvePoint,
  type CurveRect,
  DIVISORS_252,
  DIVISORS_128,
} from "../curveViewportMath";
import { withAlpha, type RendererColors } from "./colors";
import { resetCtx } from "./ctxState";
import type { RendererTokens } from "./tokens";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type DrawGridLinesArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  visible: CurveRect;
  screen: { width: number; height: number };
  colors: RendererColors;
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
  /**
   * Whether to draw the subgrid (minor) lines. Defaults to true so
   * the existing call sites are unchanged; the renderer's grid-mode
   * cycle sets it to false in the "lines" mode to drop the subgrid
   * while keeping the major grid + axis labels.
   */
  subgrid?: boolean;
};

// Minimum screen-space gap (CSS px) between adjacent subgrid lines.
// The subgrid applies the same recursive fade as the axis labels:
// as the card shrinks (or the user zooms out), the outermost
// subgrid quarters drop first, then the midpoint, leaving just
// the major lines on the densest layouts. Both decisions feed
// through one screen-space budget, so labels and subgrid recurse
// together.
const SUBGRID_MIN_GAP = 3;

// Within one major interval, the subgrid candidates are at offsets
// 1/4, 2/4, 3/4 (i.e. 0.25, 0.5, 0.75 of the major). Same shape as
// the "half" tier in labels.ts — the midpoint is the anchor, the
// quarters recurse around it. Returns the kept offsets as a fraction
// of one major step. A returned offset of 0 (the major) is not in
// the candidate set; the caller uses this to decide how many
// subgrid passes to draw.
const pickSubgridOffsets = (screenGap: number): number[] => {
  if (screenGap < SUBGRID_MIN_GAP) return [];
  const candidates = [0.25, 0.5, 0.75];
  // Center-out: .5 first, then .25 and .75.
  const centerOut = [...candidates].sort(
    (a, b) => Math.abs(a - 0.5) - Math.abs(b - 0.5),
  );
  const kept: number[] = [];
  for (const t of centerOut) {
    let leftKept = 0;
    let rightKept = 1;
    for (const k of kept) {
      if (k < t && k > leftKept) leftKept = k;
      if (k > t && k < rightKept) rightKept = k;
    }
    const gapLeft = (t - leftKept) * screenGap;
    const gapRight = (rightKept - t) * screenGap;
    if (Math.min(gapLeft, gapRight) < SUBGRID_MIN_GAP) continue;
    kept.push(t);
  }
  kept.sort((a, b) => a - b);
  return kept;
};

export const drawGridLines = ({
  ctx,
  baseRect,
  visible,
  screen,
  colors,
  tokens,
  screenPoint,
  subgrid = true,
}: DrawGridLinesArgs) => {
  const major = gridStepForWidth(visible.w, DIVISORS_252);
  // Halve the horizontal line count: pick the next-coarser supported step
  // (2× majorH), snapped back into DIVISORS_128 so the discrete set is
  // respected.
  const majorH = gridStepForWidth(visible.h * 2, DIVISORS_128);
  const minor = major / 4;

  // Project the subgrid step onto screen pixels. The screen gap is
  // computed from the world-to-screen mapping of the visible range's
  // width. Both `screenSpan` and `subgridScreenGap` are in CSS px.
  const sampleLeft = screenPoint({ x: visible.x, y: baseRect.y }).x;
  const sampleRight = screenPoint({
    x: visible.x + visible.w,
    y: baseRect.y,
  }).x;
  const screenSpan = Math.abs(sampleRight - sampleLeft);
  const subgridScreenGap = (minor / visible.w) * screenSpan;
  // Pick which subgrid offsets survive the fade. The offsets are
  // fractions of one major step, so the caller multiplies them by
  // `major` to get world-space line positions.
  const subgridOffsets = pickSubgridOffsets(subgridScreenGap);

  const topY = screenPoint({ x: baseRect.x, y: baseRect.y }).y;
  const botY = screenPoint({
    x: baseRect.x,
    y: baseRect.y + baseRect.h,
  }).y;
  const gridTop = Math.min(topY, botY);
  const gridBot = Math.max(topY, botY);

  const leftX = screenPoint({ x: baseRect.x, y: baseRect.y }).x;
  const rightX = screenPoint({
    x: baseRect.x + baseRect.w,
    y: baseRect.y,
  }).x;
  const quadLeft = Math.min(leftX, rightX);
  const quadRight = Math.max(leftX, rightX);

  // Hard reset to a known-clean state. The grid must be solid: uniform alpha,
  // no shadow, no blur, no filter. This also defends against any leaked state
  // from a previous draw call on this context.
  resetCtx(ctx);
  ctx.lineWidth = tokens.gridLineWidth;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  // Vertical lines, clipped to the canonical viewBox height. Subgrid
  // is gated by the screen-space budget above; major lines always
  // run. The surviving subgrid offsets are fractions of one major
  // step — for each, we draw the subgrid lines at exactly those
  // positions across the visible range. The "lines" grid mode
  // (subgrid: false) drops the subgrid pass entirely.
  if (subgrid && subgridOffsets.length > 0) {
    drawSubgridLines({
      ctx,
      baseRect,
      visible,
      baseColor: withAlpha(colors.subgrid, tokens.subgridLineAlpha),
      major,
      subgridOffsets,
      gridTop,
      gridBot,
      quadLeft,
      quadRight,
      screenPoint,
    });
  }
  drawVerticalLines({
    ctx,
    baseRect,
    visible,
    baseColor: withAlpha(colors.grid, tokens.gridLineAlpha),
    step: major,
    gridTop,
    gridBot,
    quadLeft,
    quadRight,
    screenPoint,
  });

  // Horizontal lines, full canvas width. The old code had a redundant
  // "subgrid" pass with the same step as the major — a no-op. Removed.
  drawHorizontalLines({
    ctx,
    visible,
    screen,
    baseColor: withAlpha(colors.grid, tokens.gridLineAlpha),
    step: majorH,
    baseRect,
    screenPoint,
  });

  ctx.restore();
};

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

type VerticalArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  visible: CurveRect;
  baseColor: string;
  step: number;
  gridTop: number;
  gridBot: number;
  quadLeft: number;
  quadRight: number;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

const drawVerticalLines = ({
  ctx,
  baseRect,
  visible,
  baseColor,
  step,
  gridTop,
  gridBot,
  quadLeft,
  quadRight,
  screenPoint,
}: VerticalArgs) => {
  const start = Math.ceil(visible.x / step) * step;
  const end = Math.floor((visible.x + visible.w) / step) * step;
  ctx.strokeStyle = baseColor;
  ctx.save();
  ctx.beginPath();
  ctx.rect(quadLeft, gridTop, quadRight - quadLeft, gridBot - gridTop);
  ctx.clip();
  for (let x = start; x <= end; x += step) {
    const sx = Math.round(screenPoint({ x, y: baseRect.y }).x) + 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, gridTop);
    ctx.lineTo(sx, gridBot);
    ctx.stroke();
  }
  ctx.restore();
};

type SubgridArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  visible: CurveRect;
  baseColor: string;
  major: number;
  subgridOffsets: number[];
  gridTop: number;
  gridBot: number;
  quadLeft: number;
  quadRight: number;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

// Draws subgrid lines at the surviving offsets within each major
// interval. The minor step is `major / 4`, so the subgrid positions
// are at `k * major + offset * major` for each major index k. We
// snap to the nearest subgrid position rather than enumerating, to
// avoid float drift over a wide visible range.
const drawSubgridLines = ({
  ctx,
  baseRect,
  visible,
  baseColor,
  major,
  subgridOffsets,
  gridTop,
  gridBot,
  quadLeft,
  quadRight,
  screenPoint,
}: SubgridArgs) => {
  const minor = major / 4;
  ctx.strokeStyle = baseColor;
  ctx.save();
  ctx.beginPath();
  ctx.rect(quadLeft, gridTop, quadRight - quadLeft, gridBot - gridTop);
  ctx.clip();
  for (const offset of subgridOffsets) {
    // Position within the major interval: offset ∈ {0.25, 0.5, 0.75}.
    // Iterate over every 4th-position relative to the major grid.
    const withinMajor = Math.round(offset * 4); // 1, 2, or 3
    const start = Math.ceil(visible.x / minor) * minor;
    const end = Math.floor((visible.x + visible.w) / minor) * minor;
    for (let x = start; x <= end; x += minor) {
      // Skip lines that aren't at the requested within-major offset.
      // Use modulo via the canonical major grid: snap x to the nearest
      // major, then check the residual.
      const k = Math.round(x / major);
      const majorAnchor = k * major;
      const residual = x - majorAnchor;
      const offsetInMinor = Math.round(residual / minor);
      if (offsetInMinor !== withinMajor) continue;
      const sx = Math.round(screenPoint({ x, y: baseRect.y }).x) + 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, gridTop);
      ctx.lineTo(sx, gridBot);
      ctx.stroke();
    }
  }
  ctx.restore();
};

type HorizontalArgs = {
  ctx: CanvasRenderingContext2D;
  visible: CurveRect;
  screen: { width: number; height: number };
  baseColor: string;
  step: number;
  baseRect: CurveRect;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

const drawHorizontalLines = ({
  ctx,
  visible,
  screen,
  baseColor,
  step,
  baseRect,
  screenPoint,
}: HorizontalArgs) => {
  ctx.strokeStyle = baseColor;
  const start = Math.ceil(visible.y / step) * step;
  const end = Math.floor((visible.y + visible.h) / step) * step;
  for (let y = start; y <= end; y += step) {
    const sy = Math.round(screenPoint({ x: baseRect.x, y }).y) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(screen.width, sy);
    ctx.stroke();
  }
};
