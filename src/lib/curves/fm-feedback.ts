import {
  DEFAULT_SAMPLING,
  fmFeedbackKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  modIndex: 1,
  modFreq: 3,
  carrierFreq: 5,
} as const;
export type FmFeedbackParams = {
  modIndex: number;
  modFreq: number;
  carrierFreq: number;
};

export function fmFeedbackCurve(
  params: FmFeedbackParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = fmFeedbackKernel(
    params.modIndex,
    params.modFreq,
    params.carrierFreq,
  );
  return {
    id: "fm-feedback",
    name: "FM Feedback Modulator",
    family: "oscillator",
    summary: "Frequency modulation synthesis waveform",
    formula: "y = sin(2π*fc*t + mi * sin(2π*fm*t))",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["audio", "fm", "synthesis", "modulation", "frequency-modulation"],
    useCases: [
      "fm-synthesis",
      "audio-modulation",
      "sound-design",
      "frequency-modulation",
    ],
    snippets: {
      equation: "y = sin(2π*fc*t + mi * sin(2π*fm*t))",
      js: "function fmFeedback(x, mi, fm, fc) { mi = mi == null ? 1 : mi; fm = fm == null ? 3 : fm; fc = fc == null ? 5 : fc; return Math.sin(2 * Math.PI * fc * x + mi * Math.sin(2 * Math.PI * fm * x)); }",
      ts: "function fmFeedback(x: number, mi: number = 1, fm: number = 3, fc: number = 5): number { return Math.sin(2 * Math.PI * fc * x + mi * Math.sin(2 * Math.PI * fm * x)); }",
      glsl: "float fmFeedback(float x, float mi, float fm, float fc) { mi = (mi == 0.0) ? 1.0 : mi; fm = (fm == 0.0) ? 3.0 : fm; fc = (fc == 0.0) ? 5.0 : fc; return sin(2.0 * 3.14159265 * fc * x + mi * sin(2.0 * 3.14159265 * fm * x)); }",
      vex: "float fmFeedback(float x; float mi; float fm; float fc) { if (mi == 0) mi = 1; if (fm == 0) fm = 3; if (fc == 0) fc = 5; return sin(2 * M_PI * fc * x + mi * sin(2 * M_PI * fm * x)); }",
      csharp:
        "float FmFeedback(float x, float mi = 1, float fm = 3, float fc = 5) { return MathF.Sin(2 * MathF.PI * fc * x + mi * MathF.Sin(2 * MathF.PI * fm * x)); }",
      rust: "fn fm_feedback(x: f64, mi: f64, fm: f64, fc: f64) -> f64 { let mi = if mi == 0.0 { 1.0 } else { mi }; let fm = if fm == 0.0 { 3.0 } else { fm }; let fc = if fc == 0.0 { 5.0 } else { fc }; (2.0 * std::f64::consts::PI * fc * x + mi * (2.0 * std::f64::consts::PI * fm * x).sin()).sin() }",
      hlsl: "float fmFeedback(float x, float mi, float fm, float fc) { mi = (mi == 0.0) ? 1.0 : mi; fm = (fm == 0.0) ? 3.0 : fm; fc = (fc == 0.0) ? 5.0 : fc; return sin(2.0 * 3.14159265 * fc * x + mi * sin(2.0 * 3.14159265 * fm * x)); }",
      wgsl: "fn fm_feedback(x: f32, mi: f32, fm: f32, fc: f32) -> f32 { let mi = select(1.0, mi, mi != 0.0); let fm = select(3.0, fm, fm != 0.0); let fc = select(5.0, fc, fc != 0.0); return sin(2.0 * 3.14159265 * fc * x + mi * sin(2.0 * 3.14159265 * fm * x)); }",
      python:
        "def fm_feedback(x, mi=1, fm=3, fc=5): return math.sin(2 * math.pi * fc * x + mi * math.sin(2 * math.pi * fm * x))",
      cpp: "float fmFeedback(float x, float mi = 1.0f, float fm = 3.0f, float fc = 5.0f) { return std::sin(2 * M_PI * fc * x + mi * std::sin(2 * M_PI * fm * x)); }",
      lua: "function fmFeedback(x, mi, fm, fc) mi = mi or 1; fm = fm or 3; fc = fc or 5; return math.sin(2 * math.pi * fc * x + mi * math.sin(2 * math.pi * fm * x)) end",
      gdscript:
        "func fm_feedback(x: float, mi: float = 1.0, fm: float = 3.0, fc: float = 5.0) -> float: return sin(2 * PI * fc * x + mi * sin(2 * PI * fm * x))",
      cuda: "__device__ float fmFeedback(float x, float mi, float fm, float fc) { return sinf(2.0f * 3.14159265f * fc * x + mi * sinf(2.0f * 3.14159265f * fm * x)); }",
      c: "double fm_feedback(double x, double mi, double fm, double fc) { return sin(2 * M_PI * fc * x + mi * sin(2 * M_PI * fm * x)); }",
      metal:
        "float fmFeedback(float x, float mi, float fm, float fc) { mi = (mi == 0.0) ? 1.0 : mi; fm = (fm == 0.0) ? 3.0 : fm; fc = (fc == 0.0) ? 5.0 : fc; return sin(2.0 * 1.57079633 * fc * x + mi * sin(2.0 * 1.57079633 * fm * x)); }",
      opencl:
        "float fmFeedback(float x, float mi, float fm, float fc) { mi = (mi == 0.0f) ? 1.0f : mi; fm = (fm == 0.0f) ? 3.0f : fm; fc = (fc == 0.0f) ? 5.0f : fc; return sin(2.0f * 1.57079633f * fc * x + mi * sin(2.0f * 1.57079633f * fm * x)); }",
      unity:
        "public static float FmFeedback(float x, float mi, float fm, float fc) { return Mathf.Sin(2.0f * Mathf.PI * fc * x + mi * Mathf.Sin(2.0f * Mathf.PI * fm * x)); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["phase-distortion", "lfo-shapes", "chebyshev"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => fmFeedbackCurve(p as FmFeedbackParams),
    },
  };
}
