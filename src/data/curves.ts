// ---------------------------------------------------------------------------
// curves.ts
// Curvoteca's curve registry: the single source of truth for every curve.
// Imports kernels from `lib/curves/*`, exports the `curves` array consumed
// by the home wall, compare tray, and dynamic [id] detail pages.
// To add a curve: add a kernel in `lib/curves/` and a new entry below.
// ---------------------------------------------------------------------------

import { linearCurve } from "../lib/curves/linear";
import { linearMeta } from "../lib/curves/linear.meta";
import { smoothstepCurve } from "../lib/curves/smoothstep";
import { smoothstepMeta } from "../lib/curves/smoothstep.meta";
import { smootherstepCurve } from "../lib/curves/smootherstep";
import { smootherstepMeta } from "../lib/curves/smootherstep.meta";
import { septicSmoothstepCurve } from "../lib/curves/septic-smoothstep";
import { septicSmoothstepMeta } from "../lib/curves/septic-smoothstep.meta";
import { smoothstepEdgeCurve } from "../lib/curves/smoothstep-edge";
import { smoothstepEdgeMeta } from "../lib/curves/smoothstep-edge.meta";
import { stepCurve } from "../lib/curves/step";
import { stepMeta } from "../lib/curves/step.meta";
import { powerCurve } from "../lib/curves/power";
import { powerMeta } from "../lib/curves/power.meta";
import { parabolaCurve } from "../lib/curves/parabola";
import { parabolaMeta } from "../lib/curves/parabola.meta";
import { quadraticEaseCurve } from "../lib/curves/quadratic-ease";
import { quadraticEaseMeta } from "../lib/curves/quadratic-ease.meta";
import { quadraticInCurve } from "../lib/curves/quadratic-in";
import { quadraticInMeta } from "../lib/curves/quadratic-in.meta";
import { quadraticOutCurve } from "../lib/curves/quadratic-out";
import { quadraticOutMeta } from "../lib/curves/quadratic-out.meta";
import { quadraticInOutCurve } from "../lib/curves/quadratic-in-out";
import { quadraticInOutMeta } from "../lib/curves/quadratic-in-out.meta";
import { cubicInCurve } from "../lib/curves/cubic-in";
import { cubicInMeta } from "../lib/curves/cubic-in.meta";
import { cubicOutCurve } from "../lib/curves/cubic-out";
import { cubicOutMeta } from "../lib/curves/cubic-out.meta";
import { cubicInOutCurve } from "../lib/curves/cubic-in-out";
import { cubicInOutMeta } from "../lib/curves/cubic-in-out.meta";
import { quarticInCurve } from "../lib/curves/quartic-in";
import { quarticInMeta } from "../lib/curves/quartic-in.meta";
import { quarticOutCurve } from "../lib/curves/quartic-out";
import { quarticOutMeta } from "../lib/curves/quartic-out.meta";
import { quarticInOutCurve } from "../lib/curves/quartic-in-out";
import { quarticInOutMeta } from "../lib/curves/quartic-in-out.meta";
import { quinticInCurve } from "../lib/curves/quintic-in";
import { quinticInMeta } from "../lib/curves/quintic-in.meta";
import { quinticOutCurve } from "../lib/curves/quintic-out";
import { quinticOutMeta } from "../lib/curves/quintic-out.meta";
import { quinticInOutCurve } from "../lib/curves/quintic-in-out";
import { quinticInOutMeta } from "../lib/curves/quintic-in-out.meta";
import { exponentialInCurve } from "../lib/curves/exponential-in";
import { exponentialInMeta } from "../lib/curves/exponential-in.meta";
import { exponentialOutCurve } from "../lib/curves/exponential-out";
import { exponentialOutMeta } from "../lib/curves/exponential-out.meta";
import { exponentialInOutCurve } from "../lib/curves/exponential-in-out";
import { exponentialInOutMeta } from "../lib/curves/exponential-in-out.meta";
import { biasCurve } from "../lib/curves/bias";
import { biasMeta } from "../lib/curves/bias.meta";
import { gainCurve } from "../lib/curves/gain";
import { gainMeta } from "../lib/curves/gain.meta";
import { clampCurve } from "../lib/curves/clamp";
import { clampMeta } from "../lib/curves/clamp.meta";
import { logisticCurve } from "../lib/curves/logistic";
import { logisticMeta } from "../lib/curves/logistic.meta";
import { signedLogisticCurve } from "../lib/curves/signed-logistic";
import { signedLogisticMeta } from "../lib/curves/signed-logistic.meta";
import { inversePowerCurve } from "../lib/curves/inverse-power";
import { inversePowerMeta } from "../lib/curves/inverse-power.meta";
import { signedScaleCurve } from "../lib/curves/signed-scale";
import { signedScaleMeta } from "../lib/curves/signed-scale.meta";
import { signedQuinticCurve } from "../lib/curves/signed-quintic";
import { signedQuinticMeta } from "../lib/curves/signed-quintic.meta";
import { sineEaseCurve } from "../lib/curves/sine-ease";
import { sineEaseMeta } from "../lib/curves/sine-ease.meta";
import { sineInCurve } from "../lib/curves/sine-in";
import { sineInMeta } from "../lib/curves/sine-in.meta";
import { sineOutCurve } from "../lib/curves/sine-out";
import { sineOutMeta } from "../lib/curves/sine-out.meta";
import { sineInOutCurve } from "../lib/curves/sine-in-out";
import { sineInOutMeta } from "../lib/curves/sine-in-out.meta";
import { cosineEaseCurve } from "../lib/curves/cosine-ease";
import { cosineEaseMeta } from "../lib/curves/cosine-ease.meta";
import { cosineInCurve } from "../lib/curves/cosine-in";
import { cosineInMeta } from "../lib/curves/cosine-in.meta";
import { cosineOutCurve } from "../lib/curves/cosine-out";
import { cosineOutMeta } from "../lib/curves/cosine-out.meta";
import { circularInCurve } from "../lib/curves/circular-in";
import { circularInMeta } from "../lib/curves/circular-in.meta";
import { circularOutCurve } from "../lib/curves/circular-out";
import { circularOutMeta } from "../lib/curves/circular-out.meta";
import { circularInOutCurve } from "../lib/curves/circular-in-out";
import { circularInOutMeta } from "../lib/curves/circular-in-out.meta";
import { backInCurve } from "../lib/curves/back-in";
import { backInMeta } from "../lib/curves/back-in.meta";
import { backOutCurve } from "../lib/curves/back-out";
import { backOutMeta } from "../lib/curves/back-out.meta";
import { backInOutCurve } from "../lib/curves/back-in-out";
import { backInOutMeta } from "../lib/curves/back-in-out.meta";
import { bounceInCurve } from "../lib/curves/bounce-in";
import { bounceInMeta } from "../lib/curves/bounce-in.meta";
import { bounceOutCurve } from "../lib/curves/bounce-out";
import { bounceOutMeta } from "../lib/curves/bounce-out.meta";
import { bounceInOutCurve } from "../lib/curves/bounce-in-out";
import { bounceInOutMeta } from "../lib/curves/bounce-in-out.meta";
import { anticipateCurve } from "../lib/curves/anticipate";
import { anticipateMeta } from "../lib/curves/anticipate.meta";
import { elasticInCurve } from "../lib/curves/elastic-in";
import { elasticInMeta } from "../lib/curves/elastic-in.meta";
import { elasticInOutCurve } from "../lib/curves/elastic-in-out";
import { elasticInOutMeta } from "../lib/curves/elastic-in-out.meta";
import { elasticOutCurve } from "../lib/curves/elastic-out";
import { elasticOutMeta } from "../lib/curves/elastic-out.meta";
import { springCurve } from "../lib/curves/spring";
import { springMeta } from "../lib/curves/spring.meta";
import { stepsEasingCurve } from "../lib/curves/steps-easing";
import { stepsEasingMeta } from "../lib/curves/steps-easing.meta";
import { smoothMinCurve } from "../lib/curves/smooth-min";
import { smoothMinMeta } from "../lib/curves/smooth-min.meta";
import { smoothMaxCurve } from "../lib/curves/smooth-max";
import { smoothMaxMeta } from "../lib/curves/smooth-max.meta";
import { remapCurve } from "../lib/curves/remap";
import { remapMeta } from "../lib/curves/remap.meta";
import { inverseLerpCurve } from "../lib/curves/inverse-lerp";
import { inverseLerpMeta } from "../lib/curves/inverse-lerp.meta";
import { fresnelCurve } from "../lib/curves/fresnel";
import { fresnelMeta } from "../lib/curves/fresnel.meta";
import { adsrCurve } from "../lib/curves/adsr";
import { adsrMeta } from "../lib/curves/adsr.meta";
import { frictionCurve } from "../lib/curves/friction";
import { frictionMeta } from "../lib/curves/friction.meta";
import { hermiteCurve } from "../lib/curves/hermite";
import { hermiteMeta } from "../lib/curves/hermite.meta";
import { overshootSettleCurve } from "../lib/curves/overshoot-settle";
import { overshootSettleMeta } from "../lib/curves/overshoot-settle.meta";
import { sCurveContrastCurve } from "../lib/curves/s-curve-contrast";
import { sCurveContrastMeta } from "../lib/curves/s-curve-contrast.meta";
import { reinhardCurve } from "../lib/curves/reinhard";
import { reinhardMeta } from "../lib/curves/reinhard.meta";
import { filmicCurve } from "../lib/curves/filmic";
import { filmicMeta } from "../lib/curves/filmic.meta";
import { wavefolderCurve } from "../lib/curves/wavefolder";
import { wavefolderMeta } from "../lib/curves/wavefolder.meta";
import { softClipCurve } from "../lib/curves/soft-clip";
import { softClipMeta } from "../lib/curves/soft-clip.meta";
import { cubicDistortionCurve } from "../lib/curves/cubic-distortion";
import { cubicDistortionMeta } from "../lib/curves/cubic-distortion.meta";
import { compressorCurve } from "../lib/curves/compressor";
import { compressorMeta } from "../lib/curves/compressor.meta";
import { lfoShapesCurve } from "../lib/curves/lfo-shapes";
import { lfoShapesMeta } from "../lib/curves/lfo-shapes.meta";
import { worleyF2F1Curve } from "../lib/curves/worley-f2-f1";
import { worleyF2F1Meta } from "../lib/curves/worley-f2-f1.meta";
import { voronoiJitterCurve } from "../lib/curves/voronoi-jitter";
import { voronoiJitterMeta } from "../lib/curves/voronoi-jitter.meta";
import { sdfSphereCurve } from "../lib/curves/sdf-sphere";
import { sdfSphereMeta } from "../lib/curves/sdf-sphere.meta";
import { sdfBoxCurve } from "../lib/curves/sdf-box";
import { sdfBoxMeta } from "../lib/curves/sdf-box.meta";
import { sdfRoundBoxCurve } from "../lib/curves/sdf-round-box";
import { sdfRoundBoxMeta } from "../lib/curves/sdf-round-box.meta";
import { sdfTorusCurve } from "../lib/curves/sdf-torus";
import { sdfTorusMeta } from "../lib/curves/sdf-torus.meta";
import { biquadCurve } from "../lib/curves/biquad";
import { biquadMeta } from "../lib/curves/biquad.meta";
import { resonantFilterCurve } from "../lib/curves/resonant-filter";
import { resonantFilterMeta } from "../lib/curves/resonant-filter.meta";
import { domainWarpCurve } from "../lib/curves/domain-warp";
import { domainWarpMeta } from "../lib/curves/domain-warp.meta";
import { rubberBandCurve } from "../lib/curves/rubber-band";
import { rubberBandMeta } from "../lib/curves/rubber-band.meta";
import { snapGridCurve } from "../lib/curves/snap-grid";
import { snapGridMeta } from "../lib/curves/snap-grid.meta";
import { catmullRomCurve } from "../lib/curves/catmull-rom";
import { catmullRomMeta } from "../lib/curves/catmull-rom.meta";
import { fmFeedbackCurve } from "../lib/curves/fm-feedback";
import { fmFeedbackMeta } from "../lib/curves/fm-feedback.meta";
import { phaseDistortionCurve } from "../lib/curves/phase-distortion";
import { phaseDistortionMeta } from "../lib/curves/phase-distortion.meta";
import { chebyshevCurve } from "../lib/curves/chebyshev";
import { chebyshevMeta } from "../lib/curves/chebyshev.meta";
import { hysteresisCurve } from "../lib/curves/hysteresis";
import { hysteresisMeta } from "../lib/curves/hysteresis.meta";
import { logisticMapCurve } from "../lib/curves/logistic-map";
import { logisticMapMeta } from "../lib/curves/logistic-map.meta";
import { svfCurve } from "../lib/curves/svf";
import { svfMeta } from "../lib/curves/svf.meta";
import { portamentoCurve } from "../lib/curves/portamento";
import { portamentoMeta } from "../lib/curves/portamento.meta";
import { adCurve } from "../lib/curves/ad";
import { adMeta } from "../lib/curves/ad.meta";
import { arCurve } from "../lib/curves/ar";
import { arMeta } from "../lib/curves/ar.meta";
import { dadsrCurve } from "../lib/curves/dadsr";
import { dadsrMeta } from "../lib/curves/dadsr.meta";
import { asrCurve } from "../lib/curves/asr";
import { asrMeta } from "../lib/curves/asr.meta";
import { sdfUnionCurve } from "../lib/curves/sdf-union";
import { sdfUnionMeta } from "../lib/curves/sdf-union.meta";
import { sdfIntersectCurve } from "../lib/curves/sdf-intersect";
import { sdfIntersectMeta } from "../lib/curves/sdf-intersect.meta";
import { sdfSubtractCurve } from "../lib/curves/sdf-subtract";
import { sdfSubtractMeta } from "../lib/curves/sdf-subtract.meta";
import { deadZoneCurve } from "../lib/curves/dead-zone";
import { deadZoneMeta } from "../lib/curves/dead-zone.meta";
import { softDeadZoneCurve } from "../lib/curves/soft-dead-zone";
import { softDeadZoneMeta } from "../lib/curves/soft-dead-zone.meta";
import { expCurve } from "../lib/curves/exp";
import { expMeta } from "../lib/curves/exp.meta";
import { expFalloffCurve } from "../lib/curves/exp-falloff";
import { expFalloffMeta } from "../lib/curves/exp-falloff.meta";
import { gaussianCurve } from "../lib/curves/gaussian";
import { gaussianMeta } from "../lib/curves/gaussian.meta";
import { bellCurveCurve } from "../lib/curves/bell-curve";
import { bellCurveMeta } from "../lib/curves/bell-curve.meta";
import { sincCurve } from "../lib/curves/sinc";
import { sincMeta } from "../lib/curves/sinc.meta";
import { cubicBezierCurve } from "../lib/curves/cubic-bezier";
import { cubicBezierMeta } from "../lib/curves/cubic-bezier.meta";
import { windowHannCurve } from "../lib/curves/window-hann";
import { windowHannMeta } from "../lib/curves/window-hann.meta";
import { windowHammingCurve } from "../lib/curves/window-hamming";
import { windowHammingMeta } from "../lib/curves/window-hamming.meta";
import { windowTriangleCurve } from "../lib/curves/window-triangle";
import { windowTriangleMeta } from "../lib/curves/window-triangle.meta";
import { pulseCurve } from "../lib/curves/pulse";
import { pulseMeta } from "../lib/curves/pulse.meta";
import { triangleWaveCurve } from "../lib/curves/triangle-wave";
import { triangleWaveMeta } from "../lib/curves/triangle-wave.meta";
import { sawtoothWaveCurve } from "../lib/curves/sawtooth-wave";
import { sawtoothWaveMeta } from "../lib/curves/sawtooth-wave.meta";
import { squareWaveCurve } from "../lib/curves/square-wave";
import { squareWaveMeta } from "../lib/curves/square-wave.meta";
import { valueNoise1dCurve } from "../lib/curves/value-noise-1d";
import { valueNoise1dMeta } from "../lib/curves/value-noise-1d.meta";
import { perlinNoise1dCurve } from "../lib/curves/perlin-noise-1d";
import { perlinNoise1dMeta } from "../lib/curves/perlin-noise-1d.meta";
import { simplexNoise1dCurve } from "../lib/curves/simplex-noise-1d";
import { simplexNoise1dMeta } from "../lib/curves/simplex-noise-1d.meta";
import { fbm1dCurve } from "../lib/curves/fbm-1d";
import { fbm1dMeta } from "../lib/curves/fbm-1d.meta";
import { fbm3dNoiseCurve } from "../lib/curves/fbm-3d-noise";
import { fbm3dNoiseMeta } from "../lib/curves/fbm-3d-noise.meta";
import { turbulence1dCurve } from "../lib/curves/turbulence-1d";
import { turbulence1dMeta } from "../lib/curves/turbulence-1d.meta";
import { worleyNoise1dCurve } from "../lib/curves/worley-noise-1d";
import { worleyNoise1dMeta } from "../lib/curves/worley-noise-1d.meta";
import { whiteNoise1dCurve } from "../lib/curves/white-noise-1d";
import { whiteNoise1dMeta } from "../lib/curves/white-noise-1d.meta";
import type { CurveKernel, SamplingHint } from "../lib/curveMath";
import type {
  Renderer3DParams,
  Renderer3DQuality,
  Renderer3DRenderMode,
  Renderer3DUseCase,
  Renderer3DViewId,
} from "../lib/renderer3d";

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
  | "svg"
  | "metal"
  | "opencl"
  | "unity"
  | "shadertoy"
  | "svelte"
  | "matlab"
  | "excel"
  | "desmos";

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
  preview?: CurvePreview;
};

