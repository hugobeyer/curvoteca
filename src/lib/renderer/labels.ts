// ---------------------------------------------------------------------------
// labels.ts
// Tiny canvas-rendered axis labels. Draws "0", "0.5", and "1" anchored
// just below the bottom horizontal axis line of the canonical viewBox,
// at the world x positions that normalize to those values. At higher
// `state.zoomX`, finer ticks are added (0.25 / 0.75, then 0.125 / 0.375 /
// 0.625 / 0.875) — gated by both the zoom threshold AND a minimum
// screen-space gap so the labels never crowd each other.
//
// Labels are positioned with screen-space pixel insets and clamped
// horizontally so they never bleed off the card. Designed to live in
// the unmasked bg layer: the labels are stable reference marks and
// should not dissolve with the grid/curve at the canvas edges.
// ---------------------------------------------------------------------------

import { getZeroWorldX } from "./curve";
import type {
  CurvePoint,
  CurveRect,
  CurveViewportState,
} from "../curveViewportMath";
import { withAlpha, type RendererColors } from "./colors";
import { resetCtx } from "./ctxState";
import type { RendererTokens } from "./tokens";

export type DrawAxisLabelsArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  visible: CurveRect;
  domain: [number, number] | null;
  state: CurveViewportState;
  screen: { width: number; height: number };
  colors: RendererColors;
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

// Normalized tick positions on the 0..1 mapping. The endpoints (0 and
// 1) are always present; the in-between ticks drop out one at a time
// as the card shrinks — outermost first (.125 / .875), then .25 / .75,
// then .5, leaving just the endpoints on the densest layouts.
// Display formatting drops the leading zero for fractions
// (0.5 → ".5", 0.25 → ".25"), so the endpoints read as "0" and "1"
// while the in-betweens read as ".25", ".5", ".75", etc.
const TICK_CANDIDATES: number[] = [
  0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1,
];

/** Build a recursive tick list from a single screen-space budget.
 *  Each tick is kept only if the projected gap to its nearest
 *  neighbor is large enough to read. The candidate order is sorted
 *  outer-to-inner and we drop from the edges inward, so as the card
 *  shrinks the outermost decimals (.125 / .875) disappear first,
 *  then .25 / .75, then .5 — leaving just "0" and "1" at the
 *  smallest sizes. This is one continuous fade rather than the
 *  step-wise tier transitions of the older approach. */
const buildTickList = (effectiveSpan: number, minGap: number): number[] => {
  // Process candidates center-out so the most useful references (.5,
  // then .25/.75, then .125/.875) survive longest as the card shrinks.
  // For each candidate, the projected gap to the *nearest kept tick
  // on either side* must be ≥ minGap. The center-out order means
  // .5 is the first inner tick considered, then .25 and .75 (which
  // are equidistant from .5), then .125 and .875, then .375 and
  // .625. As the budget shrinks, the outermost decimals drop first.
  const inner: number[] = [];
  // Sort candidates by distance from 0.5, ascending (center first).
  const centerOut = TICK_CANDIDATES.filter((t) => t !== 0 && t !== 1).sort(
    (a, b) => Math.abs(a - 0.5) - Math.abs(b - 0.5),
  );
  for (const t of centerOut) {
    // Find the nearest kept tick on either side. Endpoints are always
    // kept; inner ticks (if any) are sorted, so a linear scan finds
    // the nearest above and below.
    let leftKept = 0;
    let rightKept = 1;
    for (const k of inner) {
      if (k < t && k > leftKept) leftKept = k;
      if (k > t && k < rightKept) rightKept = k;
    }
    const gapLeft = (t - leftKept) * effectiveSpan;
    const gapRight = (rightKept - t) * effectiveSpan;
    if (Math.min(gapLeft, gapRight) < minGap) continue;
    inner.push(t);
  }
  inner.sort((a, b) => a - b);
  return [0, ...inner, 1];
};

export const drawAxisLabels = ({
  ctx,
  baseRect,
  visible,
  domain,
  state,
  screen,
  colors,
  tokens,
  screenPoint,
}: DrawAxisLabelsArgs) => {
  // Reset to a known-clean state. Same pattern as bounds / grid so the
  // labels never inherit shadow, blur, or alpha carry-over.
  resetCtx(ctx);
  ctx.font = `${tokens.labelSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = withAlpha(colors.axis, tokens.labelAlpha);

  // Bottom horizontal axis line — labels sit just below it.
  const axisBottom = screenPoint({
    x: baseRect.x,
    y: baseRect.y + baseRect.h,
  });
  const y = axisBottom.y + tokens.labelInsetY;

  // Build the tick list from the available screen space, then drop
  // the "0" tick if 0 isn't in the curve's domain (the line itself
  // isn't drawn, so the label would mislead). The "1" tick is always
  // valid — it's the anchor of the canonical viewBox, not the curve.
  const effectiveSpan = screen.width * state.zoomX;
  const ticks = buildTickList(effectiveSpan, tokens.labelMinGap).filter(
    (t) => t !== 0 || getZeroWorldX(baseRect, domain) !== null,
  );

  // Drop ticks whose projected screen gap to the previous one is below
  // `minGapPx` — guards against label crowding at extreme zoom. Skips
  // the first tick (no predecessor to compare).
  const minGapPx = tokens.labelMinGap;
  const visibleTicks: number[] = [];
  let prevScreenX = -Infinity;
  for (const t of ticks) {
    const worldX = baseRect.x + baseRect.w * t;
    const sx = screenPoint({ x: worldX, y: baseRect.y }).x;
    if (sx - prevScreenX < minGapPx) continue;
    visibleTicks.push(t);
    prevScreenX = sx;
  }

  // Draw each visible tick. Labels are left-aligned to the tick's screen
  // x with a small rightward offset so the text doesn't sit on the line
  // stroke. Horizontal clamp keeps the glyphs inside the card.
  const labelOffsetX = tokens.labelInsetX;
  for (const t of visibleTicks) {
    const worldX = baseRect.x + baseRect.w * t;
    const sx = screenPoint({ x: worldX, y: baseRect.y }).x;
    const clampedX = Math.max(
      tokens.labelInsetX,
      Math.min(screen.width - tokens.labelInsetX, sx + labelOffsetX),
    );
    // Format: integers stay clean ("0", "1"). Fractions drop the leading
    // zero so 0.5 reads as ".5", 0.25 as ".25", 0.125 as ".125". Trailing
    // zeros are trimmed so 0.50 doesn't render as ".50".
    const text = Number.isInteger(t)
      ? `${t}`
      : `.${t.toFixed(3).split(".")[1].replace(/0+$/, "")}`;
    ctx.fillText(text, clampedX, y);
  }

  ctx.restore();
};
