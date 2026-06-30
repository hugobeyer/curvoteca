// ---------------------------------------------------------------------------
// curves.ts
// Curvoteca's main content registry: the single source of truth for every
// curve exposed in the app. Imports each per-curve kernel from
// `lib/curves/*`, defines the `CurveDefinition` / `CurveFactory` /
// `SnippetTarget` types, and exports the `curves` array consumed by the
// home wall, the compare tray, and the dynamic [id] detail pages.
// Adding a new curve = adding a kernel in `lib/curves/` and a new entry
// in the `curves` array below.
// ---------------------------------------------------------------------------

import { anticipateCurve } from "../lib/curves/anticipate";
import { backInCurve } from "../lib/curves/back-in";
import { backInOutCurve } from "../lib/curves/back-in-out";
import { backOutCurve } from "../lib/curves/back-out";
import { bellCurveCurve } from "../lib/curves/bell-curve";
import { biasCurve } from "../lib/curves/bias";
import { bounceInCurve } from "../lib/curves/bounce-in";
import { bounceOutCurve } from "../lib/curves/bounce-out";
import { bounceInOutCurve } from "../lib/curves/bounce-in-out";
import { elasticInCurve } from "../lib/curves/elastic-in";
import { elasticInOutCurve } from "../lib/curves/elastic-in-out";
import { fbm1dCurve } from "../lib/curves/fbm-1d";
import { circularInCurve } from "../lib/curves/circular-in";
import { circularInOutCurve } from "../lib/curves/circular-in-out";
import { circularOutCurve } from "../lib/curves/circular-out";
import { clampCurve } from "../lib/curves/clamp";
import { cosineEaseCurve } from "../lib/curves/cosine-ease";
import { cosineInCurve } from "../lib/curves/cosine-in";
import { cosineOutCurve } from "../lib/curves/cosine-out";
import { cubicBezierCurve } from "../lib/curves/cubic-bezier";
import { cubicBezierMeta } from "../lib/curves/cubic-bezier.meta";
import { cubicInCurve } from "../lib/curves/cubic-in";
import { cubicInOutCurve } from "../lib/curves/cubic-in-out";
import { cubicOutCurve } from "../lib/curves/cubic-out";
import { deadZoneCurve } from "../lib/curves/dead-zone";
import { elasticOutCurve } from "../lib/curves/elastic-out";
import { expCurve } from "../lib/curves/exp";
import { expFalloffCurve } from "../lib/curves/exp-falloff";
import { exponentialInCurve } from "../lib/curves/exponential-in";
import { exponentialInOutCurve } from "../lib/curves/exponential-in-out";
import { exponentialOutCurve } from "../lib/curves/exponential-out";
import { gainCurve } from "../lib/curves/gain";
import { gaussianCurve } from "../lib/curves/gaussian";
import { inversePowerCurve } from "../lib/curves/inverse-power";
import { linearCurve } from "../lib/curves/linear";
import { logisticCurve } from "../lib/curves/logistic";
import { parabolaCurve } from "../lib/curves/parabola";
import { perlinNoise1dCurve } from "../lib/curves/perlin-noise-1d";
import { powerCurve } from "../lib/curves/power";
import { pulseCurve } from "../lib/curves/pulse";
import { quadraticEaseCurve } from "../lib/curves/quadratic-ease";
import { quadraticInCurve } from "../lib/curves/quadratic-in";
import { quadraticInOutCurve } from "../lib/curves/quadratic-in-out";
import { quadraticOutCurve } from "../lib/curves/quadratic-out";
import { quarticInCurve } from "../lib/curves/quartic-in";
import { quarticInOutCurve } from "../lib/curves/quartic-in-out";
import { quarticOutCurve } from "../lib/curves/quartic-out";
import { quinticInCurve } from "../lib/curves/quintic-in";
import { quinticInOutCurve } from "../lib/curves/quintic-in-out";
import { quinticOutCurve } from "../lib/curves/quintic-out";
import { sawtoothWaveCurve } from "../lib/curves/sawtooth-wave";
import { septicSmoothstepCurve } from "../lib/curves/septic-smoothstep";
import { signedLogisticCurve } from "../lib/curves/signed-logistic";
import { signedQuinticCurve } from "../lib/curves/signed-quintic";
import { signedQuinticMeta } from "../lib/curves/signed-quintic.meta";
import { signedScaleCurve } from "../lib/curves/signed-scale";
import { simplexNoise1dCurve } from "../lib/curves/simplex-noise-1d";
import { sincCurve } from "../lib/curves/sinc";
import { sineEaseCurve } from "../lib/curves/sine-ease";
import { sineInCurve } from "../lib/curves/sine-in";
import { sineInOutCurve } from "../lib/curves/sine-in-out";
import { sineOutCurve } from "../lib/curves/sine-out";
import { smoothstepCurve } from "../lib/curves/smoothstep";
import { smoothstepMeta } from "../lib/curves/smoothstep.meta";
import { smoothstepEdgeCurve } from "../lib/curves/smoothstep-edge";
import { smootherstepCurve } from "../lib/curves/smootherstep";
import { softDeadZoneCurve } from "../lib/curves/soft-dead-zone";
import { squareWaveCurve } from "../lib/curves/square-wave";
import { stepCurve } from "../lib/curves/step";
import { triangleWaveCurve } from "../lib/curves/triangle-wave";
import { turbulence1dCurve } from "../lib/curves/turbulence-1d";
import { valueNoise1dCurve } from "../lib/curves/value-noise-1d";
import { whiteNoise1dCurve } from "../lib/curves/white-noise-1d";
import { windowHammingCurve } from "../lib/curves/window-hamming";
import { windowHannCurve } from "../lib/curves/window-hann";
import { windowTriangleCurve } from "../lib/curves/window-triangle";
import { worleyNoise1dCurve } from "../lib/curves/worley-noise-1d";
import { springCurve } from "../lib/curves/spring";
import { stepsEasingCurve } from "../lib/curves/steps-easing";
import { smoothMinCurve } from "../lib/curves/smooth-min";
import { smoothMaxCurve } from "../lib/curves/smooth-max";
import { remapCurve } from "../lib/curves/remap";
import { inverseLerpCurve } from "../lib/curves/inverse-lerp";
import { fresnelCurve } from "../lib/curves/fresnel";
import { adsrCurve } from "../lib/curves/adsr";
import { frictionCurve } from "../lib/curves/friction";
import { hermiteCurve } from "../lib/curves/hermite";
import { overshootSettleCurve } from "../lib/curves/overshoot-settle";
import { sCurveContrastCurve } from "../lib/curves/s-curve-contrast";
import { reinhardCurve } from "../lib/curves/reinhard";
import { filmicCurve } from "../lib/curves/filmic";
import { wavefolderCurve } from "../lib/curves/wavefolder";
import { softClipCurve } from "../lib/curves/soft-clip";
import { cubicDistortionCurve } from "../lib/curves/cubic-distortion";
import { compressorCurve } from "../lib/curves/compressor";
import { lfoShapesCurve } from "../lib/curves/lfo-shapes";
import { worleyF2F1Curve } from "../lib/curves/worley-f2-f1";
import { voronoiJitterCurve } from "../lib/curves/voronoi-jitter";
import { sdfSphereCurve } from "../lib/curves/sdf-sphere";
import { sdfSphereMeta } from "../lib/curves/sdf-sphere.meta";
import { sdfBoxCurve } from "../lib/curves/sdf-box";
import { sdfRoundBoxCurve } from "../lib/curves/sdf-round-box";
import { sdfTorusCurve } from "../lib/curves/sdf-torus";
import { biquadCurve } from "../lib/curves/biquad";
import { resonantFilterCurve } from "../lib/curves/resonant-filter";
import { domainWarpCurve } from "../lib/curves/domain-warp";
import { rubberBandCurve } from "../lib/curves/rubber-band";
import { snapGridCurve } from "../lib/curves/snap-grid";
import { catmullRomCurve } from "../lib/curves/catmull-rom";
import { fmFeedbackCurve } from "../lib/curves/fm-feedback";
import { phaseDistortionCurve } from "../lib/curves/phase-distortion";
import { chebyshevCurve } from "../lib/curves/chebyshev";
import { hysteresisCurve } from "../lib/curves/hysteresis";
import { logisticMapCurve } from "../lib/curves/logistic-map";
import { svfCurve } from "../lib/curves/svf";
import { portamentoCurve } from "../lib/curves/portamento";
import { adCurve } from "../lib/curves/ad";
import { arCurve } from "../lib/curves/ar";
import { dadsrCurve } from "../lib/curves/dadsr";
import { asrCurve } from "../lib/curves/asr";
import { sdfUnionCurve } from "../lib/curves/sdf-union";
import { sdfIntersectCurve } from "../lib/curves/sdf-intersect";
import { sdfSubtractCurve } from "../lib/curves/sdf-subtract";
import type { CurveKernel, SamplingHint } from "../lib/curveMath";

