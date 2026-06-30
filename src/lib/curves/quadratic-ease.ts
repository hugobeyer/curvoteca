import {
  DEFAULT_SAMPLING,
  quadraticEaseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuadraticEaseParams = typeof defaultParams;

export function quadraticEaseCurve(
  _params: QuadraticEaseParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quadraticEaseKernel;
  return {
    id: "quadratic-ease",
    name: "Quadratic Ease",
    aliases: ["quad ease", "ease in quad", "quadratic in"],
    family: "power",
    summary: "Quadratic ease-in",
    formula: "y = x^2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "quadratic", "power", "polynomial"],
    useCases: ["ease-in", "ui-animation", "accelerate-from-rest"],
    snippets: {
      equation: "y = x^2",
      js: "function quadraticEase(x) { return x * x; }",
      glsl: "float quadraticEase(float x) { return x * x; }",
      vex: "float quadraticEase(float x) { return x * x; }",
      ts: "function quadraticEase(x: number): number { return x * x; }",
      csharp: "float QuadraticEase(float x) { return x * x; }",
      rust: "fn quadratic_ease(x: f64) -> f64 { x * x }",
      hlsl: "float quadraticEase(float x) { return x * x; }",
      wgsl: "fn quadraticEase(x: f32) -> f32 { return x * x; }",
      python: "def quadratic_ease(x): return x * x",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float quadraticEase(float x) { return x * x; }",
      lua: "function quadraticEase(x) return x * x end",
      gdscript: "func quadraticEase(x: float) -> float: return x * x",
      cuda: "__device__ float quadraticEase(float x) { return x * x; }",
      c: "double quadraticEase(double x) { return x * x; }",
      json: '{"name": "Quadratic Ease", "formula": "y = x^2", "params": {}}',
      metal: "float quadraticEase(float x) { return x * x; }",
      opencl: "float quadraticEase(float x) { return x * x; }",
      unity: "public static float QuadraticEase(float x) { return x * x; }",
      svelte: "export const quadraticEase = (x) => x * x;",
      matlab: "y = @(x) x * x;",
      excel: "=A1*A1",
      desmos: "y=x^{2}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["parabola", "power", "sine-in", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quadraticEaseCurve(params as QuadraticEaseParams),
    },
  };
}
