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

export const renderRamp = ({
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

  resetCtx(ctx);
  try {
    ctx.beginPath();
    roundRect(ctx, 0, barY, screen.width, barH, tokens.barRadius);
    ctx.clip();
    ctx.fillStyle = colors.barBg;
    ctx.fillRect(0, barY, screen.width, barH);

    for (let tile = tileRange.start; tile <= tileRange.end; tile++) {
      const mirrored = state.wrapMode === "mirror" && Math.abs(tile) % 2 !== 0;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (!Number.isFinite(a.x) || !Number.isFinite(b.x)) continue;

        const ax = tiledX(a.x, x0, pitch, tile, mirrored);
        const bx = tiledX(b.x, x0, pitch, tile, mirrored);
        if (state.wrapMode === "clamp" && (ax < x0 || ax > x1 || bx < x0 || bx > x1)) {
          continue;
        }

        const sxA = screenPoint({ x: ax, y: baseRect.y }).x;
        const sxB = screenPoint({ x: bx, y: baseRect.y }).x;
        const yA = viewBoxYToCurveY(a.y, baseRect, rMax, rSpan);
        const yB = viewBoxYToCurveY(b.y, baseRect, rMax, rSpan);

        if (Math.sign(yA) === Math.sign(yB) || yA === 0 || yB === 0) {
          fillRampSegment(ctx, sxA, sxB, yA, yB, barY, barH, scale, tokens, colors);
        } else {
          const t = Math.abs(yA) / (Math.abs(yA) + Math.abs(yB));
          const zeroX = sxA + (sxB - sxA) * t;
          fillRampSegment(ctx, sxA, zeroX, yA, 0, barY, barH, scale, tokens, colors);
          fillRampSegment(ctx, zeroX, sxB, 0, yB, barY, barH, scale, tokens, colors);
        }
      }
    }
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

  void baseColors;
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

const fillRampSegment = (
  ctx: CanvasRenderingContext2D,
  xA: number,
  xB: number,
  yA: number,
  yB: number,
  barY: number,
  barH: number,
  scale: number,
  tokens: RampTokens,
  colors: RampColors,
) => {
  const width = Math.abs(xB - xA);
  if (width <= 0) return;

  const dominant = Math.abs(yA) >= Math.abs(yB) ? yA : yB;
  const positive = dominant >= 0;
  const color = positive ? colors.pos : colors.neg;
  const baseAlpha = positive ? tokens.posAlpha : tokens.negAlpha;
  const alphaA = rampAlpha(yA, scale, baseAlpha, tokens.gradientFloor);
  const alphaB = rampAlpha(yB, scale, baseAlpha, tokens.gradientFloor);
  const grad = ctx.createLinearGradient(xA, 0, xB, 0);
  grad.addColorStop(0, withAlpha(color, alphaA));
  grad.addColorStop(1, withAlpha(color, alphaB));
  ctx.fillStyle = grad;
  ctx.fillRect(Math.min(xA, xB), barY, width + 0.5, barH);
};

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
