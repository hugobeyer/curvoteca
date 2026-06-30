// ---------------------------------------------------------------------------
// Motion view.
//
// A glowing "probe" that slides along the curve like an object on
// rails. The probe is the curve's natural sample at a phase-driven
// X: lerp the polyline to the current X, then project the result to
// screen. The motion is fast; the glow is the visual cue, and its
// intensity scales with the probe's world velocity (|dy/dx| at
// the probe's X). Three things read the velocity: the halo's
// alpha (motionGlowMin..max), the focus disc's radius (max..min,
// so steep = tight), and the focus stroke's line width (min..max,
// so steep = thick). Flat sections read as a wide, thin, soft
// spotlight; steep sections read as a tight, thick, bright pulse.
// Reuses the existing tile/wrap math via the same `getLoopWorldY` +
// screenPoint path that drawCurve uses, so clamp / repeat / mirror
// / loop wrap modes all behave the same as the graph view.
//
// The dispatcher in curveCanvasRenderer.ts drives this with a fresh
// phase on each frame: it derives phase from `performance.now()` and
// a `motionPeriodMs` token, then schedules another frame as long as
// the motion view is active. When the user leaves the motion mode
// the frame loop stops.
// ---------------------------------------------------------------------------

import {
  getLoopWorldY,
  type CurvePoint,
  type CurveRect,
  type CurveTileMetrics,
  type CurveViewportState,
  type CurveWrapMode,
} from "../../curveViewportMath";
import { withAlpha, type RendererColors } from "../colors";
import { resetCtx } from "../ctxState";
import type { RendererTokens } from "../tokens";
import { drawCurve } from "../curve";

export type MotionRenderArgs = {
  ctx: CanvasRenderingContext2D;
  points: CurvePoint[];
  metrics: CurveTileMetrics;
  visible: CurveRect;
  state: CurveViewportState;
  screen: { width: number; height: number };
  colors: RendererColors;
  tokens: RendererTokens;
  screenPoint: (point: CurvePoint) => CurvePoint;
  /** Animation phase in [0,1). 0 = left edge of the polyline, 1 = right. */
  phase: number;
};

// Pixel radius of the probe's glow halo (outer ring) and the bright
// core (inner dot). These are screen-space sizes so the probe
// reads as the same visual size on every card, regardless of zoom.
const PROBE_HALO_RADIUS = 14;
const PROBE_CORE_RADIUS = 3;
// Base alpha for the dim pass: the curve is stroked at this alpha
// everywhere except inside the focus disc, which is re-stroked
// at a velocity-scaled alpha (motionGlowMin..max). The dim pass
// sets the floor; the focus pass adds the bright band.
const DIM_ALPHA = 0.32;

