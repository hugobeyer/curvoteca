import {
  DEFAULT_SAMPLING,
  cubicInKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CubicInParams = typeof defaultParams;

export function cubicInCurve(
  _params: CubicInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cubicInKernel;
  return {
    id: "cubic-in",
    name: "Cubic In",
    aliases: ["easeInCubic", "ease-in-cubic", "cube in"],
    family: "easing",
    summary: "Cubic ease-in",
    formula: "y = x^3",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "cubic", "css"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = x^3",
      js: "function cubicIn(x) { return x * x * x; }",
      glsl: "float cubicIn(float x) { return x * x * x; }",
      vex: "float cubicIn(float x) { return x * x * x; }",
      ts: "function cubicIn(x: number): number { return x * x * x; }",
      csharp: "float CubicIn(float x) { return x * x * x; }",
      rust: "fn cubic_in(x: f64) -> f64 { x * x * x }",
      hlsl: "float cubicIn(float x) { return x * x * x; }",
      wgsl: "fn cubicIn(x: f32) -> f32 { return x * x * x; }",
      python: "def cubic_in(x): return x * x * x",
      css: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      cpp: "float cubicIn(float x) { return x * x * x; }",
      lua: "function cubicIn(x) return x * x * x end",
      gdscript: "func cubic_in(x: float) -> float: return x * x * x",
      cuda: "__device__ float cubicIn(float x) { return x * x * x; }",
      c: "double cubicIn(double x) { return x * x * x; }",
      json: '{"name": "Cubic In", "formula": "y = x^3", "params": {}}',
      metal: "float cubicIn(float x) { return x * x * x; }",
      opencl: "float cubicIn(float x) { return x * x * x; }",
      unity: "public static float CubicIn(float x) { return x * x * x; }",
      shadertoy: "return x * x * x;",
      svelte: "export const cubicIn = (x) => x * x * x;",
      matlab: "y = @(x) x^3;",
      excel: "=A1^3",
      desmos: "y = x^3",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["cubic-out", "cubic-in-out", "quadratic-in", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cubicInCurve(params as CubicInParams),
    },
  };
}
