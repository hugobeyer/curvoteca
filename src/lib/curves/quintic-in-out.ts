import { DEFAULT_SAMPLING, quinticInOutKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuinticInOutParams = typeof defaultParams;

export function quinticInOutCurve(
  _params: QuinticInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quinticInOutKernel;
  return {
    id: "quintic-in-out",
    name: "Quintic In Out",
    aliases: ["easeInOutQuint", "ease-in-out-quint", "quintic ease in out"],
    family: "easing",
    summary: "Quintic ease-in-out",
    formula: "y = 16x^5 if x < 0.5 else 1 - (-2x + 2)^5 / 2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in-out", "quintic", "css"],
    useCases: ["ui-animation", "ease-in-out", "symmetric-motion"],

    snippets: {
      equation: "y = 16x^5 if x < 0.5 else 1 - (-2x + 2)^5 / 2",
      js: "function quinticInOut(x) { return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2; }",
      glsl: "float quinticInOut(float x) { return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0; }",
      vex: "float quinticInOut(float x) { return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2; }",
      ts: "function quinticInOut(x: number): number { return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2; }",
      csharp: "float QuinticInOut(float x) { return x < 0.5f ? 16.0f * x * x * x * x * x : 1.0f - MathF.Pow(-2.0f * x + 2.0f, 5.0f) / 2.0f; }",
      rust: "fn quintic_in_out(x: f64) -> f64 { if x < 0.5 { 16.0 * x * x * x * x * x } else { 1.0 - (-2.0 * x + 2.0).powi(5) / 2.0 } }",
      hlsl: "float quinticInOut(float x) { return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0; }",
      wgsl: "fn quinticInOut(x: f32) -> f32 { return select(1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0, 16.0 * x * x * x * x * x, x < 0.5); }",
      python: "def quintic_in_out(x): return 16 * x * x * x * x * x if x < 0.5 else 1 - math.pow(-2 * x + 2, 5) / 2",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float quinticInOut(float x) { return x < 0.5f ? 16.0f * x * x * x * x * x : 1.0f - std::pow(-2.0f * x + 2.0f, 5.0f) / 2.0f; }",
      lua: "function quinticInOut(x) return x < 0.5 and 16 * x * x * x * x * x or 1 - math.pow(-2 * x + 2, 5) / 2 end",
      gdscript: "func quinticInOut(x: float) -> float: return 16 * x * x * x * x * x if x < 0.5 else 1 - pow(-2 * x + 2, 5) / 2",
      cuda: "__device__ float quinticInOut(float x) { return x < 0.5f ? 16.0f * x * x * x * x * x : 1.0f - powf(-2.0f * x + 2.0f, 5.0f) / 2.0f; }",
      c: "#include <math.h>\ndouble quinticInOut(double x) { return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0; }",
      json: "{\"name\": \"Quintic In Out\", \"formula\": \"y = 16x^5 if x < 0.5 else 1 - (-2x + 2)^5 / 2\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quintic-in", "quintic-out", "quartic-in-out", "exponential-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quinticInOutCurve(params as QuinticInOutParams),
    },
  };
}
