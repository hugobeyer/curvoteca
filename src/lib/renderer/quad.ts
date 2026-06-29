import type { CurvePoint, CurveRect } from "../curveViewportMath";
import type { RendererTokens } from "./tokens";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FILL_BLACK = "rgba(0, 0, 0, "; // alpha is appended at draw time

// ---------------------------------------------------------------------------
// Viewport quad
// ---------------------------------------------------------------------------
// Drawn behind the grid: a slightly darker shade that visually insets the
// canonical 0..1 viewBox from the surrounding canvas background. The quad is
// projected through the current zoom/center so it stays aligned with the
// axis lines drawn by bounds.ts.

export type DrawViewportQuadArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  screen: { width: number; height: number };
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

export const drawViewportQuad = ({
  ctx,
  baseRect,
  tokens,
  screenPoint,
}: DrawViewportQuadArgs) => {
  const tl = screenPoint({ x: baseRect.x, y: baseRect.y });
  const tr = screenPoint({ x: baseRect.x + baseRect.w, y: baseRect.y });
  const br = screenPoint({
    x: baseRect.x + baseRect.w,
    y: baseRect.y + baseRect.h,
  });
  const bl = screenPoint({ x: baseRect.x, y: baseRect.y + baseRect.h });
  ctx.save();
  ctx.fillStyle = `${FILL_BLACK}${tokens.viewportQuadAlpha})`;
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
