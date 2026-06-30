/// <reference types="astro/client" />

import type { CurveViewMode } from "./data/curves";

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
    __rendererFor: (view: HTMLElement) => unknown;
    __cycleCurveView: (
      views: readonly CurveViewMode[],
      current: CurveViewMode,
    ) => CurveViewMode;
    __detailOverlay: {
      buildSnippetTabs: (
        container: HTMLElement,
        entry: {
          id: string;
          name: string;
          equation: string;
          previewPoints: [number, number][];
          snippets?: Record<string, string>;
          [k: string]: unknown;
        },
        onSelect: (key: string, code: string) => void,
      ) => void;
      showCode: (
        codeEl: HTMLElement,
        copyEl: HTMLElement,
        code: string,
      ) => void;
      copyDetailCode: (text: string) => Promise<void>;
      flashCopied: (el: HTMLElement) => void;
    };
  }
}

export {};