export type SnippetTarget =
  | "equation"
  | "js"
  | "ts"
  | "glsl"
  | "vex"
  | "csharp"
  | "rust"
  | "hlsl"
  | "wgsl"
  | "python"
  | "css"
  | "cpp"
  | "lua"
  | "gdscript"
  | "cuda"
  | "c"
  | "json"
  | "svg";

/**
 * Future-slider hook. The UI ignores this field today; the detail page
 * will eventually read `paramNames` to render sliders and call `produce`
 * with new values to refresh the curve.
 */
export type CurveFactory = {
  paramNames: readonly string[];
  produce(params: Record<string, unknown>): CurveDefinition;
};

export type CurveDefinition = {
  id: string;
  name: string;
  aliases?: string[];
  family: string;
  summary: string;
  formula: string;
  continuity?: "C0" | "C1" | "C2" | "C3+" | "discontinuous";
  domain: [number, number];
  range: [number, number];
  tags: string[];
  useCases: string[];
  snippets?: Partial<Record<SnippetTarget, string>>;
  kernel: CurveKernel;
  sampling: SamplingHint;
  related?: string[];
  factory: CurveFactory;

  // --- optional curve metadata (see docs/MetadataPlan.md) ---
  views?: readonly CurveViewMode[];
  defaultView?: CurveViewMode;
  viewHints?: CurveViewHints;
  params?: CurveParamSchema;
  snippetOptions?: CurveSnippetOptions;
  roleTags?: readonly CurveRoleTag[];
};

