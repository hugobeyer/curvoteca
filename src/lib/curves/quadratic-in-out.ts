import {
  DEFAULT_SAMPLING,
  quadraticInOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuadraticInOutParams = typeof defaultParams;

export function quadraticInOutCurve(
  _params: QuadraticInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quadraticInOutKernel;
  return {
    id: "quadratic-in-out",
    name: "Quadratic In Out",
    aliases: ["easeInOutQuad", "ease-in-out-quad", "quad in out"],
    family: "easing",
    summary: "Quadratic ease-in-out",
    formula: "y = 2x^2 if x < 0.5 else 1 - (-2x + 2)^2 / 2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in-out", "quadratic", "css"],
    useCases: ["ui-animation", "ease-in-out", "symmetric-motion"],

    snippets: {
      equation: "y = 2x^2 if x < 0.5 else 1 - (-2x + 2)^2 / 2",
      js: "function quadraticInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }",
      glsl: "float quadraticInOut(float x) { return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0; }",
      vex: "float quadraticInOut(float x) { return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2; }",
      ts: "function quadraticInOut(x: number): number { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }",
      csharp:
        "float QuadraticInOut(float x) { return x < 0.5 ? 2.0f * x * x : 1.0f - MathF.Pow(-2.0f * x + 2.0f, 2.0f) / 2.0f; }",
      rust: "fn quadratic_in_out(x: f64) -> f64 { if x < 0.5 { 2.0 * x * x } else { 1.0 - (-2.0 * x + 2.0).powi(2) / 2.0 } }",
      hlsl: "float quadraticInOut(float x) { return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0; }",
      wgsl: "fn quadraticInOut(x: f32) -> f32 { return select(1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0, 2.0 * x * x, x < 0.5); }",
      python:
        "def quadratic_in_out(x): return 2 * x * x if x < 0.5 else 1 - math.pow(-2 * x + 2, 2) / 2",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float quadraticInOut(float x) { return x < 0.5f ? 2.0f * x * x : 1.0f - std::pow(-2.0f * x + 2.0f, 2.0f) / 2.0f; }",
      lua: "function quadraticInOut(x) return x < 0.5 and 2 * x * x or 1 - math.pow(-2 * x + 2, 2) / 2 end",
      gdscript:
        "func quadraticInOut(x: float) -> float: return 2 * x * x if x < 0.5 else 1 - pow(-2 * x + 2, 2) / 2",
      cuda: "__device__ float quadraticInOut(float x) { return x < 0.5f ? 2.0f * x * x : 1.0f - powf(-2.0f * x + 2.0f, 2.0f) / 2.0f; }",
      c: "#include <math.h>\ndouble quadraticInOut(double x) { return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0; }",
      json: '{"name": "Quadratic In Out", "formula": "y = 2x^2 if x < 0.5 else 1 - (-2x + 2)^2 / 2", "params": {}}',
      metal:
        "float quadraticInOut(float x) { return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0; }",
      opencl:
        "float quadraticInOut(float x) { return x < 0.5f ? 2.0f * x * x : 1.0f - pow(-2.0f * x + 2.0f, 2.0f) / 2.0f; }",
      unity:
        "public static float QuadraticInOut(float x) { return x < 0.5f ? 2.0f * x * x : 1.0f - Mathf.Pow(-2.0f * x + 2.0f, 2.0f) / 2.0f; }",
      shadertoy:
        "return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0;",
      svelte:
        "export const quadraticInOut = (x) => { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };",
      matlab: "y = @(x) quadraticInOutImpl(x);",
      excel: "=IF(A1<0.5,2*A1*A1,1-POWER(-2*A1+2,2)/2)",
      desmos:
        "y=\\left(x<0.5\\right)\\cdot2x^{2}+\\left(x\\geq0.5\\right)\\cdot\\left(1-\\frac{\\left(-2x+2\\right)^{2}}{2}\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quadratic-in", "quadratic-out", "cubic-in-out", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quadraticInOutCurve(params as QuadraticInOutParams),
    },
  };
}
