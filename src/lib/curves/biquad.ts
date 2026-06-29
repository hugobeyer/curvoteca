import { DEFAULT_SAMPLING, biquadKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { a0: 1, a1: 0, a2: 0, b1: 0, b2: 0 } as const;
export type BiquadParams = { a0: number; a1: number; a2: number; b1: number; b2: number };

export function biquadCurve(
  params: BiquadParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = biquadKernel(params.a0, params.a1, params.a2, params.b1, params.b2);
  return {
    id: "biquad",
    name: "Biquad Filter",
    aliases: [],
    family: "dsp",
    summary: "Biquad filter frequency response",
    formula: "y = |H(e^(jω))| of biquad transfer function",
    continuity: "C3+",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["dsp", "filter", "biquad", "audio", "coefficients"],
    useCases: [
      "audio-filtering",
      "dsp-coefficients",
      "filter-design",
      "equalization",
    ],
    snippets: {
      equation: "y = |H(e^(jω))| of biquad transfer function",
      js: "function biquad(x, a0, a1, a2, b1, b2) { a0 = a0 == null ? 1 : a0; a1 = a1 == null ? 0 : a1; a2 = a2 == null ? 0 : a2; b1 = b1 == null ? 0 : b1; b2 = b2 == null ? 0 : b2; var w = Math.PI * x; var c = Math.cos(w); var s = Math.sin(w); var num = a0 + a1 * c + a2 * Math.cos(2 * w); var den = 1 + b1 * c + b2 * Math.cos(2 * w); return Math.sqrt((num * num) / (den * den)); }",
      ts: "function biquad(x: number, a0: number = 1, a1: number = 0, a2: number = 0, b1: number = 0, b2: number = 0): number { const w = Math.PI * x; const c = Math.cos(w); const num = a0 + a1 * c + a2 * Math.cos(2 * w); const den = 1 + b1 * c + b2 * Math.cos(2 * w); return Math.sqrt((num * num) / (den * den)); }",
      glsl: "float biquad(float x, float a0, float a1, float a2, float b1, float b2) { a0 = (a0 == 0.0) ? 1.0 : a0; float w = 3.14159265 * x; float c = cos(w); float num = a0 + a1 * c + a2 * cos(2.0 * w); float den = 1.0 + b1 * c + b2 * cos(2.0 * w); return sqrt((num * num) / (den * den)); }",
      vex: "float biquad(float x; float a0; float a1; float a2; float b1; float b2) { if (a0 == 0) a0 = 1; float w = M_PI * x; float c = cos(w); float num = a0 + a1 * c + a2 * cos(2 * w); float den = 1 + b1 * c + b2 * cos(2 * w); return sqrt((num * num) / (den * den)); }",
      csharp: "float Biquad(float x, float a0 = 1, float a1 = 0, float a2 = 0, float b1 = 0, float b2 = 0) { float w = MathF.PI * x; float c = MathF.Cos(w); float num = a0 + a1 * c + a2 * MathF.Cos(2 * w); float den = 1 + b1 * c + b2 * MathF.Cos(2 * w); return MathF.Sqrt((num * num) / (den * den)); }",
      rust: "fn biquad(x: f64, a0: f64, a1: f64, a2: f64, b1: f64, b2: f64) -> f64 { let a0 = if a0 == 0.0 { 1.0 } else { a0 }; let w = std::f64::consts::PI * x; let c = w.cos(); let num = a0 + a1 * c + a2 * (2.0 * w).cos(); let den = 1.0 + b1 * c + b2 * (2.0 * w).cos(); ((num * num) / (den * den)).sqrt() }",
      hlsl: "float biquad(float x, float a0, float a1, float a2, float b1, float b2) { a0 = (a0 == 0.0) ? 1.0 : a0; float w = 3.14159265 * x; float c = cos(w); float num = a0 + a1 * c + a2 * cos(2.0 * w); float den = 1.0 + b1 * c + b2 * cos(2.0 * w); return sqrt((num * num) / (den * den)); }",
      wgsl: "fn biquad(x: f32, a0: f32, a1: f32, a2: f32, b1: f32, b2: f32) -> f32 { let a0 = select(1.0, a0, a0 != 0.0); let w = 3.14159265 * x; let c = cos(w); let num = a0 + a1 * c + a2 * cos(2.0 * w); let den = 1.0 + b1 * c + b2 * cos(2.0 * w); return sqrt((num * num) / (den * den)); }",
      python: "def biquad(x, a0=1, a1=0, a2=0, b1=0, b2=0): a0 = a0 or 1; w = math.pi * x; c = math.cos(w); num = a0 + a1 * c + a2 * math.cos(2 * w); den = 1 + b1 * c + b2 * math.cos(2 * w); return math.sqrt((num * num) / (den * den))",
      cpp: "float biquad(float x, float a0 = 1.0f, float a1 = 0.0f, float a2 = 0.0f, float b1 = 0.0f, float b2 = 0.0f) { float w = std::numbers::pi * x; float c = std::cos(w); float num = a0 + a1 * c + a2 * std::cos(2.0f * w); float den = 1.0f + b1 * c + b2 * std::cos(2.0f * w); return std::sqrt((num * num) / (den * den)); }",
      lua: "function biquad(x, a0, a1, a2, b1, b2) a0 = a0 or 1 a1 = a1 or 0 a2 = a2 or 0 b1 = b1 or 0 b2 = b2 or 0 local w = math.pi * x local c = math.cos(w) local num = a0 + a1 * c + a2 * math.cos(2 * w) local den = 1 + b1 * c + b2 * math.cos(2 * w) return math.sqrt((num * num) / (den * den)) end",
      gdscript: "func biquad(x: float, a0: float = 1.0, a1: float = 0.0, a2: float = 0.0, b1: float = 0.0, b2: float = 0.0) -> float: var w = PI * x; var c = cos(w); var num = a0 + a1 * c + a2 * cos(2 * w); var den = 1 + b1 * c + b2 * cos(2 * w); return sqrt((num * num) / (den * den))",
      cuda: "__device__ float biquad(float x, float a0, float a1, float a2, float b1, float b2) { float w = 3.14159265f * x; float c = cosf(w); float num = a0 + a1 * c + a2 * cosf(2.0f * w); float den = 1.0f + b1 * c + b2 * cosf(2.0f * w); return sqrtf((num * num) / (den * den)); }",
      c: "double biquad(double x, double a0, double a1, double a2, double b1, double b2) { double w = M_PI * x; double c = cos(w); double num = a0 + a1 * c + a2 * cos(2.0 * w); double den = 1.0 + b1 * c + b2 * cos(2.0 * w); return sqrt((num * num) / (den * den)); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["resonant-filter", "svf", "compressor"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => biquadCurve(p as BiquadParams),
    },
  };
}
