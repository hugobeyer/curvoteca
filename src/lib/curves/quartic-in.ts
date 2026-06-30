import {
  DEFAULT_SAMPLING,
  quarticInKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuarticInParams = typeof defaultParams;

export function quarticInCurve(
  _params: QuarticInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quarticInKernel;
  return {
    id: "quartic-in",
    name: "Quartic In",
    aliases: ["easeInQuart", "ease-in-quart", "quartic ease in"],
    family: "easing",
    summary: "Quartic ease-in",
    formula: "y = x^4",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "quartic", "css"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = x^4",
      js: "function quarticIn(x) { return x * x * x * x; }",
      glsl: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      vex: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      ts: "function quarticIn(x: number): number { const x2 = x * x; return x2 * x2; }",
      csharp: "float QuarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      rust: "fn quartic_in(x: f64) -> f64 { let x2 = x * x; x2 * x2 }",
      hlsl: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      wgsl: "fn quarticIn(x: f32) -> f32 { let x2 = x * x; return x2 * x2; }",
      python: "def quartic_in(x): x2 = x * x; return x2 * x2",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      lua: "function quarticIn(x) local x2 = x * x; return x2 * x2 end",
      gdscript:
        "func quarticIn(x: float) -> float: var x2 = x * x; return x2 * x2",
      cuda: "__device__ float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      c: "double quarticIn(double x) { double x2 = x * x; return x2 * x2; }",
      json: '{"name": "Quartic In", "formula": "y = x^4", "params": {}}',
      metal: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      opencl: "float quarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      unity:
        "public static float QuarticIn(float x) { float x2 = x * x; return x2 * x2; }",
      shadertoy: "return x*x*x*x;",
      svelte: "export const quarticIn = (x) => x * x * x * x;",
      matlab: "y = @(x) x^4;",
      excel: "=A1^4",
      desmos: "y = x^{4}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quartic-out", "quartic-in-out", "cubic-in", "quintic-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quarticInCurve(params as QuarticInParams),
    },
  };
}