export type CurvePreview =
  | { kind: "canvas2d" }
  | {
      kind: "renderer3d";
      viewId: Renderer3DViewId;
      useCase?: Renderer3DUseCase;
      renderMode?: Renderer3DRenderMode;
      quality?: Renderer3DQuality;
      params?: Renderer3DParams;
    };

// --- view modes ---------------------------------------------------------
// Closed set of preview modes. Today only "graph" is rendered; the rest
// are reserved for upcoming view-cycling work. Consumers should iterate
// CURVE_VIEW_MODES, not hardcode the list.
export type CurveViewMode =
  "graph" | "ramp" | "motion" | "field" | "heightStrip";

export const CURVE_VIEW_MODES: readonly CurveViewMode[] = [
  "graph",
  "motion",
  "field",
  "heightStrip",
  "ramp",
] as const;

// --- view hints (semantic shape flags) ---------------------------------
export type CurveViewHints = {
  signed?: boolean;
  bipolar?: boolean;
  // Center Y-sensitive viewport chrome around y=0.
  centerY?: boolean;
  // Center the canonical quad vertically around y=0.
  centerQuadY?: boolean;
  // Treat the zero axis as a semantic reference line.
  zeroAxis?: boolean;
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
  params?: boolean;
  bindings?: boolean;
  clamp?: boolean;
  fit?: boolean;
  function?: boolean;
  comments?: boolean;
  uniforms?: boolean;
};

