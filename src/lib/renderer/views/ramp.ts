// ---------------------------------------------------------------------------
// Ramp view.
//
// A single horizontal bar where each x in the curve's domain maps to a
// vertical strip whose alpha is |y| and whose color is positive vs.
// negative. This is the "shader use" view: it shows the practical effect
// of the curve (a smoothstep ramp, a cubic-bezier easing, an SDF mask)
// as it would appear in actual code, not as a 2D plot.
//
// Implementation: the bar is just the area under the curve polyline,
// filled per-sample with alpha ∝ |y| and color ∝ sign(y). The curve
// polyline itself can be drawn separately by `drawCurve` (the caller
// does this); the ramp fill and the curve share the same screen-space
// polyline so they stay perfectly aligned at every viewport state.
//
// Positions are computed in screen pixels via the caller's `screenPoint`.
// The same tile-iteration logic as `drawCurve` is used so the ramp
// inherits zoom, pan and wrap mode for free.
//
// Tokens (numbers) and colors (CSS custom properties) are read from
// `.curve-view`. See `src/styles/gallery.css` and `src/styles/colors.css`
// for declarations. There is no JS fallback — a missing token produces
// NaN / empty values and the bar fails to draw. That is intentional:
// a missing token is a CSS bug, not a JS one.
// ---------------------------------------------------------------------------

import type {
  CurvePoint,
  CurveRect,
  CurveViewportState,
} from "../../curveViewportMath";
import { withAlpha, type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RampTokens = {
  // Reserved for future layout knobs. The current ramp fills the
  // viewBox vertically (top of viewBox = rMax, bottom = rMin, zero
  // line at the viewBox's zero line) and horizontally spans the
  // curve's domain. There are no per-axis sizes to tune right now;
  // the curve and the bar share the same screen-space layout.
  barH: number;
  barRadius: number;
  barGap: number;
  barTop: number;
  // Zero line.
  zeroLineW: number;
  zeroLineAlpha: number;
  // Output fill alphas.
  posAlpha: number;
  negAlpha: number;
  // Frame / surrounding tint.
  frameAlpha: number;
  // Gradient floor: minimum alpha at Y=0 (bottom of ramp strip).
  gradientFloor: number;
};

export type RampColors = {
  pos: string;
  neg: string;
  zero: string;
  barBg: string;
  frame: string;
};

// ---------------------------------------------------------------------------
// Constants (CSS variable names; no JS DEFAULTS — tokens are CSS-driven)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CSS → typed values (no fallbacks; missing var = NaN / "")
// ---------------------------------------------------------------------------

export const readRampTokens = (root: HTMLElement): RampTokens => {
  const style = getComputedStyle(root);
  const out = {} as Record<keyof RampTokens, number>;
  (Object.keys(RAMP_CSS_VARS) as Array<keyof RampTokens>).forEach((k) => {
    out[k] = parseFloat(style.getPropertyValue(RAMP_CSS_VARS[k]));
  });
  return out as RampTokens;
};

export const readRampColors = (root: HTMLElement): RampColors => {
  const style = getComputedStyle(root);
  const out = {} as Record<keyof RampColors, string>;
  (Object.keys(RAMP_COLOR_VARS) as Array<keyof RampColors>).forEach((k) => {
    out[k] = style.getPropertyValue(RAMP_COLOR_VARS[k]);
  });
  return out as RampColors;
};

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

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
  screenPoint: (point: CurvePoint) => CurvePoint;
};

