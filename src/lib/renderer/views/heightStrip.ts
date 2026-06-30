// ---------------------------------------------------------------------------
// Height strip view.
//
// Filled profile from zero/bottom baseline to the curve, like a compact
// terrain/envelope silhouette.
// ---------------------------------------------------------------------------

import type {
  CurvePoint,
  CurveRect,
  CurveViewportState,
} from "../../curveViewportMath";
import { withAlpha, type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";
import type { RampColors, RampTokens } from "./ramp";
import { getTileRange, tiledX } from "./ramp";

export type HeightStripRenderArgs = {
  ctx: CanvasRenderingContext2D;
  points: CurvePoint[];
  baseRect: CurveRect;
  visible: CurveRect;
  range: readonly [number, number];
  state: CurveViewportState;
  tokens: RampTokens;
  colors: RampColors;
  baseColors: RendererColors;
  baseTokens: RendererTokens;
  screen: { width: number; height: number };
  screenPoint: (point: CurvePoint) => CurvePoint;
};

export const renderHeightStrip = ({
  ctx,
  points,
  baseRect,
  visible,
  range,
  state,
  tokens,
  colors,
  baseColors,
  baseTokens,
  screen,
  screenPoint,
}: HeightStripRenderArgs): void => {
  if (points.length < 2) return;

  const [rMin, rMax] = range;
  const rSpan = rMax - rMin;
  if (rSpan === 0) return;

  const baselineY = screenPoint({
    x: baseRect.x,
    y: baselineViewBoxY(baseRect, rMin, rMax),
  }).y;
  const x0 = points[0].x;
  const x1 = points[points.length - 1].x;
  const pitch = x1 - x0;
  const tileRange = getTileRange(state, pitch, visible, x0, x1, baseTokens);

  resetCtx(ctx);
  try {
    ctx.beginPath();
    ctx.rect(0, 0, screen.width, screen.height);
    ctx.clip();

    for (let tile = tileRange.start; tile <= tileRange.end; tile++) {
      const mirrored = state.wrapMode === "mirror" && Math.abs(tile) % 2 !== 0;
      const screenPts = projectTile(points, baseRect, x0, x1, pitch, tile, mirrored, state, screenPoint);

      drawFilledShape(
        ctx,
        screenPts,
        baselineY,
        tokens,
        colors,
      );
      strokeCurve(ctx, screenPts, baseColors.curve, baseTokens.curveLineWidth);
    }
  } finally {
    ctx.restore();
  }
};

const projectTile = (
  points: CurvePoint[],
  baseRect: CurveRect,
  x0: number,
  x1: number,
  pitch: number,
  tile: number,
  mirrored: boolean,
  state: CurveViewportState,
  screenPoint: (point: CurvePoint) => CurvePoint,
): CurvePoint[] => {
  const screenPts: CurvePoint[] = new Array(points.length);
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      screenPts[i] = { x: NaN, y: NaN };
      continue;
    }
    const tx = tiledX(point.x, x0, pitch, tile, mirrored);
    if (state.wrapMode === "clamp" && (tx < x0 || tx > x1)) {
      screenPts[i] = { x: NaN, y: NaN };
      continue;
    }
    screenPts[i] = screenPoint({ x: tx, y: point.y });
  }
  void baseRect;
  return screenPts;
};

const drawFilledShape = (
  ctx: CanvasRenderingContext2D,
  screenPts: CurvePoint[],
  baselineY: number,
  tokens: RampTokens,
  colors: RampColors,
) => {
  const finite = screenPts.filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  );
  if (finite.length < 2) return;

  const alpha = Math.min(0.5, Math.max(0.18, tokens.posAlpha * 0.42));
  ctx.fillStyle = withAlpha(colors.pos, alpha);
  ctx.beginPath();
  ctx.moveTo(finite[0].x, baselineY);
  finite.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(finite[finite.length - 1].x, baselineY);
  ctx.closePath();
  ctx.fill();
};

const strokeCurve = (
  ctx: CanvasRenderingContext2D,
  points: CurvePoint[],
  color: string,
  lineWidth: number,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  let started = false;
  points.forEach((point) => {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      started = false;
      return;
    }
    if (!started) {
      ctx.moveTo(point.x, point.y);
      started = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
};

const baselineViewBoxY = (
  baseRect: CurveRect,
  rMin: number,
  rMax: number,
): number => {
  const rSpan = rMax - rMin;
  if (rMin <= 0 && rMax >= 0) {
    return baseRect.y + (1 - (0 - rMin) / rSpan) * baseRect.h;
  }
  return rMin > 0 ? baseRect.y + baseRect.h : baseRect.y;
};
