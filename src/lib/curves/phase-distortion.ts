import {
  DEFAULT_SAMPLING,
  phaseDistortionKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { distortion: 0.5, asymmetry: 0 } as const;
export type PhaseDistortionParams = {
  distortion: number;
  asymmetry: number;
};

export function phaseDistortionCurve(
  params: PhaseDistortionParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = phaseDistortionKernel(
    params.distortion,
    params.asymmetry,
  );
  return {
    id: "phase-distortion",
    name: "Phase Distortion",
    family: "oscillator",
    summary: "Phase-distorted cosine waveform",
    formula: "y = cos(2π * (t + d * sin(2π*t*(1+a))))",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["audio", "phase-distortion", "synthesis", "casio", "waveshaping"],
    useCases: [
      "phase-distortion-synthesis",
      "audio-waveshaping",
      "casio-emulation",
      "sound-design",
    ],
    snippets: {
      equation: "y = cos(2π * (t + d * sin(2π*t*(1+a))))",
      js: "function phaseDistortion(x, d, a) { d = d == null ? 0.5 : d; a = a == null ? 0 : a; return Math.cos(2 * Math.PI * (x + d * Math.sin(2 * Math.PI * x * (1 + a)))); }",
      ts: "function phaseDistortion(x: number, d: number = 0.5, a: number = 0): number { return Math.cos(2 * Math.PI * (x + d * Math.sin(2 * Math.PI * x * (1 + a)))); }",
      glsl: "float phaseDistortion(float x, float d, float a) { d = (d == 0.0) ? 0.5 : d; a = (a == 0.0) ? 0.0 : a; return cos(2.0 * 3.14159265 * (x + d * sin(2.0 * 3.14159265 * x * (1.0 + a)))); }",
      vex: "float phaseDistortion(float x; float d; float a) { if (d == 0) d = 0.5; return cos(2 * M_PI * (x + d * sin(2 * M_PI * x * (1 + a)))); }",
      csharp: "float PhaseDistortion(float x, float d = 0.5f, float a = 0) { return MathF.Cos(2 * MathF.PI * (x + d * MathF.Sin(2 * MathF.PI * x * (1 + a)))); }",
      rust: "fn phase_distortion(x: f64, d: f64, a: f64) -> f64 { let d = if d == 0.0 { 0.5 } else { d }; (2.0 * std::f64::consts::PI * (x + d * (2.0 * std::f64::consts::PI * x * (1.0 + a)).sin())).cos() }",
      hlsl: "float phaseDistortion(float x, float d, float a) { d = (d == 0.0) ? 0.5 : d; a = (a == 0.0) ? 0.0 : a; return cos(2.0 * 3.14159265 * (x + d * sin(2.0 * 3.14159265 * x * (1.0 + a)))); }",
      wgsl: "fn phase_distortion(x: f32, d: f32, a: f32) -> f32 { let d = select(0.5, d, d != 0.0); let a = select(0.0, a, a != 0.0); return cos(2.0 * 3.14159265 * (x + d * sin(2.0 * 3.14159265 * x * (1.0 + a)))); }",
      python: "def phase_distortion(x, d=0.5, a=0): return math.cos(2 * math.pi * (x + d * math.sin(2 * math.pi * x * (1 + a))))",
      cpp: "float phaseDistortion(float x, float d = 0.5f, float a = 0.0f) { return std::cos(2.0f * M_PI * (x + d * std::sin(2.0f * M_PI * x * (1.0f + a)))); }",
      lua: "function phaseDistortion(x, d, a) d = d or 0.5; a = a or 0; return math.cos(2 * math.pi * (x + d * math.sin(2 * math.pi * x * (1 + a)))) end",
      gdscript: "func phaseDistortion(x: float, d: float = 0.5, a: float = 0.0) -> float: return cos(2 * PI * (x + d * sin(2 * PI * x * (1 + a))))",
      cuda: "__device__ float phaseDistortion(float x, float d, float a) { return cosf(2.0f * 3.14159265f * (x + d * sinf(2.0f * 3.14159265f * x * (1.0f + a)))); }",
      c: "#include <math.h>\ndouble phaseDistortion(double x, double d, double a) { return cos(2.0 * M_PI * (x + d * sin(2.0 * M_PI * x * (1.0 + a)))); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fm-feedback", "wavefolder", "chebyshev"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => phaseDistortionCurve(p as PhaseDistortionParams),
    },
  };
}
