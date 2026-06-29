import {
  DEFAULT_SAMPLING,
  quinticOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuinticOutParams = typeof defaultParams;

export function quinticOutCurve(
  _params: QuinticOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quinticOutKernel;
  return {
    id: "quintic-out",
    name: "Quintic Out",
    aliases: ["easeOutQuint", "ease-out-quint", "quintic ease out"],
    family: "easing",
    summary: "Quintic ease-out",
    formula: "y = 1 - (1 - x)^5",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-out", "quintic", "css"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 - (1 - x)^5",
      js: "function quinticOut(x) { var u = 1 - x; return 1 - u * u * u * u * u; }",
      glsl: "float quinticOut(float x) { float u = 1.0 - x; float u2 = u * u; return 1.0 - u2 * u2 * u; }",
      vex: "float quinticOut(float x) { float u = 1 - x; float u2 = u * u; return 1 - u2 * u2 * u; }",
      ts: "function quinticOut(x: number): number { const u = 1 - x; const u2 = u * u; return 1 - u2 * u2 * u; }",
      csharp: "float QuinticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2 * u; }",
      rust: "fn quintic_out(x: f64) -> f64 { let u = 1.0 - x; let u2 = u * u; 1.0 - u2 * u2 * u }",
      hlsl: "float quinticOut(float x) { float u = 1.0 - x; float u2 = u * u; return 1.0 - u2 * u2 * u; }",
      wgsl: "fn quinticOut(x: f32) -> f32 { let u = 1.0 - x; let u2 = u * u; return 1.0 - u2 * u2 * u; }",
      python: "def quintic_out(x): u = 1 - x; u2 = u * u; return 1 - u2 * u2 * u",
      css: "cubic-bezier(0, 0, 0.58, 1)",
      cpp: "float quinticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2 * u; }",
      lua: "function quinticOut(x) local u = 1 - x; local u2 = u * u; return 1 - u2 * u2 * u end",
      gdscript: "func quinticOut(x: float) -> float: var u = 1 - x; var u2 = u * u; return 1 - u2 * u2 * u",
      cuda: "__device__ float quinticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2 * u; }",
      c: "double quinticOut(double x) { double u = 1.0 - x; double u2 = u * u; return 1.0 - u2 * u2 * u; }",
      json: "{\"name\": \"Quintic Out\", \"formula\": \"y = 1 - (1 - x)^5\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quintic-in", "quintic-in-out", "quartic-out", "exponential-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quinticOutCurve(params as QuinticOutParams),
    },
  };
}
