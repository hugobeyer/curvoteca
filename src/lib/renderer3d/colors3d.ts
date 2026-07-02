import { readColors as readCanvasColors } from "../renderer/colors";
import type { Vec3 } from "./math3d";

export type Renderer3DColors = {
  bg: Vec3;
  grid: Vec3;
  subgrid: Vec3;
  axis: Vec3;
  zero: Vec3;
  curve: Vec3;
  curve2: Vec3;
};

const FALLBACKS = {
  bg: "5 7 11",
  grid: "22 36 51",
  subgrid: "13 23 33",
  axis: "38 58 76",
  zero: "58 86 107",
  curve: "255 138 31",
  curve2: "85 199 216",
} as const;

export const readRenderer3DColors = (root: HTMLElement): Renderer3DColors => {
  const colors = readCanvasColors(root);
  return {
    bg: parseCssRgb(colors.bg, FALLBACKS.bg),
    grid: parseCssRgb(colors.grid, FALLBACKS.grid),
    subgrid: parseCssRgb(colors.subgrid, FALLBACKS.subgrid),
    axis: parseCssRgb(colors.axis, FALLBACKS.axis),
    zero: parseCssRgb(colors.zero, FALLBACKS.zero),
    curve: parseCssRgb(colors.curve, FALLBACKS.curve),
    curve2: parseCssRgb(colors.curve2, FALLBACKS.curve2),
  };
};

export const parseCssRgb = (value: string, fallback: string): Vec3 => {
  const v = value.trim() || fallback;
  if (/^#[0-9a-fA-F]{3,6}$/.test(v)) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c);
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    }
  }

  const fnMatch = v.match(/^rgba?\(\s*([^)]+?)\s*\)$/i);
  const raw = fnMatch ? fnMatch[1] : v;
  const parts = raw.split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    return [
      Math.max(0, Math.min(255, parts[0])) / 255,
      Math.max(0, Math.min(255, parts[1])) / 255,
      Math.max(0, Math.min(255, parts[2])) / 255,
    ];
  }

  if (v !== fallback) return parseCssRgb(fallback, "255 255 255");
  return [1, 1, 1];
};
