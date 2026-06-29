// ---------------------------------------------------------------------------
// ctxState.ts
// Tiny shared helper for the per-draw-call ctx "hard reset" used by every
// leaf renderer. The reset clears globalAlpha, shadow, and filter so each
// draw call starts from a known-clean state and never inherits leaked style
// from the previous call on the same context.
// ---------------------------------------------------------------------------

export const resetCtx = (ctx: CanvasRenderingContext2D): void => {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.filter = "none";
};