// --- view modes ---------------------------------------------------------
// Closed set of preview modes. Today only "graph" is rendered; the rest
// are reserved for upcoming view-cycling work. Consumers should iterate
// CURVE_VIEW_MODES, not hardcode the list.
export type CurveViewMode =
  "graph" | "ramp" | "motion" | "field" | "heightStrip";

export const CURVE_VIEW_MODES: readonly CurveViewMode[] = [
  "graph",
  "ramp",
  "motion",
  "field",
  "heightStrip",
] as const;

// --- view hints (semantic shape flags) ---------------------------------
export type CurveViewHints = {
  signed?: boolean;
  bipolar?: boolean;
  periodic?: boolean;
  monotonic?: boolean;
  bounded?: boolean;
  preferredPreview?: CurveViewMode;
};

// --- param schema (future-slider hook) ---------------------------------
export type CurveParamDefinition = {
  label: string;
  default: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
};

export type CurveParamSchema = Record<string, CurveParamDefinition>;

// --- snippet options (per-curve opt-in for the disabled snippet bar) --
export type CurveSnippetOptions = {
  constants?: boolean;
  clamp?: boolean;
  fit?: boolean;
  function?: boolean;
  comments?: boolean;
  uniforms?: boolean;
};

export const DEFAULT_SNIPPET_OPTIONS: Required<CurveSnippetOptions> = {
  constants: true,
  clamp: true,
  fit: true,
  function: true,
  comments: true,
  uniforms: false,
};

// --- role tags (drives future chips and view defaults) -----------------
export type CurveRoleTag =
  | "easing"
  | "smoothstep"
  | "sigmoid"
  | "falloff"
  | "mask"
  | "tonemap"
  | "window"
  | "wave"
  | "noise"
  | "sdf"
  | "dsp"
  | "dynamics"
  | "remap"
  | "interpolation";

