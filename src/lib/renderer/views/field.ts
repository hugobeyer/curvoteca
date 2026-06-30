import type {
  CurvePoint,
  CurveRect,
  CurveViewportState,
} from "../../curveViewportMath";
import { withAlpha, type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";
import { viewBoxYToCurveY } from "./ramp";

export type FieldRenderArgs = {
  ctx: CanvasRenderingContext2D;
  points: CurvePoint[];
  baseRect: CurveRect;
  range: readonly [number, number];
  state: CurveViewportState;
  colors: RendererColors;
  tokens: RendererTokens;
  screen: { width: number; height: number };
  screenPoint: (point: CurvePoint) => CurvePoint;
};

const FIELD_SIZE = 72;

export const renderField = ({
  ctx,
  points,
  baseRect,
  range,
  state,
  colors,
  tokens,
  screen,
  screenPoint,
}: FieldRenderArgs): void => {
  if (points.length < 2) return;
  const [rMin, rMax] = range;
  const rSpan = rMax - rMin;
  if (rSpan === 0) return;

  const w = FIELD_SIZE;
  const h = FIELD_SIZE;
  const field = document.createElement("canvas");
  field.width = w;
  field.height = h;
  const fctx = field.getContext("2d");
  if (!fctx) return;

  const image = fctx.createImageData(w, h);
  const data = image.data;
  const rgb = parseRgb(colors.curve);
  const origin = screenPoint({
    x: 0,
    y: curveValueToViewBoxY(0, baseRect, rMin, rSpan),
  });
  const maxDist = Math.max(
    1,
    Math.hypot(origin.x, origin.y),
    Math.hypot(screen.width - origin.x, origin.y),
    Math.hypot(origin.x, screen.height - origin.y),
    Math.hypot(screen.width - origin.x, screen.height - origin.y),
  );

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const sx = (x / (w - 1)) * screen.width;
      const sy = (y / (h - 1)) * screen.height;
      const d = Math.min(1, Math.hypot(sx - origin.x, sy - origin.y) / maxDist);
      const v = sampleCurve(points, baseRect, rMax, rSpan, d);
      const alpha = Math.max(0, Math.min(1, Math.abs(v)));
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
    ctx.strokeStyle = withAlpha(colors.curve, tokens.endLineAlpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2);
    ctx.stroke();
  } finally {
    ctx.restore();
  }

  void state;
};

const sampleCurve = (
  points: CurvePoint[],
  baseRect: CurveRect,
  rMax: number,
  rSpan: number,
  t: number,
): number => {
  const targetX = baseRect.x + t * baseRect.w;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (targetX < a.x || targetX > b.x || b.x === a.x) continue;
    const k = (targetX - a.x) / (b.x - a.x);
    const y = a.y + (b.y - a.y) * k;
    return viewBoxYToCurveY(y, baseRect, rMax, rSpan);
  }
  return 0;
};

const curveValueToViewBoxY = (
  value: number,
  baseRect: CurveRect,
  rMin: number,
  rSpan: number,
): number => baseRect.y + (1 - (value - rMin) / rSpan) * baseRect.h;

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
