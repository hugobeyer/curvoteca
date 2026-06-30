// ---------------------------------------------------------------------------
// Motion view.
//
// A glowing "probe" that slides along the curve like an object on
// rails. The probe is the curve's natural sample at a phase-driven
// X: lerp the polyline to the current X, then project the result to
// screen. The motion is fast and the glow is the only visual cue
// (no trail, no head, no per-axis falloff). Reuses the existing
// tile/wrap math via the same `getLoopWorldY` + screenPoint path
// that drawCurve uses, so clamp / repeat / mirror / loop wrap modes
// all behave the same as the graph view.
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

export const renderMotion = ({
  ctx,
  points,
  metrics,
  visible,
  state,
  screen,
  colors,
  tokens: _tokens,
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
  const probeWorld = probeWorldForPhase(phase, points, metrics, state);
  if (!probeWorld) return;
  const probeScreen = screenPoint(probeWorld);

  // Halo: large soft glow at the probe's screen position. Drawn
  // with "lighter" compositing so the glow adds to whatever sits
  // underneath (the static curve + grid chrome) without dimming it.
  const halo = ctx.createRadialGradient(
    probeScreen.x,
    probeScreen.y,
    0,
    probeScreen.x,
    probeScreen.y,
    PROBE_HALO_RADIUS,
  );
  halo.addColorStop(0, withAlpha(colors.curve, 0.9));
  halo.addColorStop(0.4, withAlpha(colors.curve, 0.35));
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
  void visible;
  void _tokens;
  void screen;
};

// Resolve the probe's world point for the current phase. The phase
// is monotonic in time; floor(phase) gives the tile index and
// fractional phase gives the local X within that tile. In clamp
// mode the phase is pinned to [0,1] so the probe never leaves the
// polyline. In loop mode the probe's Y is offset by `tile * dy` per
// cycle so it visibly loops vertically.
const probeWorldForPhase = (
  phase: number,
  points: CurvePoint[],
  metrics: CurveTileMetrics,
  state: CurveViewportState,
): CurvePoint | null => {
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
  const sampledY = samplePolylineY(points, localX);

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
  return { x: worldX, y: worldY };
};

// Lerp the polyline at worldX and return its Y.
const samplePolylineY = (points: CurvePoint[], worldX: number): number => {
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0].y;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    if (worldX >= minX && worldX <= maxX) {
      if (b.x === a.x) return a.y;
      const t = (worldX - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * t;
    }
  }
  const first = points[0];
  const last = points[points.length - 1];
  return Math.abs(worldX - first.x) < Math.abs(worldX - last.x)
    ? first.y
    : last.y;
};