/**
 * Paint the ramp fill into `ctx`. The fill is the area under the curve
 * polyline, from each sample's screen y down (or up) to the screen y
 * of the curve's zero line. Alpha is proportional to |y|; color is
 * positive or negative based on sign. The curve polyline itself is
 * NOT drawn here — the caller draws it via `drawCurve` so the fill
 * and the line share the same screen-space polyline and stay aligned.
 *
 * Tile iteration mirrors `drawCurve`: clamp draws one tile, repeat
 * and mirror step through tiles that intersect the visible x range.
 */
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
  screenPoint,
}: RampRenderArgs): void => {
  if (points.length < 2) return;
  resetCtx(ctx);

  const [rMin, rMax] = range;
  const rSpan = rMax - rMin;
  if (rSpan === 0) return;

  // Zero line in screen pixels. The viewBox y of the curve's y=0 is
  //   vbY = baseRect.y + (1 - (0 - rMin) / rSpan) * baseRect.h
  // We project that viewBox point through screenPoint to get the
  // screen y of the zero line.
  const zeroVb = {
    x: baseRect.x + baseRect.w / 2,
    y: baseRect.y + (1 - (0 - rMin) / rSpan) * baseRect.h,
  };
  const zeroScreenY = screenPoint(zeroVb).y;

  // Alpha scale: use the larger of |rMin| and |rMax| so an all-positive
  // curve (range [0,1]) reaches full alpha at the top of the bar and a
  // signed curve (range [-1,1]) reaches full alpha on both extremes.
  // Floor at 1 to avoid divide-by-zero on degenerate ranges.
  const scale = Math.max(Math.abs(rMin), Math.abs(rMax), 1);

  // Tile metrics, computed from viewBox-space points. Same shape as
  // drawCurve's metrics: x0/x1 = first/last x, pitch = span.
  const x0 = points[0].x;
  const x1 = points[points.length - 1].x;
  const pitch = x1 - x0;
  // Tile range. Clamp draws the bar once; repeat/mirror step through
  // tiles that intersect the visible x range, reusing the same
  // margin formula as drawCurve so the bar and the polyline stay
  // aligned at every zoom level.
  const tileRange = (() => {
    if (state.wrapMode === "clamp" || pitch <= 0) {
      return { start: 0, end: 0 };
    }
    const margin = Math.max(pitch, visible.w * baseTokens.tileMarginFactor);
    const startTile = Math.floor((visible.x - x1 - margin) / pitch);
    const endTile = Math.ceil((visible.x + visible.w - x0 + margin) / pitch);
    return { start: startTile, end: endTile };
  })();

  // Build the screen-space polyline for each tile, then fill the
  // area under it. We re-project points through screenPoint here
  // (rather than receiving a pre-computed polyline) so the ramp
  // stays self-contained — the caller doesn't have to compute the
  // polyline twice.
  for (let tile = tileRange.start; tile <= tileRange.end; tile++) {
    const mirrored = state.wrapMode === "mirror" && Math.abs(tile) % 2 !== 0;
    // Pre-project all samples for this tile to screen pixels.
    const screenPts: CurvePoint[] = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
        screenPts[i] = { x: NaN, y: NaN };
        continue;
      }
      const localX = mirrored ? pitch - (p.x - x0) : p.x - x0;
      const tileVbX = x0 + tile * pitch + localX;
      if (state.wrapMode === "clamp") {
        if (tileVbX < x0 || tileVbX > x1) {
          screenPts[i] = { x: NaN, y: NaN };
          continue;
        }
      }
      screenPts[i] = screenPoint({ x: tileVbX, y: p.y });
    }
    // Fill trapezoids between consecutive vertices. Each trapezoid
    // is a vertical strip from vertex[i].y to zeroScreenY, spanning
    // x from vertex[i].x to vertex[i+1].x. We split at the zero line
    // so positive and negative halves can use their own colors.
    for (let i = 0; i < screenPts.length - 1; i++) {
      const a = screenPts[i];
      const b = screenPts[i + 1];
      if (!Number.isFinite(a.x) || !Number.isFinite(b.x)) continue;
      // Alpha: use the average |y| of the two vertices, mapped to
      // the curve's range. We need the curve y, not the screen y.
      // Recover it from the viewBox y: curveY = rMax - vbYFrac * rSpan
      // where vbYFrac = (p.y - baseRect.y) / baseRect.h. But the
      // polyline is in screen pixels now. The two viewBox y values
      // are points[i].y and points[i+1].y (original, not tile-shifted).
      const yA = rMax - ((points[i].y - baseRect.y) / baseRect.h) * rSpan;
      const yB = rMax - ((points[i + 1].y - baseRect.y) / baseRect.h) * rSpan;
      const alphaA = Math.min(1, Math.abs(yA) / scale);
      const alphaB = Math.min(1, Math.abs(yB) / scale);
      if (alphaA <= 0 && alphaB <= 0) continue;
      // Determine sign: use the dominant sign of the two endpoints.
      // If both are positive, fill with pos color; both negative, neg.
      // If they straddle zero, split into two fills (one above zero,
      // one below) — but for simplicity, use the larger-|y| sign.
      const sign = Math.abs(yA) >= Math.abs(yB) ? Math.sign(yA) : Math.sign(yB);
      const color = sign >= 0 ? colors.pos : colors.neg;
      const baseAlpha = sign >= 0 ? tokens.posAlpha : tokens.negAlpha;
      // Average alpha (linear interpolation would be more accurate
      // but the strip is thin enough that average reads as smooth).
      const a1 = baseAlpha * alphaA;
      const a2 = baseAlpha * alphaB;
      // Vertical gradient: alpha fades from the curve's value at the
      // top of the strip to zero at Y=0.
      if (sign * yA >= 0 && sign * yB >= 0) {
        const midX = (a.x + b.x) / 2;
        const topY = Math.min(a.y, b.y);
        const grad = ctx.createLinearGradient(midX, topY, midX, zeroScreenY);
        grad.addColorStop(0, withAlpha(color, (a1 + a2) / 2));
        grad.addColorStop(1, withAlpha(color, tokens.gradientFloor));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(b.x, zeroScreenY);
        ctx.lineTo(a.x, zeroScreenY);
        ctx.closePath();
        ctx.fill();
      } else {
        // Straddle: draw two quads, one per vertex.
        const mx = (a.x + b.x) / 2;
        const g1 = ctx.createLinearGradient(a.x, a.y, a.x, zeroScreenY);
        g1.addColorStop(0, withAlpha(color, a1));
        g1.addColorStop(1, withAlpha(color, tokens.gradientFloor));
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x, zeroScreenY);
        ctx.lineTo(mx, zeroScreenY);
        ctx.lineTo(mx, a.y);
        ctx.closePath();
        ctx.fill();
        const g2 = ctx.createLinearGradient(b.x, b.y, b.x, zeroScreenY);
        g2.addColorStop(0, withAlpha(color, a2));
        g2.addColorStop(1, withAlpha(color, tokens.gradientFloor));
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(mx, b.y);
        ctx.lineTo(mx, zeroScreenY);
        ctx.lineTo(b.x, zeroScreenY);
        ctx.lineTo(b.x, b.y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // `baseColors` is accepted for parity with the graph renderer's
  // signature; the ramp view currently uses only the ramp-specific
  // tokens and colors.
  void baseColors;
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
