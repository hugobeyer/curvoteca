// ---------------------------------------------------------------------------
// storageKeys.ts
// Canonical localStorage / URL key names. Centralized so a typo in one
// place does not silently break the feature. Used by both the bundled
// lib modules (e.g. compareStore.ts) and the inline client scripts in
// src/pages/index.astro (passed in via Astro's define:vars).
// ---------------------------------------------------------------------------

export const KEY_FAVORITES = "curvoteca:favorites";
export const KEY_COMPARE = "curvoteca:compare";
export const KEY_TRAY_COLLAPSED = "curvoteca:tray-collapsed";
export const KEY_GALLERY_MODE = "curvoteca:gallery-mode";
export const KEY_CURVE_VIEW = "curvoteca:curve-view";
export const KEY_VIEW_MODE = "curvoteca:view-mode";
export const KEY_WRAP_MODE = "curvoteca:wrap-mode";
export const KEY_GRID_SIZE = "curvoteca:grid-size";
export const KEY_GRID_COLS = "curvoteca:grid-cols";
export const KEY_PAGER_SIZE = "curvoteca:pager-size";
export const KEY_VIEW_GRID = "curvoteca:view-grid";
