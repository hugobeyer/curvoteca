// Per-shape canvas effects. Two source-of-truth domains:
//
//   - *Colors* live in colors.css (--effect-*-color). The renderer reads
//     them via getComputedStyle. A missing variable is a CSS bug, not a
//     JS fallback.
//   - *Numbers* live in this file as plain constants. They have no
//     CSS representation (Canvas2D's blur, shadowBlur, etc. are set as
//     numeric properties, not CSS). They do not change at runtime and
//     do not need to be theme-tunable.
//
// Why not do this in CSS? Canvas pixels are opaque once committed. CSS cannot
// reach into the canvas to fade, glow, blur, or shadow a single stroke.
// Per-shape effects must be Canvas2D calls. CSS only controls the colors.

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Distance from center at which fade ramps to its corner value. */
const FADE_RAMP = 1.4;

/** Numeric effect parameters. Single source of truth. */
const NUMBERS = {
  // Center-distance fade
  fadeCenter: 0.75,
  fadeEdge: 0.15,
  // Glow (outer luminous halo via shadowBlur)
  glowBlur: 4,
  // Drop shadow
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  // Per-shape blur (ctx.filter)
  blur: 0,
  // Line glow: a wider, softer halo specifically for stroked lines (curve, grid).
  lineGlowBlur: 0,
  lineGlowBoost: 1.25, // multiplier on line glow blur for a "bloom" feel
  // Vignette: radial darken overlay.
  vignetteStrength: 0,
  vignetteInner: 0.4, // 0..1, fraction of radius where vignette starts
  vignetteOuter: 1.0, // 0..1, fraction of radius where vignette is full
} as const;

/** CSS custom property names for the four effect colors. */
const COLOR_VARS = {
  glowColor: "--effect-glow-color",
  shadowColor: "--effect-shadow-color",
  lineGlowColor: "--effect-line-glow-color",
  vignetteColor: "--effect-vignette-color",
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EffectValues = {
  fadeCenter: number;
  fadeEdge: number;
  glowBlur: number;
  glowColor: string;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  blur: number;
  lineGlowBlur: number;
  lineGlowColor: string;
  lineGlowBoost: number;
  vignetteStrength: number;
  vignetteInner: number;
  vignetteOuter: number;
  vignetteColor: string;
};

// ---------------------------------------------------------------------------
// CSS → values
// ---------------------------------------------------------------------------

export const readEffects = (root: HTMLElement): EffectValues => {
  const style = getComputedStyle(root);
  return {
    ...NUMBERS,
    glowColor: style.getPropertyValue(COLOR_VARS.glowColor),
    shadowColor: style.getPropertyValue(COLOR_VARS.shadowColor),
    lineGlowColor: style.getPropertyValue(COLOR_VARS.lineGlowColor),
    vignetteColor: style.getPropertyValue(COLOR_VARS.vignetteColor),
  };
};

// ---------------------------------------------------------------------------
// Fade (center-distance alpha)
// ---------------------------------------------------------------------------
// A radial alpha fade based on distance from the canvas center. Use begin/end
// around any draw call; restores previous globalAlpha. Pure additive blend
// from fadeEdge (corners) to fadeCenter (center).

export const beginFade = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
  point: { x: number; y: number },
  screen: { width: number; height: number },
) => {
  const cx = screen.width / 2;
  const cy = screen.height / 2;
  const dist = Math.hypot(point.x - cx, point.y - cy);
  const maxDist = Math.hypot(cx, cy);
  const t = maxDist > 0 ? Math.max(0, 1 - (dist / maxDist) * FADE_RAMP) : 0;
  const alpha = effects.fadeEdge + t * (effects.fadeCenter - effects.fadeEdge);
  ctx.save();
  ctx.globalAlpha *= alpha;
};

