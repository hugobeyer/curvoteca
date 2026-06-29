import { clamp, screenToWorld, worldToScreen } from "../curveViewportMath";
import {
  getLoopWorldY,
  unwrapBaseX,
  wrapWorldX,
  type CurvePoint,
  type CurveRect,
  type CurveTileMetrics,
  type CurveViewportState,
} from "../curveViewportMath";
import { samplePolylineAtX } from "./curve";
import type { RendererColors } from "./colors";
import {
  beginFade,
  beginGlow,
  endGlow,
  endFade,
  type EffectValues,
} from "./effects";
import type { RendererTokens } from "./tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProbeState = {
  worldX: number;
  worldY: number;
  curve?: {
    world: CurvePoint;
    normalizedX: number;
    normalizedY: number;
    near: boolean;
    /** 1 = fully visible, 0 = invisible. Time-driven appear/disappear. */
    fadeAlpha: number;
    /** performance.now() (ms) at which the appear ramp started, or null. */
    appearedAt: number | null;
    /** performance.now() (ms) at which the disappear ramp started, or null. */
    disappearedAt: number | null;
  };
};

export type ProbeSample = NonNullable<ProbeState["curve"]>;

type Screen = { width: number; height: number };

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const setText = (root: HTMLElement, selector: string, text: string) => {
  const el = root.querySelector<HTMLElement>(selector);
  if (el) el.textContent = text;
};

const setOverlayPosition = (
  root: HTMLElement,
  selector: string,
  x: number | null,
  y: number | null,
  screen: Screen,
) => {
  const el = root.querySelector<HTMLElement>(selector);
  if (!el) return;
  if (x !== null) el.style.left = `${clamp(x, 0, screen.width).toFixed(1)}px`;
  if (y !== null) el.style.top = `${clamp(y, 0, screen.height).toFixed(1)}px`;
};

const fmtNorm = (value: number) => (Math.round(value * 100) / 100).toFixed(2);

// ---------------------------------------------------------------------------
// Sample the curve at a world-x (handles wrap / mirror / loop)
// ---------------------------------------------------------------------------

const sampleCurveAtWorldX = (
  points: CurvePoint[],
  metrics: CurveTileMetrics,
  baseRect: CurveRect,
  worldX: number,
  wrapMode: CurveViewportState["wrapMode"],
): ProbeSample | undefined => {
  const wrapped = wrapWorldX(metrics, worldX, wrapMode);
  const base = samplePolylineAtX(points, wrapped.baseX);
  if (!base) return undefined;
  const world = {
    x: unwrapBaseX(metrics, base.x, wrapped.tile, wrapped.mirrored),
    y: getLoopWorldY(metrics, base.y, wrapped.tile, wrapMode),
  };
  const normalizedX = clamp((wrapped.baseX - metrics.x0) / metrics.pitch, 0, 1);
  const normalizedY = clamp(1 - (world.y - baseRect.y) / baseRect.h, 0, 1);
  return {
    world,
    normalizedX,
    normalizedY,
    near: false,
    fadeAlpha: 0,
    appearedAt: null,
    disappearedAt: null,
  };
};

// ---------------------------------------------------------------------------
// Time-based appear / disappear ramp
// ---------------------------------------------------------------------------

export type ProbePhase = "hidden" | "appearing" | "visible" | "disappearing";

export const computeProbePhase = (
  sample: ProbeSample,
  now: number,
  appearMs: number,
  disappearMs: number,
): ProbePhase => {
  if (sample.disappearedAt !== null) {
    return now - sample.disappearedAt >= disappearMs
      ? "hidden"
      : "disappearing";
  }
  if (sample.appearedAt === null) return "hidden";
  return now - sample.appearedAt >= appearMs ? "visible" : "appearing";
};

export const computeProbeAlpha = (
  sample: ProbeSample,
  now: number,
  appearMs: number,
  disappearMs: number,
): number => {
  const phase = computeProbePhase(sample, now, appearMs, disappearMs);
  if (phase === "appearing") {
    if (appearMs <= 0) return 1;
    return Math.max(
      0,
      Math.min(1, (now - (sample.appearedAt ?? now)) / appearMs),
    );
  }
  if (phase === "disappearing") {
    if (disappearMs <= 0) return 0;
    const t = (now - (sample.disappearedAt ?? now)) / disappearMs;
    return Math.max(0, Math.min(1, 1 - t));
  }
  return phase === "visible" ? 1 : 0;
};

// ---------------------------------------------------------------------------
// Probe text readout + DOM overlay positioning
// ---------------------------------------------------------------------------

export type UpdateProbeTextArgs = {
  root: HTMLElement;
  probe: ProbeState;
};

