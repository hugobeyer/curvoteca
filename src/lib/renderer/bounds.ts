import type { CurvePoint, CurveRect } from "../curveViewportMath";
import { getZeroWorldX, getZeroWorldY } from "./curve";
import { withAlpha, type RendererColors } from "./colors";
import { resetCtx } from "./ctxState";
import type { RendererTokens } from "./tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Bound = {
  a: CurvePoint;
  b: CurvePoint;
  color: string;
  width: number;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type DrawBoundsArgs = {
  ctx: CanvasRenderingContext2D;
  baseRect: CurveRect;
  visible: CurveRect;
  domain: [number, number] | null;
  range: [number, number] | null;
  colors: RendererColors;
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

export const drawBounds = ({
  ctx,
  baseRect,
  visible,
  domain,
  range,
  colors,
  tokens,
  screenPoint,
}: DrawBoundsArgs) => {
  // Axis lines only — zero lines are drawn separately via drawZeroLines
  // so they can sit in the unmasked bg layer (the 0 reference is a
  // stable visual anchor; it shouldn't dissolve with the grid).
  const bounds = buildAxisBounds(baseRect, visible, colors, tokens);
  // Reset to a known-clean state so bounds always render solid, with no
  // shadow, blur, or filter leaking in from previous draw calls.
  resetCtx(ctx);
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  bounds.forEach((line) => {
    const a = screenPoint(line.a);
    const b = screenPoint(line.b);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;
    ctx.beginPath();
    ctx.moveTo(Math.round(a.x) + 0.5, Math.round(a.y) + 0.5);
    ctx.lineTo(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5);
    ctx.stroke();
  });
  ctx.restore();
};

export const drawZeroLines = ({
  ctx,
  baseRect,
  visible,
  domain,
  range,
  colors,
  tokens,
  screenPoint,
}: DrawBoundsArgs) => {
  const lines = buildZeroBounds(
    baseRect,
    visible,
    domain,
    range,
    colors,
    tokens,
  );
  if (lines.length === 0) return;
  resetCtx(ctx);
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  lines.forEach((line) => {
    const a = screenPoint(line.a);
    const b = screenPoint(line.b);
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;
    ctx.beginPath();
    ctx.moveTo(Math.round(a.x) + 0.5, Math.round(a.y) + 0.5);
    ctx.lineTo(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5);
    ctx.stroke();
  });
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const buildAxisBounds = (
  baseRect: CurveRect,
  visible: CurveRect,
  colors: RendererColors,
  tokens: RendererTokens,
): Bound[] => {
  // Axis lines = the four edges of the canonical viewBox (left/right span
  // visible Y, top/bottom span visible X). Each is drawn with the axis
  // color + alpha and the shared axis line width.
  const axisColor = withAlpha(colors.axis, tokens.endLineAlpha);
  return [
    {
      a: { x: baseRect.x, y: visible.y },
      b: { x: baseRect.x, y: visible.y + visible.h },
      color: axisColor,
      width: tokens.endLineWidth,
    },
    {
      a: { x: baseRect.x + baseRect.w, y: visible.y },
      b: { x: baseRect.x + baseRect.w, y: visible.y + visible.h },
      color: axisColor,
      width: tokens.endLineWidth,
    },
    {
      a: { x: visible.x, y: baseRect.y },
      b: { x: visible.x + visible.w, y: baseRect.y },
      color: axisColor,
      width: tokens.endLineWidth,
    },
    {
      a: { x: visible.x, y: baseRect.y + baseRect.h },
      b: { x: visible.x + visible.w, y: baseRect.y + baseRect.h },
      color: axisColor,
      width: tokens.endLineWidth,
    },
  ];
};

const buildZeroBounds = (
  baseRect: CurveRect,
  visible: CurveRect,
  domain: [number, number] | null,
  range: [number, number] | null,
  colors: RendererColors,
  tokens: RendererTokens,
): Bound[] => {
  // Zero lines = the world x=0 vertical and y=0 horizontal, drawn only when
  // 0 lies within the curve's domain/range. Each carries its own width +
  // alpha (tokens.zeroLineWidth / zeroLineAlpha) so it can be tuned
  // independently from the canonical viewBox edges. Rendered separately
  // from the axis lines so the unmasked bg layer can host them.
  const zeroColor = withAlpha(colors.zero, tokens.zeroLineAlpha);
  const out: Bound[] = [];
  const zeroX = getZeroWorldX(baseRect, domain);
  if (zeroX !== null) {
    out.push({
      a: { x: zeroX, y: visible.y },
      b: { x: zeroX, y: visible.y + visible.h },
      color: zeroColor,
      width: tokens.zeroLineWidth,
    });
  }
  const zeroY = getZeroWorldY(baseRect, range);
  if (zeroY !== null) {
    out.push({
      a: { x: visible.x, y: zeroY },
      b: { x: visible.x + visible.w, y: zeroY },
      color: zeroColor,
      width: tokens.zeroLineWidth,
    });
  }
  return out;
};
