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
  gridExtent: number;
  surfaceExtent: number;
  ghostAlpha: number;
  shadedAlpha: number;
  wireAlpha: number;
};

const DEFAULTS: Renderer3DTokens = {
  dprMin: 1,
  dprMax: 2,
  gridSizeCard: 14,
  gridSizeDetail: 32,
  gridSizeHigh: 40,
  pointCountCard: 360,
  pointCountDetail: 1800,
  pointCountHigh: 3600,
  animationStepMs: 80,
  gridExtent: 3.04,
  surfaceExtent: 2.56,
  ghostAlpha: 0.16,
  shadedAlpha: 0.68,
  wireAlpha: 0.42,
};

export const readRenderer3DTokens = (root: HTMLElement): Renderer3DTokens => {
  const base = readCanvasTokens(root);
  const style = getComputedStyle(root);
  return {
    dprMin: base.dprMin,
    dprMax: base.dprMax,
    gridSizeCard: readNumber(
      style,
      "--renderer3d-grid-card",
      DEFAULTS.gridSizeCard,
    ),
    gridSizeDetail: readNumber(
      style,
      "--renderer3d-grid-detail",
      DEFAULTS.gridSizeDetail,
    ),
    gridSizeHigh: readNumber(
      style,
      "--renderer3d-grid-high",
      DEFAULTS.gridSizeHigh,
    ),
    pointCountCard: readNumber(
      style,
      "--renderer3d-points-card",
      DEFAULTS.pointCountCard,
    ),
    pointCountDetail: readNumber(
      style,
      "--renderer3d-points-detail",
      DEFAULTS.pointCountDetail,
    ),
    pointCountHigh: readNumber(
      style,
      "--renderer3d-points-high",
      DEFAULTS.pointCountHigh,
    ),
    animationStepMs: readNumber(
      style,
      "--renderer3d-animation-step-ms",
      DEFAULTS.animationStepMs,
    ),
    gridExtent: readNumber(
      style,
      "--renderer3d-grid-extent",
      DEFAULTS.gridExtent,
    ),
    surfaceExtent: readNumber(
      style,
      "--renderer3d-surface-extent",
      DEFAULTS.surfaceExtent,
    ),
    ghostAlpha: readNumber(
      style,
      "--renderer3d-ghost-alpha",
      DEFAULTS.ghostAlpha,
    ),
    shadedAlpha: readNumber(
      style,
      "--renderer3d-shaded-alpha",
      DEFAULTS.shadedAlpha,
    ),
    wireAlpha: readNumber(style, "--renderer3d-wire-alpha", DEFAULTS.wireAlpha),
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
    // User-set via +/- keys or preview params — use directly, no LOD scaling
    return Math.max(3, Math.min(64, override));
  } else if (quality === "card") {
    base = tokens.gridSizeCard;
  } else if (quality === "high") {
    base = tokens.gridSizeHigh;
  } else {
    base = tokens.gridSizeDetail;
  }
  // Scale by pager size (lod = cards/page). More cards = smaller cards = less geo.
  if (lod && lod > 0) {
    // 48 is default pager size → factor 1.0; 96 → ×0.5; 24 → ×1.0 (capped)
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

const readNumber = (
  style: CSSStyleDeclaration,
  name: string,
  fallback: number,
) => {
  const raw = style.getPropertyValue(name).trim();
  if (raw === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
};
