import type {
  CurvePoint,
  CurveRect,
  CurveTileMetrics,
  CurveViewportState,
  CurveWrapMode,
} from "../../curveViewportMath";
import { getLoopWorldY, wrapWorldX } from "../../curveViewportMath";
import { type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";

export type FieldRenderArgs = {
  ctx: CanvasRenderingContext2D;
  points: CurvePoint[];
  baseRect: CurveRect;
  visible: CurveRect;
  metrics: CurveTileMetrics;
  range: readonly [number, number];
  state: CurveViewportState;
  colors: RendererColors;
  tokens: RendererTokens;
  screen: { width: number; height: number };
  screenPoint: (point: CurvePoint) => CurvePoint;
};

const FIELD_SIZE_DEFAULT = 72;

// Field is a UV map of the user's visible world rect: every source
// pixel (sx, sy) maps to a world point inside `visible`, samples
// the curve at that X (respecting the current wrap mode), and
// shades by |curve(x) - y| — the SDF of the curve as a contour in
// 2D. The source is then drawImage'd to the live canvas. Click-
// drag zoom (which shrinks/grows `visible`) changes what the field
// shows: zooming in shows a tighter slice of the curve, zooming
// out shows more. The X and Y spans are independent (driven by
// state.zoomX / state.zoomY), so non-uniform zoom stretches the
// field naturally. The X axis is mapped right-to-left in the source
// (source x=0 is the right edge of the visible rect) so the
// drawImage stretch reads left-to-right on screen, matching the
// curve's natural left-to-right domain.
export const renderField = ({
  ctx,
  points,
  visible,
  metrics,
  range: _range,
  state,
  colors,
  tokens,
  screen,
  screenPoint: _screenPoint,
}: FieldRenderArgs): void => {
  if (points.length < 2) return;

  const w = tokens.fieldSize || FIELD_SIZE_DEFAULT;
  const h = w;
  const field = document.createElement("canvas");
  field.width = w;
  field.height = h;
  const fctx = field.getContext("2d");
  if (!fctx) return;

  const image = fctx.createImageData(w, h);
  const data = image.data;
  const rgb = parseRgb(colors.curve);
  // The SDF's distance metric is the curve's own value at each X:
  // the band's thickness at worldX is proportional to |f(worldX)|.
  // Where the curve is high (|f| near 1), the band is thick; where
  // it's low (|f| near 0), the band is thin. A tiny epsilon floor
  // keeps the band visible at the curve's zero crossings.
  const xMin = visible.x;
  const xMax = visible.x + visible.w;
  const yMin = visible.y;
  const yMax = visible.y + visible.h;
  const wrapMode: CurveWrapMode = state.wrapMode;

  for (let y = 0; y < h; y += 1) {
    // Source y=0 lands at screen y=0 (top of screen). screenPoint
    // maps world y=visible.y (low) to screen y=0. So source y=0
    // must correspond to the lowest curve value (yMin) and source
    // y=h-1 to the highest (yMax) for the SDF to align with the
    // curve stroke.
    const curveY = yMin + (y / (h - 1)) * visible.h;
    for (let x = 0; x < w; x += 1) {
      // Source x=0 lands at screen x=0 (left). screenPoint maps
      // world x=visible.x (left edge) to screen x=0. So source x=0
      // corresponds to the left edge of the viewport (xMin) and
      // source x=w-1 to the right edge (xMax).
      const worldX = xMin + (x / (w - 1)) * visible.w;
      const sample = sampleCurveWrap(points, metrics, worldX, wrapMode);
      let alpha = 0;
      if (sample !== null) {
        // SDF of the curve: brightest at the curve (curveY == sample),
        // fading to 0 at |sample| units away in Y. The 1e-6 floor
        // keeps the band visible at the curve's zero crossings.
        const distance = curveY - sample;
        const mag = Math.max(1e-6, Math.abs(sample) + 1);
        const t = Math.abs(distance) / mag;
        alpha = Math.max(0, Math.min(1, 1 - t));
      }
      const idx = (y * w + x) * 4;
      data[idx] = rgb[0];
      data[idx + 1] = rgb[1];
      data[idx + 2] = rgb[2];
      data[idx + 3] = Math.round(alpha * 220);
    }
  }

  fctx.putImageData(image, 0, 0);

  resetCtx(ctx);
  try {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(field, 0, 0, screen.width, screen.height);
  } finally {
    ctx.restore();
  }

  void _screenPoint;
  void _range;
};

// Sample the polyline at the given viewBox X, respecting the current
// wrap mode. clamp: pin to the polyline's X range. repeat / mirror /
// loop: tile the polyline's pitch, transforming X into the canonical
// tile's local X and applying the wrap's Y offset via getLoopWorldY.
const sampleCurveWrap = (
  points: CurvePoint[],
  metrics: CurveTileMetrics,
  worldX: number,
  mode: CurveWrapMode,
): number | null => {
  if (points.length === 0) return null;
  const { baseX, tile, mirrored } = wrapWorldX(metrics, worldX, mode);
  // Lerp the polyline at baseX in the canonical tile.
  let localY: number | null = null;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (baseX < a.x || baseX > b.x || b.x === a.x) continue;
    const k = (baseX - a.x) / (b.x - a.x);
    localY = a.y + (b.y - a.y) * k;
    break;
  }
  if (localY === null) {
    // Fallback: snap to nearest endpoint.
    const first = points[0];
    const last = points[points.length - 1];
    const distFirst = Math.abs(baseX - first.x);
    const distLast = Math.abs(baseX - last.x);
    localY = distFirst < distLast ? first.y : last.y;
  }
  // Apply mirror: when the tile is mirrored, the polyline's local
  // X is reflected around the tile center, but the Y is also
  // reflected in mirror mode (so the curve goes "backwards" on
  // every other tile). For the field, we keep the polyline's Y as
  // sampled and just shift Y by the loop's vertical offset (loop
  // mode stacks tiles vertically; the other modes don't).
  const worldY = getLoopWorldY(metrics, localY, tile, mode);
  void mirrored; // mirrored tiles reuse the same Y; visual is the same
  return worldY;
};

const parseRgb = (value: string): [number, number, number] => {
  const hex = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }
  return [255, 155, 69];
};
