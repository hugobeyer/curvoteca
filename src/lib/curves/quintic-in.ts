import { DEFAULT_SAMPLING, quinticInKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuinticInParams = typeof defaultParams;

export function quinticInCurve(
  _params: QuinticInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quinticInKernel;
  return {
    id: "quintic-in",
    name: "Quintic In",
    aliases: ["easeInQuint", "ease-in-quint", "quintic ease in"],
    family: "easing",
    summary: "Quintic ease-in",
    formula: "y = x^5",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "quintic", "css"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = x^5",
      js: "function quinticIn(x) { return x * x * x * x * x; }",
      glsl: "float quinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      vex: "float quinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      ts: "function quinticIn(x: number): number { const x2 = x * x; return x2 * x2 * x; }",
      csharp: "float QuinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      rust: "fn quintic_in(x: f64) -> f64 { let x2 = x * x; x2 * x2 * x }",
      hlsl: "float quinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      wgsl: "fn quinticIn(x: f32) -> f32 { let x2 = x * x; return x2 * x2 * x; }",
      python: "def quintic_in(x): x2 = x * x; return x2 * x2 * x",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float quinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      lua: "function quinticIn(x) local x2 = x * x; return x2 * x2 * x end",
      gdscript: "func quinticIn(x: float) -> float: var x2 = x * x; return x2 * x2 * x",
      cuda: "__device__ float quinticIn(float x) { float x2 = x * x; return x2 * x2 * x; }",
      c: "double quinticIn(double x) { double x2 = x * x; return x2 * x2 * x; }",
      json: "{\"name\": \"Quintic In\", \"formula\": \"y = x^5\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quintic-out", "quintic-in-out", "quartic-in", "exponential-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quinticInCurve(params as QuinticInParams),
    },
  };
}
