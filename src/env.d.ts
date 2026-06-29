/// <reference types="astro/client" />

declare global {
  interface Window {
    KEY_FAVORITES: string;
    KEY_COMPARE: string;
    KEY_TRAY_COLLAPSED: string;
    KEY_GALLERY_MODE: string;
    KEY_CURVE_VIEW: string;
    KEY_WRAP_MODE: string;
    KEY_GRID_SIZE: string;
    KEY_GRID_COLS: string;
    CurvotecaRenderCurveView: (view: Element) => void;
  }
}

export {};
