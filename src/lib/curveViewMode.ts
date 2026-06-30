// ---------------------------------------------------------------------------
// curveViewMode.ts
//
// Pure view-mode logic for the per-curve preview dispatcher. The dispatcher
// (src/lib/curveCanvasRenderer.ts) reads `data-curve-view-mode` off the
// `.curve-view` root and routes to the right renderer. This module owns
// the cycling math (which view comes next given the curve's list of
// available views) and the DOM glue to apply the result.
//
// CSS / DOM / canvas concerns are kept out of `cycleViewMode`; it just
// returns the next mode. The caller is responsible for writing it back to
// the DOM attribute and to any UI (button label, is-default highlight).
// ---------------------------------------------------------------------------

import type { CurveViewMode } from "../data/curves";

/**
 * Return the next view in the curve's list, wrapping at the end. If the
 * current mode is not in the list, the first view is returned. If the
 * list is empty, `"graph"` is returned as a safe default.
 */
export const cycleViewMode = (
  views: readonly CurveViewMode[],
  current: CurveViewMode,
): CurveViewMode => {
  if (views.length === 0) return "graph";
  const idx = views.indexOf(current);
  if (idx === -1) return views[0];
  return views[(idx + 1) % views.length];
};
