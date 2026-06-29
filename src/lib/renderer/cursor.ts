// ---------------------------------------------------------------------------
// cursor.ts
// Custom canvas-drawn mouse cursor. Replaces the OS cursor on the curve
// view (CSS sets `cursor: none` on .curve-view) with a small soft
// 4-way cross + center ring. Drawn on the main canvas in `render()`
// AFTER the static + bg + probe layers, so it is never faded by the
// edge-fade mask and never occluded by the probe crosshair.
// ---------------------------------------------------------------------------

import { withAlpha, type RendererColors } from "./colors";
import { resetCtx } from "./ctxState";
import type { RendererTokens } from "./tokens";

export type DrawCursorArgs = {
  ctx: CanvasRenderingContext2D;
  /** Mouse position in screen (CSS) pixels. */
  screenPt: { x: number; y: number };
  colors: RendererColors;
  tokens: RendererTokens;
};

export const drawCursor = ({
  ctx,
  screenPt,
  colors,
  tokens,
}: DrawCursorArgs) => {
  const r = Math.max(1, tokens.cursorReach);
  const color = withAlpha(colors.curve2, tokens.cursorAlpha);
  const gap = Math.max(0.5, r * tokens.cursorGapRatio);
  resetCtx(ctx);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = tokens.cursorLineWidth;
  ctx.lineCap = "round";

  // 4-way cross: short ticks along ±x and ±y, leaving a small gap at the
  // center so the cursor reads as "target" rather than "+".
  ctx.beginPath();
  // top tick
  ctx.moveTo(screenPt.x, screenPt.y - r);
  ctx.lineTo(screenPt.x, screenPt.y - gap);
  // bottom tick
  ctx.moveTo(screenPt.x, screenPt.y + gap);
  ctx.lineTo(screenPt.x, screenPt.y + r);
  // left tick
  ctx.moveTo(screenPt.x - r, screenPt.y);
  ctx.lineTo(screenPt.x - gap, screenPt.y);
  // right tick
  ctx.moveTo(screenPt.x + gap, screenPt.y);
  ctx.lineTo(screenPt.x + r, screenPt.y);
  ctx.stroke();

  ctx.restore();
};
