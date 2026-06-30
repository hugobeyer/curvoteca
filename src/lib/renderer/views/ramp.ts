// ---------------------------------------------------------------------------
// Ramp view.
//
// Rectangular value band. The curve remaps each horizontal sample into
// brightness/alpha. The band itself spans the screen-space y=0..1 range,
// so vertical zoom/pan affects it like the graph's height map.
// ---------------------------------------------------------------------------

import type {
  CurvePoint,
  CurveRect,
  CurveViewportState,
} from "../../curveViewportMath";
import { withAlpha, type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";

export type RampTokens = {
  barH: number;
  barRadius: number;
  barGap: number;
  barTop: number;
  zeroLineW: number;
  zeroLineAlpha: number;
  posAlpha: number;
  negAlpha: number;
  frameAlpha: number;
  gradientFloor: number;
};

export type RampColors = {
  pos: string;
  neg: string;
  zero: string;
  barBg: string;
  frame: string;
};

const RAMP_CSS_VARS: Readonly<Record<keyof RampTokens, string>> = {
  barH: "--ramp-bar-h",
  barRadius: "--ramp-bar-radius",
  barGap: "--ramp-bar-gap",
  barTop: "--ramp-bar-top",
  zeroLineW: "--ramp-zero-line-w",
  zeroLineAlpha: "--ramp-zero-line-alpha",
  posAlpha: "--ramp-pos-alpha",
  negAlpha: "--ramp-neg-alpha",
  frameAlpha: "--ramp-frame-alpha",
  gradientFloor: "--ramp-gradient-floor",
};

const RAMP_COLOR_VARS: Readonly<Record<keyof RampColors, string>> = {
  pos: "--ramp-pos-color",
  neg: "--ramp-neg-color",
  zero: "--ramp-zero-color",
  barBg: "--ramp-bar-bg",
  frame: "--ramp-frame-color",
};

export const readRampTokens = (root: HTMLElement): RampTokens => {
  const style = getComputedStyle(root);
  const out = {} as Record<keyof RampTokens, number>;
  (Object.keys(RAMP_CSS_VARS) as Array<keyof RampTokens>).forEach((key) => {
    out[key] = parseFloat(style.getPropertyValue(RAMP_CSS_VARS[key]));
  });
  return out as RampTokens;
};

export const readRampColors = (root: HTMLElement): RampColors => {
  const style = getComputedStyle(root);
  const out = {} as Record<keyof RampColors, string>;
  (Object.keys(RAMP_COLOR_VARS) as Array<keyof RampColors>).forEach((key) => {
    out[key] = readCssColor(style, RAMP_COLOR_VARS[key]);
  });
  return out as RampColors;
};

export const readCssColor = (
  style: CSSStyleDeclaration,
  name: string,
): string => {
  const value = style.getPropertyValue(name).trim();
  const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  return alias ? style.getPropertyValue(alias).trim() : value;
};

export type RampRenderArgs = {
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

const RAMP_SIZE_DEFAULT = 72;

// Ramp is rendered as a pixel-imaged source, the same way as the
// field view: a small off-screen `ImageData` whose columns are
// shaded with the curve's per-X output (sample → viewBox Y → curve
// Y → rampAlpha → dominant sign's color), then drawImage'd across
// the bar's width with smoothing. The per-X shading is identical
// to the previous fillRampSegment math (gradient floor, |y|/scale,
// pos/neg split); the only thing that changes is how the columns
// are presented to the canvas — a per-pixel buffer instead of one
// fillRect per polyline segment with a linear gradient. This keeps
// the visual a step-function at zero crossings (the field's SDF
// math is intentionally NOT used here).
export const renderRamp = ({
  ctx,
  points,
  baseRect,
  visible,
  range,
  state,
  tokens,
  colors,
  baseColors: _baseColors,
  baseTokens,
  screen,
  screenPoint,
}: RampRenderArgs): void => {
  if (points.length < 2) return;

  const [rMin, rMax] = range;
  const rSpan = rMax - rMin;
  if (rSpan === 0) return;

  const scale = Math.max(Math.abs(rMin), Math.abs(rMax), 1);
  const zeroY = screenPoint({
    x: baseRect.x,
    y: curveValueToViewBoxY(0, baseRect, rMin, rSpan),
  }).y;
  const oneY = screenPoint({
    x: baseRect.x,
    y: curveValueToViewBoxY(1, baseRect, rMin, rSpan),
  }).y;
  const barY = Math.min(zeroY, oneY);
  const barH = Math.max(1, Math.abs(oneY - zeroY));

  const x0 = points[0].x;
  const x1 = points[points.length - 1].x;
  const pitch = x1 - x0;
  const tileRange = getTileRange(state, pitch, visible, x0, x1, baseTokens);

  // Build a 1×w source image covering the visible X range. Each
  // column samples the polyline at its worldX (respecting the wrap
  // mode and tile range), and is shaded exactly like the previous
  // fillRampSegment: dominant-sign color, alpha = rampAlpha(y,
  // scale, baseAlpha, gradientFloor). The drawImage stretch to
  // (screen.width, barH) does the smoothing.
  const w = RAMP_SIZE_DEFAULT;
  const source = document.createElement("canvas");
  source.width = w;
  source.height = 1;
  const sctx = source.getContext("2d");
  if (!sctx) return;

  const image = sctx.createImageData(w, 1);
  const data = image.data;
  const posRgb = parseRgb(colors.pos);
  const negRgb = parseRgb(colors.neg);
  const xMin = visible.x;
  const xMax = visible.x + visible.w;
  const basePosAlpha = tokens.posAlpha;
  const baseNegAlpha = tokens.negAlpha;
  const floor = tokens.gradientFloor;

  for (let x = 0; x < w; x += 1) {
    const worldX = xMin + (x / (w - 1)) * (xMax - xMin);
    const sampled = sampleRampColumn(
      points,
      x0,
      x1,
      pitch,
      state.wrapMode,
      tileRange,
      worldX,
      baseRect,
      rMax,
      rSpan,
    );
    let rgb: [number, number, number] = posRgb;
    let alpha = 0;
    if (sampled !== null) {
      const positive = sampled >= 0;
      rgb = positive ? posRgb : negRgb;
      const baseAlpha = positive ? basePosAlpha : baseNegAlpha;
      alpha = rampAlpha(sampled, scale, baseAlpha, floor);
    }
    const idx = x * 4;
    data[idx] = rgb[0];
    data[idx + 1] = rgb[1];
    data[idx + 2] = rgb[2];
    data[idx + 3] = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
  }

  sctx.putImageData(image, 0, 0);

  resetCtx(ctx);
  try {
    ctx.beginPath();
    roundRect(ctx, 0, barY, screen.width, barH, tokens.barRadius);
    ctx.clip();
    ctx.fillStyle = colors.barBg;
    ctx.fillRect(0, barY, screen.width, barH);

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(source, 0, barY, screen.width, barH);

    ctx.restore();

    resetCtx(ctx);
    ctx.strokeStyle = withAlpha(colors.frame, tokens.frameAlpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(
      ctx,
      0.5,
      barY + 0.5,
      Math.max(1, screen.width - 1),
      Math.max(1, barH - 1),
      tokens.barRadius,
    );
    ctx.stroke();
  } finally {
    ctx.restore();
  }
};

// Sample the polyline at `worldX` for a single ramp column, walking
// the same tile range + per-tile polyline loop the previous segment
// filler used, then linearly interpolating the two enclosing points
// to get the column's curve Y. The wrapping (clamp / repeat / mirror)
// matches the old fillRampSegment behavior: clamp skips columns
// outside the polyline's X span; repeat / mirror tile the polyline
// across `tileRange`, with mirrored tiles reflected about the tile
// center on X (and Y untouched — the visual is the same as the old
// per-segment fill).
const sampleRampColumn = (
  points: CurvePoint[],
  x0: number,
  x1: number,
  pitch: number,
  wrapMode: CurveViewportState["wrapMode"],
  tileRange: { start: number; end: number },
  worldX: number,
  baseRect: CurveRect,
  rMax: number,
  rSpan: number,
): number | null => {
  for (let tile = tileRange.start; tile <= tileRange.end; tile++) {
    const mirrored = wrapMode === "mirror" && Math.abs(tile) % 2 !== 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (!Number.isFinite(a.x) || !Number.isFinite(b.x)) continue;
      const ax = tiledX(a.x, x0, pitch, tile, mirrored);
      const bx = tiledX(b.x, x0, pitch, tile, mirrored);
      if (wrapMode === "clamp" && (ax < x0 || ax > x1 || bx < x0 || bx > x1)) {
        continue;
      }
      // Linear interpolation along the segment. worldX is the
      // column's world-space X; the segment's tiled endpoints are
      // (ax, a.y) / (bx, b.y) in viewBox Y, so we convert to curve
      // Y via viewBoxYToCurveY at both ends.
      if (worldX < Math.min(ax, bx) || worldX > Math.max(ax, bx)) continue;
      if (bx === ax) continue;
      const t = (worldX - ax) / (bx - ax);
      const yA = viewBoxYToCurveY(a.y, baseRect, rMax, rSpan);
      const yB = viewBoxYToCurveY(b.y, baseRect, rMax, rSpan);
      return yA + (yB - yA) * t;
    }
  }
  return null;
};

export const getTileRange = (
  state: CurveViewportState,
  pitch: number,
  visible: CurveRect,
  x0: number,
  x1: number,
  baseTokens: RendererTokens,
) => {
  if (state.wrapMode === "clamp" || pitch <= 0) return { start: 0, end: 0 };
  const margin = Math.max(pitch, visible.w * baseTokens.tileMarginFactor);
  const start = Math.floor((visible.x - x1 - margin) / pitch);
  const end = Math.ceil((visible.x + visible.w - x0 + margin) / pitch);
  return { start, end };
};

export const tiledX = (
  x: number,
  x0: number,
  pitch: number,
  tile: number,
  mirrored: boolean,
): number => {
  const localX = mirrored ? pitch - (x - x0) : x - x0;
  return x0 + tile * pitch + localX;
};

export const viewBoxYToCurveY = (
  y: number,
  baseRect: CurveRect,
  rMax: number,
  rSpan: number,
): number => rMax - ((y - baseRect.y) / baseRect.h) * rSpan;

const curveValueToViewBoxY = (
  value: number,
  baseRect: CurveRect,
  rMin: number,
  rSpan: number,
): number => baseRect.y + (1 - (value - rMin) / rSpan) * baseRect.h;

const rampAlpha = (
  y: number,
  scale: number,
  baseAlpha: number,
  floor: number,
): number => {
  const t = Math.min(1, Math.abs(y) / scale);
  if (t <= 0) return 0;
  return baseAlpha * (floor + (1 - floor) * t);
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

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
};