// setProbe() already gates on the radius, so by the time we get here the
// probe has a curve sample and is within the radius. Just write the readout
// and toggle the visibility classes.
export const updateProbeText = ({ root, probe }: UpdateProbeTextArgs) => {
  if (!probe.curve) return;
  probe.curve.near = probe.curve.fadeAlpha > 0.5;
  if (probe.curve.fadeAlpha <= 0) {
    root.classList.remove("has-probe", "is-probe-near");
    return;
  }
  root.classList.add("has-probe");
  root.classList.toggle("is-probe-near", probe.curve.near);
  setText(
    root,
    "[data-curve-view-probe-x]",
    `x ${fmtNorm(probe.curve.normalizedX)}`,
  );
  setText(
    root,
    "[data-curve-view-probe-y]",
    `y ${fmtNorm(probe.curve.normalizedY)}`,
  );
};

// ---------------------------------------------------------------------------
// Probe canvas crosshair + dot + overlay positioning
// ---------------------------------------------------------------------------

export type DrawProbeArgs = {
  ctx: CanvasRenderingContext2D;
  root: HTMLElement;
  probe: ProbeState;
  screen: Screen;
  colors: RendererColors;
  tokens: RendererTokens;
  effects: EffectValues;
  screenPoint: (point: CurvePoint) => CurvePoint;
};

export const drawProbe = ({
  ctx,
  root,
  probe,
  screen,
  colors,
  tokens,
  effects,
  screenPoint,
}: DrawProbeArgs) => {
  const point = probe.curve?.world || { x: probe.worldX, y: probe.worldY };
  const screenPt = screenPoint(point);
  const fade = probe.curve?.fadeAlpha ?? 0;

  // Skip drawing entirely when fully faded.
  if (fade <= 0) return;

  // Center-distance fade (existing) composes with the radius fade.
  beginFade(ctx, effects, screenPt, screen);
  ctx.globalAlpha *= fade;

  // Glow the crosshair + dot.
  const glow = beginGlow(ctx, effects);

  // Crosshair: each axis line is split at the probe. A linear gradient
  // fades it from full color at the probe to transparent at `lineMaskEnd`
  // of the way to the edge. The gradient is built probe → edge so the
  // color stop at 0 is the probe, and the fade ramps outward. The mask
  // is a fraction of the line's arclength (0..1) — distance-independent.
  const lineColor = colors.curve2;

  // Probe marker: a square box centered on the probe, drawn as 4 L-shaped
  // corner brackets that meet the box edges exactly (no inner gap, no full
  // edges, no center crosshair).
  ctx.globalAlpha = fade;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = tokens.probeBoxLineWidth;
  ctx.lineCap = "round";
  const box = Math.max(2, tokens.probeBoxSize);
  const arm = Math.max(1, box * tokens.probeBoxArmRatio);
  const cx = Math.round(screenPt.x) + 0.5;
  const cy = Math.round(screenPt.y) + 0.5;
  const half = box / 2;
  // Corners: (left, top) of each corner's L, plus the axis along which the
  // arm extends from the corner inward. The arm meets the box edge.
  const corners = [
    { x: cx - half, y: cy - half, dx: +1, dy: +1 }, // NW: right + down
    { x: cx + half, y: cy - half, dx: -1, dy: +1 }, // NE: left  + down
    { x: cx + half, y: cy + half, dx: -1, dy: -1 }, // SE: left  + up
    { x: cx - half, y: cy + half, dx: +1, dy: -1 }, // SW: right + up
  ];
  for (const { x, y, dx, dy } of corners) {
    ctx.beginPath();
    ctx.moveTo(x + dx * arm, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * arm);
    ctx.stroke();
  }

  endGlow(ctx, glow);
  endFade(ctx);

  setOverlayPosition(
    root,
    "[data-curve-view-screen-probe-v]",
    screenPt.x,
    null,
    screen,
  );
  setOverlayPosition(
    root,
    "[data-curve-view-screen-probe-h]",
    null,
    screenPt.y,
    screen,
  );
};

// ---------------------------------------------------------------------------
// Public: build a probe from a client (mouse) position
// ---------------------------------------------------------------------------

export type BuildProbeArgs = {
  canvas: HTMLCanvasElement;
  clientX: number;
  clientY: number;
  baseRect: CurveRect;
  metrics: CurveTileMetrics;
  points: CurvePoint[];
  state: CurveViewportState;
  visible: CurveRect;
};

export const buildProbe = ({
  canvas,
  clientX,
  clientY,
  baseRect,
  metrics,
  points,
  state,
  visible,
}: BuildProbeArgs): ProbeState => {
  const rect = canvas.getBoundingClientRect();
  const screen = { width: rect.width, height: rect.height };
  const local = { x: clientX - rect.left, y: clientY - rect.top };
  const world = screenToWorld(local, visible, screen);
  return {
    worldX: world.x,
    worldY: world.y,
    curve: sampleCurveAtWorldX(
      points,
      metrics,
      baseRect,
      world.x,
      state.wrapMode,
    ),
  };
};

// Re-export math utilities that consumers may want when composing a probe.
export { worldToScreen, screenToWorld };