// --- view normalizer ----------------------------------------------------
// Single source of truth for "what views are available" and "what is the
// default view" for a curve. Falls back to ["graph"] / "graph" if the
// curve declares no metadata, so this is always safe to call.
export function resolveCurveViews(curve: CurveDefinition): {
  views: CurveViewMode[];
  defaultView: CurveViewMode;
} {
  const views: CurveViewMode[] = curve.views?.length
    ? [...curve.views]
    : ["graph"];
  const fromHints = curve.viewHints?.preferredPreview;
  const defaultView =
    (fromHints && views.includes(fromHints) ? fromHints : undefined) ||
    (curve.defaultView && views.includes(curve.defaultView)
      ? curve.defaultView
      : undefined) ||
    views[0];
  return { views, defaultView };
}

export const curves: CurveDefinition[] = [
  linearCurve(),
  { ...smoothstepCurve(), ...smoothstepMeta },
  smootherstepCurve(),
  septicSmoothstepCurve(),
  smoothstepEdgeCurve(),
  stepCurve(),
  powerCurve(),
  parabolaCurve(),
  quadraticEaseCurve(),
  quadraticInCurve(),
  quadraticOutCurve(),
  quadraticInOutCurve(),
  cubicInCurve(),
  cubicOutCurve(),
  cubicInOutCurve(),
  quarticInCurve(),
  quarticOutCurve(),
  quarticInOutCurve(),
  quinticInCurve(),
  quinticOutCurve(),
  quinticInOutCurve(),
  exponentialInCurve(),
  exponentialOutCurve(),
  exponentialInOutCurve(),
  biasCurve(),
  gainCurve(),
  clampCurve(),
  logisticCurve(),
  signedLogisticCurve(),
  inversePowerCurve(),
  signedScaleCurve(),
  { ...signedQuinticCurve(), ...signedQuinticMeta },
  sineEaseCurve(),
  sineInCurve(),
  sineOutCurve(),
  sineInOutCurve(),
  cosineEaseCurve(),
  cosineInCurve(),
  cosineOutCurve(),
  circularInCurve(),
  circularOutCurve(),
  circularInOutCurve(),
  backInCurve(),
  backOutCurve(),
  backInOutCurve(),
  bounceInCurve(),
  bounceOutCurve(),
  bounceInOutCurve(),
  anticipateCurve(),
  elasticInCurve(),
  elasticInOutCurve(),
  elasticOutCurve(),
  // Tier 2
  springCurve(),
  stepsEasingCurve(),
  smoothMinCurve(),
  smoothMaxCurve(),
  remapCurve(),
  inverseLerpCurve(),
  fresnelCurve(),
  adsrCurve(),
  frictionCurve(),
  hermiteCurve(),
  overshootSettleCurve(),
  // Tier 3
  sCurveContrastCurve(),
  reinhardCurve(),
  filmicCurve(),
  wavefolderCurve(),
  softClipCurve(),
  cubicDistortionCurve(),
  compressorCurve(),
  lfoShapesCurve(),
  worleyF2F1Curve(),
  voronoiJitterCurve(),
  { ...sdfSphereCurve(), ...sdfSphereMeta },
  sdfBoxCurve(),
  sdfRoundBoxCurve(),
  sdfTorusCurve(),
  biquadCurve(),
  resonantFilterCurve(),
  domainWarpCurve(),
  // Tier 4
  rubberBandCurve(),
  snapGridCurve(),
  catmullRomCurve(),
  fmFeedbackCurve(),
  phaseDistortionCurve(),
  chebyshevCurve(),
  hysteresisCurve(),
  logisticMapCurve(),
  svfCurve(),
  portamentoCurve(),
  adCurve(),
  arCurve(),
  dadsrCurve(),
  asrCurve(),
  sdfUnionCurve(),
  sdfIntersectCurve(),
  sdfSubtractCurve(),
  deadZoneCurve(),
  softDeadZoneCurve(),
  expCurve(),
  expFalloffCurve(),
  gaussianCurve(),
  bellCurveCurve(),
  sincCurve(),
  { ...cubicBezierCurve(), ...cubicBezierMeta },
  windowHannCurve(),
  windowHammingCurve(),
  windowTriangleCurve(),
  pulseCurve(),
  triangleWaveCurve(),
  sawtoothWaveCurve(),
  squareWaveCurve(),
  valueNoise1dCurve(),
  perlinNoise1dCurve(),
  simplexNoise1dCurve(),
  fbm1dCurve(),
  turbulence1dCurve(),
  worleyNoise1dCurve(),
  whiteNoise1dCurve(),
];
