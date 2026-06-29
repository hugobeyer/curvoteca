import {
  getLoopWorldY,
  type CurvePoint,
  type CurveRect,
  type CurveTileMetrics,
  type CurveViewportState,
  type CurveWrapMode,
} from "../curveViewportMath";
import type { RendererColors } from "./colors";
import { resetCtx } from "./ctxState";
import type { RendererTokens } from "./tokens";

// ---------------------------------------------------------------------------
// Data parsing
// ---------------------------------------------------------------------------

export const parseSampledPoints = (json: string): CurvePoint[] => {
  if (!json) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  const out: CurvePoint[] = [];
  for (const entry of raw) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const x = Number(entry[0]);
    const y = Number(entry[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    out.push({ x, y });
  }
  return out;
};

export const samplePolylineAtX = (
  points: CurvePoint[],
  x: number,
): CurvePoint | null => {
  if (points.length === 0) return null;
  let best: CurvePoint | null = null;
  let bestDist = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    if (x >= minX && x <= maxX && Math.abs(b.x - a.x) > 0.0001) {
      const t = (x - a.x) / (b.x - a.x);
      return { x, y: a.y + (b.y - a.y) * t };
    }
    [a, b].forEach((p) => {
      const dist = Math.abs(p.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    });
  }
  return best;
};

// ---------------------------------------------------------------------------
// Zero lines
// ---------------------------------------------------------------------------
// World x=0 (vertical) and y=0 (horizontal) are drawn as the "zero" axis
// lines by `bounds.ts` whenever 0 lies inside the curve's domain/range.
// `getZeroWorldX` / `getZeroWorldY` resolve the world position from the
// base rect; bounds.ts applies the zeroLineWidth / zeroLineAlpha tokens
// and the --zero base color.
// ---------------------------------------------------------------------------

export const getZeroWorldY = (
  base: CurveRect,
  range: [number, number] | null,
): number | null => {
  if (!range) return null;
  const [min, max] = range;
  const span = max - min;
  if (span === 0) return null;
  if (0 < min || 0 > max) return null;
  return base.y + base.h * (max / span);
};

export const getZeroWorldX = (
  base: CurveRect,
  domain: [number, number] | null,
): number | null => {
  if (!domain) return null;
  const [min, max] = domain;
  const span = max - min;
  if (span === 0) return null;
  if (0 < min || 0 > max) return null;
  return base.x + base.w * (-min / span);
};

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const drawPolyline = (
  ctx: CanvasRenderingContext2D,
  points: CurvePoint[],
  mapPoint: (point: CurvePoint) => CurvePoint,
) => {
  if (points.length < 2) return;
  points.forEach((point, index) => {
    const mapped = mapPoint(point);
    if (index === 0) ctx.moveTo(mapped.x, mapped.y);
    else ctx.lineTo(mapped.x, mapped.y);
  });
};

export type DrawCurveArgs = {
  ctx: CanvasRenderingContext2D;
  points: CurvePoint[];
  metrics: CurveTileMetrics;
  visible: CurveRect;
  state: CurveViewportState;
  screen: { width: number; height: number };
  colors: RendererColors;
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

export const drawCurve = ({
  ctx,
  points,
  metrics,
  visible,
  state,
  colors,
  tokens,
  screenPoint,
}: DrawCurveArgs) => {
  if (points.length < 2) return;
  // Reset to a known-clean state so the curve is always solid: no shadow,
  // no filter, no globalAlpha carry-over from a previous draw call.
  resetCtx(ctx);
  ctx.strokeStyle = colors.curve;
  ctx.lineWidth = tokens.curveLineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  const drawTile = (tile: number, mode: CurveWrapMode) => {
    const mirrored = mode === "mirror" && tile % 2 !== 0;
    drawPolyline(ctx, points, (point) => {
      const local = point.x - metrics.x0;
      const world = {
        x:
          metrics.x0 +
          tile * metrics.pitch +
          (mirrored ? metrics.pitch - local : local),
        y: getLoopWorldY(metrics, point.y, tile, mode),
      };
      return screenPoint(world);
    });
  };

  if (state.wrapMode === "clamp") {
    drawTile(0, "clamp");
  } else {
    const margin = Math.max(metrics.pitch, visible.w * tokens.tileMarginFactor);
    const startTile = Math.floor(
      (visible.x - metrics.x1 - margin) / metrics.pitch,
    );
    const endTile = Math.ceil(
      (visible.x + visible.w - metrics.x0 + margin) / metrics.pitch,
    );
    for (let tile = startTile; tile <= endTile; tile++) {
      drawTile(tile, state.wrapMode);
    }
  }
  ctx.stroke();
  ctx.restore();
};
