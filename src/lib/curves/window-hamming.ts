import {
  DEFAULT_SAMPLING,
  windowHammingKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type WindowHammingParams = typeof defaultParams;

export function windowHammingCurve(
  _params: WindowHammingParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = windowHammingKernel;
  return {
    id: "window-hamming",
    name: "Window Hamming",
    aliases: ["hamming window", "hamming raised cosine"],
    family: "window",
    summary: "Hamming window",
    formula: "y = 0.54 - 0.46 * cos(2*pi*x)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["window", "dsp", "spectral", "hamming"],
    useCases: ["spectral-analysis", "stft-windows", "dsp-filtering", "audio"],
    snippets: {
      equation: "y = 0.54 - 0.46 * cos(2*pi*x)",
      js: "function windowHamming(x) { return 0.54 - 0.46 * Math.cos(2 * Math.PI * x); }",
      glsl: "float windowHamming(float x) { return 0.54 - 0.46 * cos(2.0 * 3.14159265 * x); }",
      vex: "float windowHamming(float x) { return 0.54 - 0.46 * cos(2 * M_PI * x); }",
      ts: "function windowHamming(x: number): number { return 0.54 - 0.46 * Math.cos(2 * Math.PI * x); }",
      csharp: "float WindowHamming(float x) { return 0.54f - 0.46f * MathF.Cos(2.0f * MathF.PI * x); }",
      rust: "fn windowHamming(x: f64) -> f64 { 0.54 - 0.46 * (2.0 * std::f64::consts::PI * x).cos() }",
      hlsl: "float windowHamming(float x) { return 0.54 - 0.46 * cos(2.0 * 3.14159265 * x); }",
      wgsl: "fn windowHamming(x: f32) -> f32 { return 0.54 - 0.46 * cos(2.0 * 3.14159265 * x); }",
      python: "def windowHamming(x): return 0.54 - 0.46 * math.cos(2 * math.pi * x)",
      cpp: "float windowHamming(float x) { return 0.54f - 0.46f * std::cos(2.0f * M_PI * x); }",
      lua: "function windowHamming(x) return 0.54 - 0.46 * math.cos(2 * math.pi * x) end",
      gdscript: "func windowHamming(x: float) -> float: return 0.54 - 0.46 * cos(2.0 * PI * x)",
      cuda: "__device__ float windowHamming(float x) { return 0.54f - 0.46f * cosf(2.0f * 3.14159265f * x); }",
      c: "double windowHamming(double x) { return 0.54 - 0.46 * cos(2.0 * M_PI * x); }",
      json: "{\"name\": \"Window Hamming\", \"formula\": \"y = 0.54 - 0.46 * cos(2*PI*x)\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["window-hann", "window-triangle", "smoothstep", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => windowHammingCurve(params as WindowHammingParams),
    },
  };
}
