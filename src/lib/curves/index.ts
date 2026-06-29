// Re-exports for the per-curve factories. The registry lives in
// `src/data/curves.ts`; this module exists so consumers (e.g. a future
// detail page that wants a single curve) can pull one factory without
// pulling the whole registry.
export {
  anticipateCurve,
  defaultParams as anticipateDefaultParams,
  type AnticipateParams,
} from "./anticipate";
export {
  linearCurve,
  defaultParams as linearDefaultParams,
  type LinearParams,
} from "./linear";
export {
  smoothstepCurve,
  defaultParams as smoothstepDefaultParams,
  type SmoothstepParams,
} from "./smoothstep";
export {
  smoothstepEdgeCurve,
  defaultParams as smoothstepEdgeDefaultParams,
  type SmoothstepEdgeParams,
} from "./smoothstep-edge";
export {
  smootherstepCurve,
  defaultParams as smootherstepDefaultParams,
  type SmootherstepParams,
} from "./smootherstep";
export {
  septicSmoothstepCurve,
  defaultParams as septicSmoothstepDefaultParams,
  type SepticSmoothstepParams,
} from "./septic-smoothstep";
export {
  powerCurve,
  defaultParams as powerDefaultParams,
  type PowerParams,
} from "./power";
export {
  pulseCurve,
  defaultParams as pulseDefaultParams,
  type PulseParams,
} from "./pulse";
export {
  quadraticEaseCurve,
  defaultParams as quadraticEaseDefaultParams,
  type QuadraticEaseParams,
} from "./quadratic-ease";
export {
  quadraticInCurve,
  defaultParams as quadraticInDefaultParams,
  type QuadraticInParams,
} from "./quadratic-in";
export {
  quadraticInOutCurve,
  defaultParams as quadraticInOutDefaultParams,
  type QuadraticInOutParams,
} from "./quadratic-in-out";
export {
  quadraticOutCurve,
  defaultParams as quadraticOutDefaultParams,
  type QuadraticOutParams,
} from "./quadratic-out";
export {
  quarticInCurve,
  defaultParams as quarticInDefaultParams,
  type QuarticInParams,
} from "./quartic-in";
export {
  quarticInOutCurve,
  defaultParams as quarticInOutDefaultParams,
  type QuarticInOutParams,
} from "./quartic-in-out";
export {
  quarticOutCurve,
  defaultParams as quarticOutDefaultParams,
  type QuarticOutParams,
} from "./quartic-out";
export {
  quinticInCurve,
  defaultParams as quinticInDefaultParams,
  type QuinticInParams,
} from "./quintic-in";
export {
  quinticInOutCurve,
  defaultParams as quinticInOutDefaultParams,
  type QuinticInOutParams,
} from "./quintic-in-out";
export {
  quinticOutCurve,
  defaultParams as quinticOutDefaultParams,
  type QuinticOutParams,
} from "./quintic-out";
export {
  sawtoothWaveCurve,
  defaultParams as sawtoothWaveDefaultParams,
  type SawtoothWaveParams,
} from "./sawtooth-wave";
export {
  biasCurve,
  defaultParams as biasDefaultParams,
  type BiasParams,
} from "./bias";
export {
  gainCurve,
  defaultParams as gainDefaultParams,
  type GainParams,
} from "./gain";
export {
  gaussianCurve,
  defaultParams as gaussianDefaultParams,
  type GaussianParams,
} from "./gaussian";
export {
  clampCurve,
  defaultParams as clampDefaultParams,
  type ClampParams,
} from "./clamp";
export {
  logisticCurve,
  defaultParams as logisticDefaultParams,
  type LogisticParams,
} from "./logistic";
export {
  signedLogisticCurve,
  defaultParams as signedLogisticDefaultParams,
  type SignedLogisticParams,
} from "./signed-logistic";
export {
  inversePowerCurve,
  defaultParams as inversePowerDefaultParams,
  type InversePowerParams,
} from "./inverse-power";
export {
  signedScaleCurve,
  defaultParams as signedScaleDefaultParams,
  type SignedScaleParams,
} from "./signed-scale";
export {
  simplexNoise1dCurve,
  defaultParams as simplexNoise1dDefaultParams,
  type SimplexNoise1dParams,
} from "./simplex-noise-1d";
export {
  sincCurve,
  defaultParams as sincDefaultParams,
  type SincParams,
} from "./sinc";
export {
  signedQuinticCurve,
  defaultParams as signedQuinticDefaultParams,
  type SignedQuinticParams,
} from "./signed-quintic";
export {
  sineEaseCurve,
  defaultParams as sineEaseDefaultParams,
  type SineEaseParams,
} from "./sine-ease";
export {
  sineInCurve,
  defaultParams as sineInDefaultParams,
  type SineInParams,
} from "./sine-in";
export {
  sineInOutCurve,
  defaultParams as sineInOutDefaultParams,
  type SineInOutParams,
} from "./sine-in-out";
export {
  sineOutCurve,
  defaultParams as sineOutDefaultParams,
  type SineOutParams,
} from "./sine-out";
export {
  cosineEaseCurve,
  defaultParams as cosineEaseDefaultParams,
  type CosineEaseParams,
} from "./cosine-ease";
export {
  cosineInCurve,
  defaultParams as cosineInDefaultParams,
  type CosineInParams,
} from "./cosine-in";
export {
  cosineOutCurve,
  defaultParams as cosineOutDefaultParams,
  type CosineOutParams,
} from "./cosine-out";
export {
  cubicBezierCurve,
  defaultParams as cubicBezierDefaultParams,
  type CubicBezierParams,
} from "./cubic-bezier";
export {
  cubicInCurve,
  defaultParams as cubicInDefaultParams,
  type CubicInParams,
} from "./cubic-in";
export {
  cubicInOutCurve,
  defaultParams as cubicInOutDefaultParams,
  type CubicInOutParams,
} from "./cubic-in-out";
export {
  cubicOutCurve,
  defaultParams as cubicOutDefaultParams,
  type CubicOutParams,
} from "./cubic-out";
export {
  circularInCurve,
  defaultParams as circularInDefaultParams,
  type CircularInParams,
} from "./circular-in";
export {
  circularOutCurve,
  defaultParams as circularOutDefaultParams,
  type CircularOutParams,
} from "./circular-out";
export {
  circularInOutCurve,
  defaultParams as circularInOutDefaultParams,
  type CircularInOutParams,
} from "./circular-in-out";
export {
  backInCurve,
  defaultParams as backInDefaultParams,
  type BackInParams,
} from "./back-in";
export {
  bellCurveCurve,
  defaultParams as bellCurveDefaultParams,
  type BellCurveParams,
} from "./bell-curve";
export {
  backOutCurve,
  defaultParams as backOutDefaultParams,
  type BackOutParams,
} from "./back-out";
export {
  backInOutCurve,
  defaultParams as backInOutDefaultParams,
  type BackInOutParams,
} from "./back-in-out";
export {
  bounceInCurve,
  defaultParams as bounceInDefaultParams,
  type BounceInParams,
} from "./bounce-in";
export {
  bounceOutCurve,
  defaultParams as bounceOutDefaultParams,
  type BounceOutParams,
} from "./bounce-out";
export {
  fbm1dCurve,
  defaultParams as fbm1dDefaultParams,
  type Fbm1dParams,
} from "./fbm-1d";
export {
  elasticOutCurve,
  defaultParams as elasticOutDefaultParams,
  type ElasticOutParams,
} from "./elastic-out";
export {
  elasticInCurve,
  defaultParams as elasticInDefaultParams,
  type ElasticInParams,
} from "./elastic-in";
export {
  elasticInOutCurve,
  defaultParams as elasticInOutDefaultParams,
  type ElasticInOutParams,
} from "./elastic-in-out";
export {
  bounceInOutCurve,
  defaultParams as bounceInOutDefaultParams,
  type BounceInOutParams,
} from "./bounce-in-out";
export {
  deadZoneCurve,
  defaultParams as deadZoneDefaultParams,
  type DeadZoneParams,
} from "./dead-zone";
export {
  softDeadZoneCurve,
  defaultParams as softDeadZoneDefaultParams,
  type SoftDeadZoneParams,
} from "./soft-dead-zone";
export {
  squareWaveCurve,
  defaultParams as squareWaveDefaultParams,
  type SquareWaveParams,
} from "./square-wave";
export {
  stepCurve,
  defaultParams as stepDefaultParams,
  type StepParams,
} from "./step";
export {
  expCurve,
  defaultParams as expDefaultParams,
  type ExpParams,
} from "./exp";
export {
  expFalloffCurve,
  defaultParams as expFalloffDefaultParams,
  type ExpFalloffParams,
} from "./exp-falloff";
export {
  exponentialInCurve,
  defaultParams as exponentialInDefaultParams,
  type ExponentialInParams,
} from "./exponential-in";
export {
  exponentialInOutCurve,
  defaultParams as exponentialInOutDefaultParams,
  type ExponentialInOutParams,
} from "./exponential-in-out";
export {
  exponentialOutCurve,
  defaultParams as exponentialOutDefaultParams,
  type ExponentialOutParams,
} from "./exponential-out";
export {
  triangleWaveCurve,
  defaultParams as triangleWaveDefaultParams,
  type TriangleWaveParams,
} from "./triangle-wave";
export {
  turbulence1dCurve,
  defaultParams as turbulence1dDefaultParams,
  type Turbulence1dParams,
} from "./turbulence-1d";
export {
  valueNoise1dCurve,
  defaultParams as valueNoise1dDefaultParams,
  type ValueNoise1dParams,
} from "./value-noise-1d";
export {
  whiteNoise1dCurve,
  defaultParams as whiteNoise1dDefaultParams,
  type WhiteNoise1dParams,
} from "./white-noise-1d";
export {
  windowHammingCurve,
  defaultParams as windowHammingDefaultParams,
  type WindowHammingParams,
} from "./window-hamming";
export {
  windowHannCurve,
  defaultParams as windowHannDefaultParams,
  type WindowHannParams,
} from "./window-hann";
export {
  windowTriangleCurve,
  defaultParams as windowTriangleDefaultParams,
  type WindowTriangleParams,
} from "./window-triangle";
export {
  worleyNoise1dCurve,
  defaultParams as worleyNoise1dDefaultParams,
  type WorleyNoise1dParams,
} from "./worley-noise-1d";
export {
  parabolaCurve,
  defaultParams as parabolaDefaultParams,
  type ParabolaParams,
} from "./parabola";
export {
  perlinNoise1dCurve,
  defaultParams as perlinNoise1dDefaultParams,
  type PerlinNoise1dParams,
} from "./perlin-noise-1d";
export {
  adCurve,
  defaultParams as adDefaultParams,
  type AdParams,
} from "./ad";
export {
  adsrCurve,
  defaultParams as adsrDefaultParams,
  type AdsrParams,
} from "./adsr";
export {
  arCurve,
  defaultParams as arDefaultParams,
  type ArParams,
} from "./ar";
export {
  asrCurve,
  defaultParams as asrDefaultParams,
  type AsrParams,
} from "./asr";
export {
  biquadCurve,
  defaultParams as biquadDefaultParams,
  type BiquadParams,
} from "./biquad";
export {
  catmullRomCurve,
  defaultParams as catmullRomDefaultParams,
  type CatmullRomParams,
} from "./catmull-rom";
export {
  chebyshevCurve,
  defaultParams as chebyshevDefaultParams,
  type ChebyshevParams,
} from "./chebyshev";
export {
  compressorCurve,
  defaultParams as compressorDefaultParams,
  type CompressorParams,
} from "./compressor";
export {
  cubicDistortionCurve,
  defaultParams as cubicDistortionDefaultParams,
  type CubicDistortionParams,
} from "./cubic-distortion";
export {
  dadsrCurve,
  defaultParams as dadsrDefaultParams,
  type DadsrParams,
} from "./dadsr";
export {
  domainWarpCurve,
  defaultParams as domainWarpDefaultParams,
  type DomainWarpParams,
} from "./domain-warp";
export {
  filmicCurve,
  defaultParams as filmicDefaultParams,
  type FilmicParams,
} from "./filmic";
export {
  fmFeedbackCurve,
  defaultParams as fmFeedbackDefaultParams,
  type FmFeedbackParams,
} from "./fm-feedback";
export {
  fresnelCurve,
  defaultParams as fresnelDefaultParams,
  type FresnelParams,
} from "./fresnel";
export {
  frictionCurve,
  defaultParams as frictionDefaultParams,
  type FrictionParams,
} from "./friction";
export {
  hermiteCurve,
  defaultParams as hermiteDefaultParams,
  type HermiteParams,
} from "./hermite";
export {
  hysteresisCurve,
  defaultParams as hysteresisDefaultParams,
  type HysteresisParams,
} from "./hysteresis";
export {
  inverseLerpCurve,
  defaultParams as inverseLerpDefaultParams,
  type InverseLerpParams,
} from "./inverse-lerp";
export {
  lfoShapesCurve,
  defaultParams as lfoShapesDefaultParams,
  type LfoShapesParams,
} from "./lfo-shapes";
export {
  logisticMapCurve,
  defaultParams as logisticMapDefaultParams,
  type LogisticMapParams,
} from "./logistic-map";
export {
  overshootSettleCurve,
  defaultParams as overshootSettleDefaultParams,
  type OvershootSettleParams,
} from "./overshoot-settle";
export {
  phaseDistortionCurve,
  defaultParams as phaseDistortionDefaultParams,
  type PhaseDistortionParams,
} from "./phase-distortion";
export {
  portamentoCurve,
  defaultParams as portamentoDefaultParams,
  type PortamentoParams,
} from "./portamento";
export {
  reinhardCurve,
  defaultParams as reinhardDefaultParams,
  type ReinhardParams,
} from "./reinhard";
export {
  remapCurve,
  defaultParams as remapDefaultParams,
  type RemapParams,
} from "./remap";
export {
  resonantFilterCurve,
  defaultParams as resonantFilterDefaultParams,
  type ResonantFilterParams,
} from "./resonant-filter";
export {
  rubberBandCurve,
  defaultParams as rubberBandDefaultParams,
  type RubberBandParams,
} from "./rubber-band";
export {
  sCurveContrastCurve,
  defaultParams as sCurveContrastDefaultParams,
  type SCurveContrastParams,
} from "./s-curve-contrast";
export {
  sdfBoxCurve,
  defaultParams as sdfBoxDefaultParams,
  type SdfBoxParams,
} from "./sdf-box";
export {
  sdfIntersectCurve,
  defaultParams as sdfIntersectDefaultParams,
  type SdfIntersectParams,
} from "./sdf-intersect";
export {
  sdfRoundBoxCurve,
  defaultParams as sdfRoundBoxDefaultParams,
  type SdfRoundBoxParams,
} from "./sdf-round-box";
export {
  sdfSphereCurve,
  defaultParams as sdfSphereDefaultParams,
  type SdfSphereParams,
} from "./sdf-sphere";
export {
  sdfSubtractCurve,
  defaultParams as sdfSubtractDefaultParams,
  type SdfSubtractParams,
} from "./sdf-subtract";
export {
  sdfTorusCurve,
  defaultParams as sdfTorusDefaultParams,
  type SdfTorusParams,
} from "./sdf-torus";
export {
  sdfUnionCurve,
  defaultParams as sdfUnionDefaultParams,
  type SdfUnionParams,
} from "./sdf-union";
export {
  smoothMaxCurve,
  defaultParams as smoothMaxDefaultParams,
  type SmoothMaxParams,
} from "./smooth-max";
export {
  smoothMinCurve,
  defaultParams as smoothMinDefaultParams,
  type SmoothMinParams,
} from "./smooth-min";
export {
  snapGridCurve,
  defaultParams as snapGridDefaultParams,
  type SnapGridParams,
} from "./snap-grid";
export {
  softClipCurve,
  defaultParams as softClipDefaultParams,
  type SoftClipParams,
} from "./soft-clip";
export {
  springCurve,
  defaultParams as springDefaultParams,
  type SpringParams,
} from "./spring";
export {
  stepsEasingCurve,
  defaultParams as stepsEasingDefaultParams,
  type StepsEasingParams,
} from "./steps-easing";
export {
  svfCurve,
  defaultParams as svfDefaultParams,
  type SvfParams,
} from "./svf";
export {
  voronoiJitterCurve,
  defaultParams as voronoiJitterDefaultParams,
  type VoronoiJitterParams,
} from "./voronoi-jitter";
export {
  wavefolderCurve,
  defaultParams as wavefolderDefaultParams,
  type WavefolderParams,
} from "./wavefolder";
export {
  worleyF2F1Curve,
  defaultParams as worleyF2F1DefaultParams,
  type WorleyF2F1Params,
} from "./worley-f2-f1";
