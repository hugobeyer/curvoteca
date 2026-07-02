import { readTokens as readCanvasTokens } from "../renderer/tokens";
import type { Renderer3DQuality } from "./types";

export type Renderer3DTokens = {
  dprMin: number;
  dprMax: number;
  gridSizeCard: number;
  gridSizeDetail: number;
  gridSizeHigh: number;
  pointCountCard: number;
  pointCountDetail: number;
  pointCountHigh: number;
  animationStepMs: number;
  scanlinePeriodMs: number;
  noiseSpeed: number;
  globalFreq: number;
  globalOctaves: number;
  gridExtent: number;
  surfaceExtent: number;
  noiseUvRange: number;
  ghostAlpha: number;
  shadedAlpha: number;
  wireAlpha: number;
};

export const readRenderer3DTokens = (root: HTMLElement): Renderer3DTokens => {
  const base = readCanvasTokens(root);
  const style = getComputedStyle(root);
  return {
    dprMin: base.dprMin,
    dprMax: base.dprMax,
    gridSizeCard: readInt(style, "--renderer3d-grid-card"),
    gridSizeDetail: readInt(style, "--renderer3d-grid-detail"),
    gridSizeHigh: readInt(style, "--renderer3d-grid-high"),
    pointCountCard: readInt(style, "--renderer3d-points-card"),
    pointCountDetail: readInt(style, "--renderer3d-points-detail"),
    pointCountHigh: readInt(style, "--renderer3d-points-high"),
    animationStepMs: readFloat(style, "--renderer3d-animation-step-ms"),
    scanlinePeriodMs: readFloat(style, "--renderer3d-scanline-period-ms"),
    noiseSpeed: readFloat(style, "--renderer3d-noise-speed"),
    globalFreq: readFloat(style, "--renderer3d-noise-global-freq"),
    globalOctaves: readInt(style, "--renderer3d-noise-global-octaves"),
    gridExtent: readFloat(style, "--renderer3d-grid-extent"),
    surfaceExtent: readFloat(style, "--renderer3d-surface-extent"),
    noiseUvRange: readFloat(style, "--renderer3d-noise-uv-range"),
    ghostAlpha: readFloat(style, "--renderer3d-ghost-alpha"),
    shadedAlpha: readFloat(style, "--renderer3d-shaded-alpha"),
    wireAlpha: readFloat(style, "--renderer3d-wire-alpha"),
  };
};

export const resolveGridSize = (
  tokens: Renderer3DTokens,
  quality: Renderer3DQuality | undefined,
  override?: number,
  lod?: number,
) => {
  let base: number;
  if (override && Number.isFinite(override)) {
    return Math.max(3, Math.min(64, override));
  } else if (quality === "card") {
    base = tokens.gridSizeCard;
  } else if (quality === "high") {
    base = tokens.gridSizeHigh;
  } else {
    base = tokens.gridSizeDetail;
  }
  if (lod && lod > 0) {
    const factor = Math.min(1, 48 / lod);
    base = Math.max(8, Math.round(base * factor));
  }
  return base;
};

export const resolvePointCount = (
  tokens: Renderer3DTokens,
  quality: Renderer3DQuality | undefined,
  override?: number,
) => {
  if (override && Number.isFinite(override))
    return Math.max(16, Math.min(8000, override));
  if (quality === "card") return tokens.pointCountCard;
  if (quality === "high") return tokens.pointCountHigh;
  return tokens.pointCountDetail;
};

const readFloat = (style: CSSStyleDeclaration, name: string): number => {
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return 0;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
};

const readInt = (style: CSSStyleDeclaration, name: string): number => {
  const raw = style.getPropertyValue(name).trim();
  if (!raw) return 0;
  const value = parseInt(raw, 10);
  return Number.isFinite(value) ? value : 0;
};
