// ---------------------------------------------------------------------------
// edgeFade.ts
// Canvas-edge proximity fade, applied as compositing passes at the end
// of the static layer. Two 1D alpha masks (one horizontal, one vertical)
// are built once per (screen size, fade width) and reused: when drawn
// stretched to the orthogonal axis, bilinear filtering produces a smooth
// gradient on all four edges.
//
// Net cost: two tiny offscreen canvases (width×1 and 1×height, both at
// device-pixel ratio) and two full-canvas destination-in blits per frame.
// No per-line math in the grid/curve code.
//
// Pure DOM factory: returns HTMLCanvasElements. No draw-time math.
// ---------------------------------------------------------------------------

export type EdgeAxis = "horizontal" | "vertical";

export type EdgeMaskPair = {
  horizontal: HTMLCanvasElement;
  vertical: HTMLCanvasElement;
};

/**
 * Build a 1D alpha mask. White pixels = kept, transparent = masked out.
 * The canvas is sized at the device-pixel ratio passed in, so the blit
 * stays pixel-perfect when stretched to the orthogonal axis.
 *
 *   horizontal: width × 1, ramp on x (left/right edges fade)
 *   vertical:   1 × height, ramp on y (top/bottom edges fade)
 *
 * The mask shape (per side, in normalized 0..1):
 *
 *   [0] ──hard── [h] ──ramp── [r] ── opaque ── [1-r] ── ramp ── [1-h] ── hard ── [1]
 *      α=0        α=0     α=0→1    α=1           α=1→0       α=0           α=0
 *
 *   - `h`  = `hardWidth / length`  — guaranteed-zero padding
 *   - `r`  = `fadeWidth / length`   — end of the ramp (start of opaque)
 *
 * With hardWidth = 0, the shape collapses to a pure 0→1→1→0 ramp.
 */
export const buildEdgeMask = (
  screen: { width: number; height: number },
  fadeWidth: number,
  dpr: number,
  axis: EdgeAxis,
  hardWidth = 0,
): HTMLCanvasElement => {
  const w =
    axis === "horizontal" ? Math.max(1, Math.round(screen.width * dpr)) : 1;
  const h =
    axis === "vertical" ? Math.max(1, Math.round(screen.height * dpr)) : 1;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const length = axis === "horizontal" ? screen.width : screen.height;
  if (length <= 0 || fadeWidth <= 0) {
    // No fade requested — leave the mask fully opaque (white) so the
    // destination-in blit is a no-op.
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, w, h);
    return canvas;
  }
  // Clamp hard zone so it never exceeds the ramp width.
  const hard = Math.max(0, Math.min(hardWidth, fadeWidth));
  const ramp = fadeWidth - hard;
  const tHard = hard / length;
  const tRamp = (hard + ramp) / length;
  const tHardEnd = 1 - tHard;
  const tRampEnd = 1 - tRamp;
  const grad =
    axis === "horizontal"
      ? ctx.createLinearGradient(0, 0, w, 0)
      : ctx.createLinearGradient(0, 0, 0, h);
  // White = keep (alpha 1 in destination-in), transparent = drop.
  grad.addColorStop(0, "rgba(255, 255, 255, 0)");
  if (tHard > 0) grad.addColorStop(tHard, "rgba(255, 255, 255, 0)");
  grad.addColorStop(tRamp, "rgba(255, 255, 255, 1)");
  grad.addColorStop(tRampEnd, "rgba(255, 255, 255, 1)");
  if (tHard > 0) grad.addColorStop(tHardEnd, "rgba(255, 255, 255, 0)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  return canvas;
};

/**
 * Build both masks in one call. Returned as a pair so the caller can cache
 * and reuse them across frames.
 */
export const buildEdgeMaskPair = (
  screen: { width: number; height: number },
  fadeWidth: number,
  dpr: number,
  hardWidth = 0,
): EdgeMaskPair => ({
  horizontal: buildEdgeMask(screen, fadeWidth, dpr, "horizontal", hardWidth),
  vertical: buildEdgeMask(screen, fadeWidth, dpr, "vertical", hardWidth),
});
