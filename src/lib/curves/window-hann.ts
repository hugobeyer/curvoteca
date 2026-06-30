import {
  DEFAULT_SAMPLING,
  windowHannKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type WindowHannParams = typeof defaultParams;

export function windowHannCurve(
  _params: WindowHannParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = windowHannKernel;
  return {
    id: "window-hann",
    name: "Window Hann",
    aliases: ["hann window", "raised cosine", "von hann"],
    family: "window",
    summary: "Raised cosine window",
    formula: "y = 0.5 - 0.5 * cos(2*pi*x)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["window", "dsp", "spectral", "raised-cosine"],
    useCases: ["spectral-analysis", "stft-windows", "dsp-filtering", "audio"],
    snippets: {
      equation: "y = 0.5 - 0.5 * cos(2*pi*x)",
      js: "function windowHann(x) { return 0.5 - 0.5 * Math.cos(2 * Math.PI * x); }",
      glsl: "float windowHann(float x) { return 0.5 - 0.5 * cos(2.0 * 3.14159265 * x); }",
      vex: "float windowHann(float x) { return 0.5 - 0.5 * cos(2 * M_PI * x); }",
      ts: "function windowHann(x: number): number { return 0.5 - 0.5 * Math.cos(2 * Math.PI * x); }",
      csharp:
        "float WindowHann(float x) { return 0.5f - 0.5f * MathF.Cos(2.0f * MathF.PI * x); }",
      rust: "fn windowHann(x: f64) -> f64 { 0.5 - 0.5 * (2.0 * std::f64::consts::PI * x).cos() }",
      hlsl: "float windowHann(float x) { return 0.5 - 0.5 * cos(2.0 * 3.14159265 * x); }",
      wgsl: "fn windowHann(x: f32) -> f32 { return 0.5 - 0.5 * cos(2.0 * 3.14159265 * x); }",
      python: "def windowHann(x): return 0.5 - 0.5 * math.cos(2 * math.pi * x)",
      cpp: "float windowHann(float x) { return 0.5f - 0.5f * std::cos(2.0f * M_PI * x); }",
      lua: "function windowHann(x) return 0.5 - 0.5 * math.cos(2 * math.pi * x) end",
      gdscript:
        "func windowHann(x: float) -> float: return 0.5 - 0.5 * cos(2.0 * PI * x)",
      cuda: "__device__ float windowHann(float x) { return 0.5f - 0.5f * cosf(2.0f * 3.14159265f * x); }",
      c: "double windowHann(double x) { return 0.5 - 0.5 * cos(2.0 * M_PI * x); }",
      json: '{"name": "Window Hann", "formula": "y = 0.5 - 0.5 * cos(2*PI*x)", "params": {}}',
      metal:
        "float windowHann(float x) { return 0.5 - 0.5 * cos(2.0 * 3.14159265 * x); }",
      opencl:
        "float windowHann(float x) { return 0.5f - 0.5f * cosf(2.0f * 3.14159265f * x); }",
      unity:
        "public static float WindowHann(float x) { return 0.5f - 0.5f * Mathf.Cos(2.0f * Mathf.PI * x); }",
      matlab: "y = @(x) 0.5 - 0.5 * cos(2 * pi * x);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["window-hamming", "window-triangle", "smoothstep", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => windowHannCurve(params as WindowHannParams),
    },
  };
}