export const endFade = (ctx: CanvasRenderingContext2D) => {
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Three-stage distance fade (alpha = 1 at short, 0.5 at avg, 0 at long)
// ---------------------------------------------------------------------------
// Piecewise-linear ramp through three CSS-driven distances. Used to fade the
// probe crosshair smoothly as the cursor leaves the curve, instead of the
// binary in/out switch it used to be.

export const fadeOutAlpha = (
  dist: number,
  short: number,
  avg: number,
  long: number,
): number => {
  if (dist <= short) return 1;
  if (dist >= long) return 0;
  if (dist <= avg) {
    const t = (dist - short) / Math.max(1, avg - short);
    return 1 - t * 0.5;
  }
  const t = (dist - avg) / Math.max(1, long - avg);
  return 0.5 - t * 0.5;
};

// ---------------------------------------------------------------------------
// Glow (outer halo via shadowBlur)
// ---------------------------------------------------------------------------

export const beginGlow = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
) => {
  if (effects.glowBlur <= 0) return false;
  ctx.save();
  ctx.shadowBlur = effects.glowBlur;
  ctx.shadowColor = effects.glowColor;
  return true;
};

export const endGlow = (ctx: CanvasRenderingContext2D, applied: boolean) => {
  if (applied) ctx.restore();
};

// ---------------------------------------------------------------------------
// Line glow (wider, softer halo for strokes)
// ---------------------------------------------------------------------------
// A more aggressive glow than `beginGlow`: larger blur, can be color-shifted
// for warm/cool bloom. Intended for the curve and major grid lines.

export const beginLineGlow = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
) => {
  if (effects.lineGlowBlur <= 0) return false;
  ctx.save();
  ctx.shadowBlur = effects.lineGlowBlur * effects.lineGlowBoost;
  ctx.shadowColor = effects.lineGlowColor;
  return true;
};

export const endLineGlow = (
  ctx: CanvasRenderingContext2D,
  applied: boolean,
) => {
  if (applied) ctx.restore();
};

// ---------------------------------------------------------------------------
// Drop shadow
// ---------------------------------------------------------------------------

export const beginShadow = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
) => {
  if (effects.shadowBlur <= 0) return false;
  ctx.save();
  ctx.shadowBlur = effects.shadowBlur;
  ctx.shadowColor = effects.shadowColor;
  ctx.shadowOffsetX = effects.shadowOffsetX;
  ctx.shadowOffsetY = effects.shadowOffsetY;
  return true;
};

export const endShadow = (ctx: CanvasRenderingContext2D, applied: boolean) => {
  if (applied) ctx.restore();
};

// ---------------------------------------------------------------------------
// Per-shape blur (ctx.filter)
// ---------------------------------------------------------------------------

export const beginBlur = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
) => {
  if (effects.blur <= 0) return false;
  ctx.save();
  ctx.filter = `blur(${effects.blur}px)`;
  return true;
};

export const endBlur = (ctx: CanvasRenderingContext2D, applied: boolean) => {
  if (applied) ctx.restore();
};

// ---------------------------------------------------------------------------
// Vignette (radial darken overlay)
// ---------------------------------------------------------------------------
// Draws a soft radial darken over the whole canvas. begin/end bracket the
// entire scene; we paint a radial gradient with destination-alpha compositing.
// Returns a teardown function the caller must invoke.

export const beginVignette = (
  ctx: CanvasRenderingContext2D,
  effects: EffectValues,
  screen: { width: number; height: number },
) => {
  if (effects.vignetteStrength <= 0) return false;
  ctx.save();
  const cx = screen.width / 2;
  const cy = screen.height / 2;
  const inner = Math.hypot(cx, cy) * effects.vignetteInner;
  const outer = Math.hypot(cx, cy) * effects.vignetteOuter;
  const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, effects.vignetteColor);
  ctx.globalCompositeOperation = "source-atop";
  ctx.globalAlpha = effects.vignetteStrength;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, screen.width, screen.height);
  ctx.restore();
  return true;
};

export const endVignette = (
  ctx: CanvasRenderingContext2D,
  applied: boolean,
) => {
  if (applied) ctx.restore();
};
