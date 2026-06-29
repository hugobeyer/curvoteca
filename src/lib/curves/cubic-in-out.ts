import { DEFAULT_SAMPLING, cubicInOutKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CubicInOutParams = typeof defaultParams;

export function cubicInOutCurve(
  _params: CubicInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cubicInOutKernel;
  return {
    id: "cubic-in-out",
    name: "Cubic In Out",
    aliases: ["easeInOutCubic", "ease-in-out-cubic", "cube in out"],
    family: "easing",
    summary: "Cubic ease-in-out",
    formula: "y = 4x^3 if x < 0.5 else 1 - (-2x + 2)^3 / 2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in-out", "cubic", "css"],
    useCases: ["ui-animation", "ease-in-out", "symmetric-motion"],

    snippets: {
      equation: "y = 4x^3 if x < 0.5 else 1 - (-2x + 2)^3 / 2",
      js: "function cubicInOut(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }",
      glsl: "float cubicInOut(float x) { return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0; }",
      vex: "float cubicInOut(float x) { return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2; }",
      ts: "function cubicInOut(x: number): number { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }",
      csharp: "float CubicInOut(float x) { return x < 0.5f ? 4.0f * x * x * x : 1.0f - MathF.Pow(-2.0f * x + 2.0f, 3.0f) / 2.0f; }",
      rust: "fn cubic_in_out(x: f64) -> f64 { if x < 0.5 { 4.0 * x * x * x } else { 1.0 - (-2.0 * x + 2.0).powi(3) / 2.0 } }",
      hlsl: "float cubicInOut(float x) { return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0; }",
      wgsl: "fn cubicInOut(x: f32) -> f32 { return select(1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0, 4.0 * x * x * x, x < 0.5); }",
      python: "def cubic_in_out(x): return 4 * x * x * x if x < 0.5 else 1 - math.pow(-2 * x + 2, 3) / 2",
      css: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      cpp: "#include <cmath>\nfloat cubicInOut(float x) { return x < 0.5f ? 4.0f * x * x * x : 1.0f - std::pow(-2.0f * x + 2.0f, 3.0f) / 2.0f; }",
      lua: "function cubicInOut(x) return x < 0.5 and 4 * x * x * x or 1 - (-2 * x + 2) ^ 3 / 2 end",
      gdscript: "func cubic_in_out(x: float) -> float: return 4.0 * x * x * x if x < 0.5 else 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0",
      cuda: "__device__ float cubicInOut(float x) { return x < 0.5f ? 4.0f * x * x * x : 1.0f - powf(-2.0f * x + 2.0f, 3.0f) / 2.0f; }",
      c: "#include <math.h>\ndouble cubicInOut(double x) { return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0; }",
      json: '{"name": "Cubic In Out", "formula": "y = 4x^3 if x < 0.5 else 1 - (-2x + 2)^3 / 2", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["cubic-in", "cubic-out", "quadratic-in-out", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cubicInOutCurve(params as CubicInOutParams),
    },
  };
}