export const DEFAULT_SNIPPET_OPTIONS: Required<CurveSnippetOptions> = {
  constants: true,
  params: false,
  bindings: false,
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
  | "procedural"
  | "renderer3d"
  | "pointcloud"
  | "terrain"
  | "field"
  | "volume"
  | "lsystem"
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
  { ...linearCurve(), ...linearMeta },
  { ...smoothstepCurve(), ...smoothstepMeta },
  { ...smootherstepCurve(), ...smootherstepMeta },
  { ...septicSmoothstepCurve(), ...septicSmoothstepMeta },
  { ...smoothstepEdgeCurve(), ...smoothstepEdgeMeta },
  { ...stepCurve(), ...stepMeta },
  { ...powerCurve(), ...powerMeta },
  { ...parabolaCurve(), ...parabolaMeta },
  { ...quadraticEaseCurve(), ...quadraticEaseMeta },
  { ...quadraticInCurve(), ...quadraticInMeta },
  { ...quadraticOutCurve(), ...quadraticOutMeta },
  { ...quadraticInOutCurve(), ...quadraticInOutMeta },
  { ...cubicInCurve(), ...cubicInMeta },
  { ...cubicOutCurve(), ...cubicOutMeta },
  { ...cubicInOutCurve(), ...cubicInOutMeta },
  { ...quarticInCurve(), ...quarticInMeta },
  { ...quarticOutCurve(), ...quarticOutMeta },
  { ...quarticInOutCurve(), ...quarticInOutMeta },
  { ...quinticInCurve(), ...quinticInMeta },
  { ...quinticOutCurve(), ...quinticOutMeta },
  { ...quinticInOutCurve(), ...quinticInOutMeta },
  { ...exponentialInCurve(), ...exponentialInMeta },
  { ...exponentialOutCurve(), ...exponentialOutMeta },
  { ...exponentialInOutCurve(), ...exponentialInOutMeta },
  { ...biasCurve(), ...biasMeta },
  { ...gainCurve(), ...gainMeta },
  { ...clampCurve(), ...clampMeta },
  { ...logisticCurve(), ...logisticMeta },
  { ...signedLogisticCurve(), ...signedLogisticMeta },
  { ...inversePowerCurve(), ...inversePowerMeta },
  { ...signedScaleCurve(), ...signedScaleMeta },
  { ...signedQuinticCurve(), ...signedQuinticMeta },
  { ...sineEaseCurve(), ...sineEaseMeta },
  { ...sineInCurve(), ...sineInMeta },
  { ...sineOutCurve(), ...sineOutMeta },
  { ...sineInOutCurve(), ...sineInOutMeta },
  { ...cosineEaseCurve(), ...cosineEaseMeta },
  { ...cosineInCurve(), ...cosineInMeta },
  { ...cosineOutCurve(), ...cosineOutMeta },
  { ...circularInCurve(), ...circularInMeta },
  { ...circularOutCurve(), ...circularOutMeta },
  { ...circularInOutCurve(), ...circularInOutMeta },
  { ...backInCurve(), ...backInMeta },
  { ...backOutCurve(), ...backOutMeta },
  { ...backInOutCurve(), ...backInOutMeta },
  { ...bounceInCurve(), ...bounceInMeta },
  { ...bounceOutCurve(), ...bounceOutMeta },
  { ...bounceInOutCurve(), ...bounceInOutMeta },
  { ...anticipateCurve(), ...anticipateMeta },
  { ...elasticInCurve(), ...elasticInMeta },
  { ...elasticInOutCurve(), ...elasticInOutMeta },
  { ...elasticOutCurve(), ...elasticOutMeta },
  { ...springCurve(), ...springMeta },
  { ...stepsEasingCurve(), ...stepsEasingMeta },
  { ...smoothMinCurve(), ...smoothMinMeta },
  { ...smoothMaxCurve(), ...smoothMaxMeta },
  { ...remapCurve(), ...remapMeta },
  { ...inverseLerpCurve(), ...inverseLerpMeta },
  { ...fresnelCurve(), ...fresnelMeta },
  { ...adsrCurve(), ...adsrMeta },
  { ...frictionCurve(), ...frictionMeta },
  { ...hermiteCurve(), ...hermiteMeta },
  { ...overshootSettleCurve(), ...overshootSettleMeta },
  { ...sCurveContrastCurve(), ...sCurveContrastMeta },
  { ...reinhardCurve(), ...reinhardMeta },
  { ...filmicCurve(), ...filmicMeta },
  { ...wavefolderCurve(), ...wavefolderMeta },
  { ...softClipCurve(), ...softClipMeta },
  { ...cubicDistortionCurve(), ...cubicDistortionMeta },
  { ...compressorCurve(), ...compressorMeta },
  { ...lfoShapesCurve(), ...lfoShapesMeta },
  { ...worleyF2F1Curve(), ...worleyF2F1Meta },
  { ...voronoiJitterCurve(), ...voronoiJitterMeta },
  { ...sdfSphereCurve(), ...sdfSphereMeta },
  { ...sdfBoxCurve(), ...sdfBoxMeta },
  { ...sdfRoundBoxCurve(), ...sdfRoundBoxMeta },
  { ...sdfTorusCurve(), ...sdfTorusMeta },
  { ...biquadCurve(), ...biquadMeta },
  { ...resonantFilterCurve(), ...resonantFilterMeta },
  { ...domainWarpCurve(), ...domainWarpMeta },
  { ...rubberBandCurve(), ...rubberBandMeta },
  { ...snapGridCurve(), ...snapGridMeta },
  { ...catmullRomCurve(), ...catmullRomMeta },
  { ...fmFeedbackCurve(), ...fmFeedbackMeta },
  { ...phaseDistortionCurve(), ...phaseDistortionMeta },
  { ...chebyshevCurve(), ...chebyshevMeta },
  { ...hysteresisCurve(), ...hysteresisMeta },
  { ...logisticMapCurve(), ...logisticMapMeta },
  { ...svfCurve(), ...svfMeta },
  { ...portamentoCurve(), ...portamentoMeta },
  { ...adCurve(), ...adMeta },
  { ...arCurve(), ...arMeta },
  { ...dadsrCurve(), ...dadsrMeta },
  { ...asrCurve(), ...asrMeta },
  { ...sdfUnionCurve(), ...sdfUnionMeta },
  { ...sdfIntersectCurve(), ...sdfIntersectMeta },
  { ...sdfSubtractCurve(), ...sdfSubtractMeta },
  { ...deadZoneCurve(), ...deadZoneMeta },
  { ...softDeadZoneCurve(), ...softDeadZoneMeta },
  { ...expCurve(), ...expMeta },
  { ...expFalloffCurve(), ...expFalloffMeta },
  { ...gaussianCurve(), ...gaussianMeta },
  { ...bellCurveCurve(), ...bellCurveMeta },
  { ...sincCurve(), ...sincMeta },
  { ...cubicBezierCurve(), ...cubicBezierMeta },
  { ...windowHannCurve(), ...windowHannMeta },
  { ...windowHammingCurve(), ...windowHammingMeta },
  { ...windowTriangleCurve(), ...windowTriangleMeta },
  { ...pulseCurve(), ...pulseMeta },
  { ...triangleWaveCurve(), ...triangleWaveMeta },
  { ...sawtoothWaveCurve(), ...sawtoothWaveMeta },
  { ...squareWaveCurve(), ...squareWaveMeta },
  { ...valueNoise1dCurve(), ...valueNoise1dMeta },
  { ...perlinNoise1dCurve(), ...perlinNoise1dMeta },
  { ...simplexNoise1dCurve(), ...simplexNoise1dMeta },
  { ...fbm1dCurve(), ...fbm1dMeta },
  { ...fbm3dNoiseCurve(), ...fbm3dNoiseMeta },
  { ...turbulence1dCurve(), ...turbulence1dMeta },
  { ...worleyNoise1dCurve(), ...worleyNoise1dMeta },
  { ...whiteNoise1dCurve(), ...whiteNoise1dMeta },
];
