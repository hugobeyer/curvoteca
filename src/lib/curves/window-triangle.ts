import {
  DEFAULT_SAMPLING,
  windowTriangleKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type WindowTriangleParams = typeof defaultParams;

export function windowTriangleCurve(
  _params: WindowTriangleParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = windowTriangleKernel;
  return {
    id: "window-triangle",
    name: "Window Triangle",
    aliases: ["triangular window", "bartlett window", "tri window"],
    family: "window",
    summary: "Triangular window",
    formula: "y = 1 - |2x - 1|",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["window", "dsp", "spectral", "triangular"],
    useCases: ["spectral-analysis", "stft-windows", "dsp-filtering", "audio"],
    snippets: {
      equation: "y = 1 - |2x - 1|",
      js: "function windowTriangle(x) { return 1 - Math.abs(2 * x - 1); }",
      glsl: "float windowTriangle(float x) { return 1.0 - abs(2.0 * x - 1.0); }",
      vex: "float windowTriangle(float x) { return 1 - abs(2 * x - 1); }",
      ts: "function windowTriangle(x: number): number { return 1 - Math.abs(2 * x - 1); }",
      csharp: "float WindowTriangle(float x) { return 1.0f - MathF.Abs(2.0f * x - 1.0f); }",
      rust: "fn windowTriangle(x: f64) -> f64 { 1.0 - (2.0 * x - 1.0).abs() }",
      hlsl: "float windowTriangle(float x) { return 1.0 - abs(2.0 * x - 1.0); }",
      wgsl: "fn windowTriangle(x: f32) -> f32 { return 1.0 - abs(2.0 * x - 1.0); }",
      python: "def windowTriangle(x): return 1 - abs(2 * x - 1)",
      cpp: "float windowTriangle(float x) { return 1.0f - std::abs(2.0f * x - 1.0f); }",
      lua: "function windowTriangle(x) return 1 - math.abs(2 * x - 1) end",
      gdscript: "func windowTriangle(x: float) -> float: return 1.0 - abs(2.0 * x - 1.0)",
      cuda: "__device__ float windowTriangle(float x) { return 1.0f - fabsf(2.0f * x - 1.0f); }",
      c: "double windowTriangle(double x) { return 1.0 - fabs(2.0 * x - 1.0); }",
      json: "{\"name\": \"Window Triangle\", \"formula\": \"y = 1 - |2x - 1|\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["window-hann", "window-hamming", "triangle-wave", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => windowTriangleCurve(params as WindowTriangleParams),
    },
  };
}
