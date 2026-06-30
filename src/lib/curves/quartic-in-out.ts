import {
  DEFAULT_SAMPLING,
  quarticInOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuarticInOutParams = typeof defaultParams;

export function quarticInOutCurve(
  _params: QuarticInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quarticInOutKernel;
  return {
    id: "quartic-in-out",
    name: "Quartic In Out",
    aliases: ["easeInOutQuart", "ease-in-out-quart", "quartic ease in out"],
    family: "easing",
    summary: "Quartic ease-in-out",
    formula: "y = 8x^4 if x < 0.5 else 1 - (-2x + 2)^4 / 2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in-out", "quartic", "css"],
    useCases: ["ui-animation", "ease-in-out", "symmetric-motion"],

    snippets: {
      equation: "y = 8x^4 if x < 0.5 else 1 - (-2x + 2)^4 / 2",
      js: "function quarticInOut(x) { return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; }",
      glsl: "float quarticInOut(float x) { return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0; }",
      vex: "float quarticInOut(float x) { return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2; }",
      ts: "function quarticInOut(x: number): number { return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; }",
      csharp:
        "float QuarticInOut(float x) { return x < 0.5f ? 8.0f * x * x * x * x : 1.0f - MathF.Pow(-2.0f * x + 2.0f, 4.0f) / 2.0f; }",
      rust: "fn quartic_in_out(x: f64) -> f64 { if x < 0.5 { 8.0 * x * x * x * x } else { 1.0 - (-2.0 * x + 2.0).powi(4) / 2.0 } }",
      hlsl: "float quarticInOut(float x) { return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0; }",
      wgsl: "fn quarticInOut(x: f32) -> f32 { return select(1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0, 8.0 * x * x * x * x, x < 0.5); }",
      python:
        "def quartic_in_out(x): return 8 * x * x * x * x if x < 0.5 else 1 - math.pow(-2 * x + 2, 4) / 2",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float quarticInOut(float x) { return x < 0.5f ? 8.0f * x * x * x * x : 1.0f - std::pow(-2.0f * x + 2.0f, 4.0f) / 2.0f; }",
      lua: "function quarticInOut(x) return x < 0.5 and 8 * x * x * x * x or 1 - math.pow(-2 * x + 2, 4) / 2 end",
      gdscript:
        "func quarticInOut(x: float) -> float: return 8 * x * x * x * x if x < 0.5 else 1 - pow(-2 * x + 2, 4) / 2",
      cuda: "__device__ float quarticInOut(float x) { return x < 0.5f ? 8.0f * x * x * x * x : 1.0f - powf(-2.0f * x + 2.0f, 4.0f) / 2.0f; }",
      c: "#include <math.h>\ndouble quarticInOut(double x) { return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0; }",
      json: '{"name": "Quartic In Out", "formula": "y = 8x^4 if x < 0.5 else 1 - (-2x + 2)^4 / 2", "params": {}}',
      metal:
        "float quarticInOut(float x) { return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0; }",
      opencl:
        "float quarticInOut(float x) { return x < 0.5f ? 8.0f * x * x * x * x : 1.0f - pow(-2.0f * x + 2.0f, 4.0f) / 2.0f; }",
      unity:
        "public static float QuarticInOut(float x) { return x < 0.5f ? 8.0f * x * x * x * x : 1.0f - Mathf.Pow(-2.0f * x + 2.0f, 4.0f) / 2.0f; }",
      shadertoy:
        "return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0;",
      svelte:
        "export const quarticInOut = (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;",
      matlab:
        "y = @(x) x^4 * 8 * (x < 0.5) + (1 - (-2*x + 2)^4 / 2) * (x >= 0.5);",
      excel: "=IF(A1<0.5, 8*A1^4, 1-(-2*A1+2)^4/2)",
      desmos:
        "y = \\left\\{x < 0.5: 8 x^{4}, x \\geq 0.5: 1 - \\left(-2 x + 2\\right)^{4} / 2\\right\\}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quartic-in", "quartic-out", "cubic-in-out", "quintic-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quarticInOutCurve(params as QuarticInOutParams),
    },
  };
}
