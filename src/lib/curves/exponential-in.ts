import { DEFAULT_SAMPLING, exponentialInKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type ExponentialInParams = typeof defaultParams;

export function exponentialInCurve(
  _params: ExponentialInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = exponentialInKernel;
  return {
    id: "exponential-in",
    name: "Exponential In",
    aliases: ["easeInExpo", "ease-in-expo", "expo in"],
    family: "easing",
    summary: "Exponential ease-in",
    formula: "y = 0 if x = 0 else 2^(10x - 10)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "exponential", "css"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = 0 if x = 0 else 2^(10x - 10)",
      js: "function exponentialIn(x) { return x === 0 ? 0 : Math.pow(2, 10 * x - 10); }",
      glsl: "float exponentialIn(float x) { return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0); }",
      vex: "float exponentialIn(float x) { return x == 0 ? 0 : pow(2, 10 * x - 10); }",
      ts: "function exponentialIn(x: number): number { return x === 0 ? 0 : Math.pow(2, 10 * x - 10); }",
      csharp: "float ExponentialIn(float x) { return x == 0.0f ? 0.0f : MathF.Pow(2.0f, 10.0f * x - 10.0f); }",
      rust: "fn exponential_in(x: f64) -> f64 { if x == 0.0 { 0.0 } else { (2.0_f64).powf(10.0 * x - 10.0) } }",
      hlsl: "float exponentialIn(float x) { return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0); }",
      wgsl: "fn exponentialIn(x: f32) -> f32 { return select(pow(2.0, 10.0 * x - 10.0), 0.0, x == 0.0); }",
      python: "def exponential_in(x): return 0 if x == 0 else math.pow(2, 10 * x - 10)",
      cpp: "#include <cmath>\nfloat exponentialIn(float x) { return x == 0.0f ? 0.0f : std::pow(2.0f, 10.0f * x - 10.0f); }",
      lua: "function exponentialIn(x) return x == 0 and 0 or math.pow(2, 10 * x - 10) end",
      gdscript: "func exponential_in(x: float) -> float: return 0.0 if x == 0.0 else pow(2.0, 10.0 * x - 10.0)",
      cuda: "__device__ float exponentialIn(float x) { return x == 0.0f ? 0.0f : powf(2.0f, 10.0f * x - 10.0f); }",
      c: "#include <math.h>\ndouble exponentialIn(double x) { return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0); }",
      json: '{"name": "Exponential In", "formula": "y = 0 if x = 0 else 2^(10x - 10)", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["exponential-out", "exponential-in-out", "quintic-in", "sine-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => exponentialInCurve(params as ExponentialInParams),
    },
  };
}
