import {
  DEFAULT_SAMPLING,
  cubicDistortionKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { drive: 1 } as const;
export type CubicDistortionParams = { drive: number };

export function cubicDistortionCurve(
  params: CubicDistortionParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cubicDistortionKernel(params.drive);
  return {
    id: "cubic-distortion",
    name: "Cubic Distortion",
    aliases: [],
    family: "distortion",
    summary: "Cubic waveshaping distortion",
    formula: "y = t - drive * t^3 / 3",
    continuity: "C3+",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["audio", "distortion", "cubic", "waveshaping", "harmonics"],
    useCases: [
      "audio-distortion",
      "harmonic-generation",
      "guitar-pedal-emulation",
      "waveshaping",
    ],
    snippets: {
      equation: "y = t - drive * t^3 / 3",
      js: "function cubicDistortion(x, drive) { drive = drive == null ? 1 : drive; return x - drive * x * x * x / 3; }",
      ts: "function cubicDistortion(x: number, drive: number = 1): number { return x - drive * x * x * x / 3; }",
      glsl: "float cubicDistortion(float x, float drive) { drive = (drive == 0.0) ? 1.0 : drive; return x - drive * x * x * x / 3.0; }",
      vex: "float cubicDistortion(float x; float drive) { if (drive == 0) drive = 1; return x - drive * x * x * x / 3; }",
      csharp: "float CubicDistortion(float x, float drive = 1) { return x - drive * x * x * x / 3; }",
      rust: "fn cubic_distortion(x: f64, drive: f64) -> f64 { let drive = if drive == 0.0 { 1.0 } else { drive }; x - drive * x.powi(3) / 3.0 }",
      hlsl: "float cubicDistortion(float x, float drive) { drive = (drive == 0.0) ? 1.0 : drive; return x - drive * x * x * x / 3.0; }",
      wgsl: "fn cubic_distortion(x: f32, drive: f32) -> f32 { let drive = select(1.0, drive, drive != 0.0); return x - drive * x * x * x / 3.0; }",
      python: "def cubic_distortion(x, drive=1): drive = drive or 1; return x - drive * x ** 3 / 3",
      cpp: "float cubicDistortion(float x, float drive = 1.0f) { return x - drive * x * x * x / 3.0f; }",
      lua: "function cubicDistortion(x, drive) drive = drive or 1; return x - drive * x * x * x / 3 end",
      gdscript: "func cubic_distortion(x: float, drive: float = 1.0) -> float: return x - drive * x * x * x / 3.0",
      cuda: "__device__ float cubicDistortion(float x, float drive) { return x - drive * x * x * x / 3.0f; }",
      c: "double cubicDistortion(double x, double drive) { return x - drive * x * x * x / 3.0; }",
      json: '{"name": "Cubic Distortion", "formula": "y = t - drive * t^3 / 3", "params": {"drive": 1}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["soft-clip", "wavefolder", "chebyshev"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => cubicDistortionCurve(p as CubicDistortionParams),
    },
  };
}
