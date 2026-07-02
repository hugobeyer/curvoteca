import { readColors } from "../renderer/colors";
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

const hexToVec3 = (hex: string): Vec3 | null => {
  const m = hex.trim().match(/^#([0-9a-fA-F]{3,6})$/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  if (h.length !== 6) return null;
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

const channelsToVec3 = (raw: string): Vec3 | null => {
  const parts = raw.trim().split(/[\s,/]+/).filter(Boolean).map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return [
    Math.max(0, Math.min(255, parts[0])) / 255,
    Math.max(0, Math.min(255, parts[1])) / 255,
    Math.max(0, Math.min(255, parts[2])) / 255,
  ];
};

const parseAnyToVec3 = (value: string): Vec3 | null =>
  hexToVec3(value) ?? channelsToVec3(value);

const brighten = (v: Vec3, factor: number): Vec3 => {
  const m = v.map((c) => Math.min(1, c * factor));
  return [m[0], m[1], m[2]];
};

const darkenSaturate = (v: Vec3, powVal: number): Vec3 => {
  const m = v.map((c) => Math.pow(c * 0.5, powVal));
  return [m[0], m[1], m[2]];
};

export const readRenderer3DColors = (root: HTMLElement): Renderer3DColors => {
  const raw = readColors(root);
  const style = getComputedStyle(root);
  const curve = parseAnyToVec3(raw.curve);
  const curve2 = parseAnyToVec3(raw.curve2);
  const gridBase = parseAnyToVec3(raw.grid);
  const bg = parseAnyToVec3(raw.bg);
  const c2pow = readFloat(style, "--renderer3d-curve2-pow") || 2.0;

  return {
    bg: bg ?? [0.02, 0.03, 0.04],
    grid: gridBase ?? [0.08, 0.14, 0.20],
    subgrid: gridBase ? brighten(gridBase, 0.45) : [0.04, 0.07, 0.10],
    axis: gridBase ? brighten(gridBase, 1.6) : [0.16, 0.24, 0.34],
    zero: gridBase ? brighten(gridBase, 2.0) : [0.20, 0.30, 0.42],
    curve: curve ?? [1, 0.6, 0.12],
    curve2: curve2 ? darkenSaturate(curve2, c2pow) : [0.18, 0.55, 0.60],
  };
};

const readFloat = (style: CSSStyleDeclaration, name: string): number => {
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return 0;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
};
