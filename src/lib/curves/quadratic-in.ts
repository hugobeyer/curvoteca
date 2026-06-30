import {
  DEFAULT_SAMPLING,
  quadraticInKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuadraticInParams = typeof defaultParams;

export function quadraticInCurve(
  _params: QuadraticInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quadraticInKernel;
  return {
    id: "quadratic-in",
    name: "Quadratic In",
    aliases: ["easeInQuad", "ease-in-quad", "quad in"],
    family: "easing",
    summary: "Quadratic ease-in",
    formula: "y = x^2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "quadratic", "css"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = x^2",
      js: "function quadraticIn(x) { return x * x; }",
      glsl: "float quadraticIn(float x) { return x * x; }",
      vex: "float quadraticIn(float x) { return x * x; }",
      ts: "function quadraticIn(x: number): number { return x * x; }",
      csharp: "float QuadraticIn(float x) { return x * x; }",
      rust: "fn quadratic_in(x: f64) -> f64 { x * x }",
      hlsl: "float quadraticIn(float x) { return x * x; }",
      wgsl: "fn quadraticIn(x: f32) -> f32 { return x * x; }",
      python: "def quadratic_in(x): return x * x",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float quadraticIn(float x) { return x * x; }",
      lua: "function quadraticIn(x) return x * x end",
      gdscript: "func quadraticIn(x: float) -> float: return x * x",
      cuda: "__device__ float quadraticIn(float x) { return x * x; }",
      c: "double quadraticIn(double x) { return x * x; }",
      json: '{"name": "Quadratic In", "formula": "y = x^2", "params": {}}',
      metal: "float quadraticIn(float x) { return x * x; }",
      opencl: "float quadraticIn(float x) { return x * x; }",
      unity: "public static float QuadraticIn(float x) { return x * x; }",
      shadertoy: "return x * x;",
      svelte: "export const quadraticIn = (x) => x * x;",
      matlab: "y = @(x) x * x;",
      excel: "=A1*A1",
      desmos: "y=x^{2}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quadratic-out", "quadratic-in-out", "cubic-in", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quadraticInCurve(params as QuadraticInParams),
    },
  };
}
