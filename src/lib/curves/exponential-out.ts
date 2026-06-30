import {
  DEFAULT_SAMPLING,
  exponentialOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type ExponentialOutParams = typeof defaultParams;

export function exponentialOutCurve(
  _params: ExponentialOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = exponentialOutKernel;
  return {
    id: "exponential-out",
    name: "Exponential Out",
    aliases: ["easeOutExpo", "ease-out-expo", "expo out"],
    family: "easing",
    summary: "Exponential ease-out",
    formula: "y = 1 if x = 1 else 1 - 2^(-10x)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-out", "exponential", "css"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 if x = 1 else 1 - 2^(-10x)",
      js: "function exponentialOut(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }",
      glsl: "float exponentialOut(float x) { return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }",
      vex: "float exponentialOut(float x) { return x == 1 ? 1 : 1 - pow(2, -10 * x); }",
      ts: "function exponentialOut(x: number): number { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }",
      csharp:
        "float ExponentialOut(float x) { return x == 1.0f ? 1.0f : 1.0f - MathF.Pow(2.0f, -10.0f * x); }",
      rust: "fn exponential_out(x: f64) -> f64 { if x == 1.0 { 1.0 } else { 1.0 - (2.0_f64).powf(-10.0 * x) } }",
      hlsl: "float exponentialOut(float x) { return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }",
      wgsl: "fn exponentialOut(x: f32) -> f32 { return select(1.0 - pow(2.0, -10.0 * x), 1.0, x == 1.0); }",
      python:
        "def exponential_out(x): return 1 if x == 1 else 1 - math.pow(2, -10 * x)",
      cpp: "#include <cmath>\nfloat exponentialOut(float x) { return x == 1.0f ? 1.0f : 1.0f - std::pow(2.0f, -10.0f * x); }",
      lua: "function exponentialOut(x) return x == 1 and 1 or 1 - math.pow(2, -10 * x) end",
      gdscript:
        "func exponential_out(x: float) -> float: return 1.0 if x == 1.0 else 1.0 - pow(2.0, -10.0 * x)",
      cuda: "__device__ float exponentialOut(float x) { return x == 1.0f ? 1.0f : 1.0f - powf(2.0f, -10.0f * x); }",
      c: "#include <math.h>\ndouble exponentialOut(double x) { return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }",
      json: '{"name": "Exponential Out", "formula": "y = 1 if x = 1 else 1 - 2^(-10x)", "params": {}}',
      metal:
        "float exponentialOut(float x) { return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }",
      opencl:
        "float exponentialOut(float x) { return x == 1.0f ? 1.0f : 1.0f - pow(2.0f, -10.0f * x); }",
      unity:
        "public static float ExponentialOut(float x) { return x == 1.0f ? 1.0f : 1.0f - Mathf.Pow(2.0f, -10.0f * x); }",
      shadertoy: "return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);",
      svelte:
        "export const exponentialOut = (x) => { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };",
      matlab: "y = @(x) exponentialOutImpl(x);",
      excel: "=IF(A1=1,1,1-POWER(2,-10*A1))",
      desmos:
        "y=\\left(x=1\\right)\\cdot1+\\left(x\\neq1\\right)\\cdot\\left(1-2^{-10x}\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: [
      "exponential-in",
      "exponential-in-out",
      "quintic-out",
      "sine-out",
    ],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => exponentialOutCurve(params as ExponentialOutParams),
    },
  };
}