export const renderMotion = ({
  ctx,
  points,
  metrics,
  visible,
  state,
  screen,
  colors,
  tokens,
  screenPoint,
  phase,
}: MotionRenderArgs): void => {
  if (points.length < 2) return;

  resetCtx(ctx);

  // Resolve the probe's world point for the current phase. The
  // probe is a constrained object: it sits exactly on the curve at
  // a phase-driven X. We lerp through the polyline to get Y, then
  // re-apply the current wrap mode's tile / loop offset to get the
  // final world point. clamp pins phase to [0,1]; the other modes
  // let phase sweep past 1 into the next tile, with the Y offset
  // applied per the wrap rule (loop stacks vertically, repeat /
  // mirror repeat the same Y).
  const probeProbe = probeWorldForPhase(phase, points, metrics, state);
  if (!probeProbe) return;
  const { world: probeWorld, velocity } = probeProbe;
  const probeScreen = screenPoint(probeWorld);

  // Velocity-driven glow ramp. The probe's |dy/dx| at the
  // current X is divided by motionGlowVelocityScale and clamped
  // to 1; flat sections (|dy/dx| = 0) → t=0, steep sections
  // (|dy/dx| >= scale) → t=1. The focus disc's radius, the
  // focus stroke's alpha, and the focus stroke's line width
  // all read this t: wide / thin / dim on flat sections, tight
  // / thick / bright on steep sections. The radius inverts t
  // (flat = wide disc, steep = tight disc) so the bright band
  // follows the probe more closely when the curve is moving
  // fast, reading as motion-blur rather than a static spotlight.
  const t = Math.min(
    1,
    Math.abs(velocity) / Math.max(1e-6, tokens.motionGlowVelocityScale),
  );
  const glow = lerp(tokens.motionGlowMin, tokens.motionGlowMax, t);
  const focusRadius = lerp(
    tokens.motionFocusRadiusMax,
    tokens.motionFocusRadiusMin,
    t,
  );
  const focusLineWidth = lerp(
    tokens.motionFocusLineWidthMin,
    tokens.motionFocusLineWidthMax,
    t,
  );

  // Vignette pass: dim the curve everywhere except the focus zone
  // around the probe. We stroke the full curve at low alpha, then
  // clip to the (velocity-tightened) disc around the probe and
  // re-stroke at a velocity-scaled alpha + line width. The grid
  // chrome is on the static layer underneath; over-stroking the
  // curve at the curve's location leaves the chrome untouched
  // everywhere except at the curve.
  const dimColors = { ...colors, curve: withAlpha(colors.curve, DIM_ALPHA) };
  drawCurve({
    ctx,
    points,
    metrics,
    visible,
    state,
    screen,
    colors: dimColors,
    tokens,
    screenPoint,
  });

  ctx.save();
  ctx.beginPath();
  ctx.arc(probeScreen.x, probeScreen.y, focusRadius, 0, Math.PI * 2);
  ctx.clip();
  // Inside the focus zone: re-stroke the curve at a velocity-scaled
  // alpha and line width. The alpha boost (motionGlowMin..max) is
  // composited over the dim pass via "source-over" at higher alpha,
  // so the curve reads brighter in the focus band on steep sections.
  drawCurve({
    ctx,
    points,
    metrics,
    visible,
    state,
    screen,
    colors,
    tokens,
    screenPoint,
    curveColor: withAlpha(colors.curve, Math.min(1, glow)),
    curveLineWidth: focusLineWidth,
  });
  ctx.restore();

  // Halo: large soft glow at the probe's screen position. Drawn
  // with "lighter" compositing so the glow adds to whatever sits
  // underneath (the curve + grid chrome) without dimming it.
  // The three color-stop alphas are scaled by the same velocity-
  // driven `glow` multiplier as the focus pass so the halo and
  // the bright curve band track each other.
  const halo = ctx.createRadialGradient(
    probeScreen.x,
    probeScreen.y,
    0,
    probeScreen.x,
    probeScreen.y,
    PROBE_HALO_RADIUS,
  );
  halo.addColorStop(0, withAlpha(colors.curve, 0.9 * glow));
  halo.addColorStop(0.4, withAlpha(colors.curve, 0.35 * glow));
  halo.addColorStop(1, withAlpha(colors.curve, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(probeScreen.x, probeScreen.y, PROBE_HALO_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Core: the bright dot itself, solid curve color.
  ctx.fillStyle = colors.curve;
  ctx.beginPath();
  ctx.arc(probeScreen.x, probeScreen.y, PROBE_CORE_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Resolve the probe's world point + local velocity for the current
// phase. The phase is monotonic in time; floor(phase) gives the
// tile index and fractional phase gives the local X within that
// tile. In clamp mode the phase is pinned to [0,1] so the probe
// never leaves the polyline. In loop mode the probe's Y is offset
// by `tile * dy` per cycle so it visibly loops vertically.
//
// Velocity is the local |dy/dx| of the polyline at the probe's
// un-tiled X — i.e. the slope of the segment that contains the
// probe. The glow multiplier reads this directly: flat sections
// (slope ≈ 0) → min glow, steep sections (slope ≥
// motionGlowVelocityScale) → max glow.
const probeWorldForPhase = (
  phase: number,
  points: CurvePoint[],
  metrics: CurveTileMetrics,
  state: CurveViewportState,
): { world: CurvePoint; velocity: number } | null => {
  if (points.length < 2) return null;
  const x0 = points[0].x;
  const x1 = points[points.length - 1].x;
  const pitch = x1 - x0;
  if (pitch <= 0) return null;

  const raw =
    state.wrapMode === "clamp" ? Math.min(1, Math.max(0, phase)) : phase;
  const tile = Math.floor(raw);
  const localT = raw - tile;
  const localX = x0 + localT * pitch;
  const { y: sampledY, velocity } = samplePolylineYAndSlope(points, localX);

  // Apply the wrap mode's tile / mirror / loop transform to the
  // sampled point, matching the same transform drawCurve uses for
  // the polyline. For loop the Y is offset per tile; for mirror
  // the X is reflected within the tile; for repeat the polyline
  // is just shifted by `tile * pitch` on X.
  const mode: CurveWrapMode = state.wrapMode;
  const mirrored = mode === "mirror" && tile % 2 !== 0;
  const localFromX0 = localX - x0;
  const worldX =
    x0 + tile * pitch + (mirrored ? pitch - localFromX0 : localFromX0);
  const worldY = getLoopWorldY(metrics, sampledY, tile, mode);
  return { world: { x: worldX, y: worldY }, velocity };
};

// Lerp the polyline at worldX and return its Y + the local
// segment's slope (dy/dx). The slope is the segment's rise over
// run; for the first / last endpoint fallback (probe X outside
// the polyline's range) the slope is 0 — there's no segment to
// read.
const samplePolylineYAndSlope = (
  points: CurvePoint[],
  worldX: number,
): { y: number; velocity: number } => {
  if (points.length === 0) return { y: 0, velocity: 0 };
  if (points.length === 1) return { y: points[0].y, velocity: 0 };
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    if (worldX >= minX && worldX <= maxX) {
      if (b.x === a.x) {
        // Vertical segment: infinite slope. Treat as max velocity
        // so the glow ramps to its peak; clamping happens at the
        // call site via the min(1, |v| / scale) expression.
        return { y: a.y, velocity: Number.POSITIVE_INFINITY };
      }
      const t = (worldX - a.x) / (b.x - a.x);
      const y = a.y + (b.y - a.y) * t;
      const velocity = (b.y - a.y) / (b.x - a.x);
      return { y, velocity };
    }
  }
  const first = points[0];
  const last = points[points.length - 1];
  const y =
    Math.abs(worldX - first.x) < Math.abs(worldX - last.x) ? first.y : last.y;
  return { y, velocity: 0 };
};
