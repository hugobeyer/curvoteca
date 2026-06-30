import {
  DEFAULT_SAMPLING,
  quadraticOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuadraticOutParams = typeof defaultParams;

export function quadraticOutCurve(
  _params: QuadraticOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quadraticOutKernel;
  return {
    id: "quadratic-out",
    name: "Quadratic Out",
    aliases: ["easeOutQuad", "ease-out-quad", "quad out"],
    family: "easing",
    summary: "Quadratic ease-out",
    formula: "y = 1 - (1 - x)^2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-out", "quadratic", "css"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 - (1 - x)^2",
      js: "function quadraticOut(x) { return 1 - (1 - x) * (1 - x); }",
      glsl: "float quadraticOut(float x) { float u = 1.0 - x; return 1.0 - u * u; }",
      vex: "float quadraticOut(float x) { float u = 1 - x; return 1 - u * u; }",
      ts: "function quadraticOut(x: number): number { const u = 1 - x; return 1 - u * u; }",
      csharp:
        "float QuadraticOut(float x) { float u = 1.0f - x; return 1.0f - u * u; }",
      rust: "fn quadratic_out(x: f64) -> f64 { let u = 1.0 - x; 1.0 - u * u }",
      hlsl: "float quadraticOut(float x) { float u = 1.0 - x; return 1.0 - u * u; }",
      wgsl: "fn quadraticOut(x: f32) -> f32 { let u = 1.0 - x; return 1.0 - u * u; }",
      python: "def quadratic_out(x): u = 1 - x; return 1 - u * u",
      css: "cubic-bezier(0, 0, 0.58, 1)",
      cpp: "float quadraticOut(float x) { float u = 1.0f - x; return 1.0f - u * u; }",
      lua: "function quadraticOut(x) local u = 1 - x; return 1 - u * u end",
      gdscript:
        "func quadraticOut(x: float) -> float: var u = 1 - x; return 1 - u * u",
      cuda: "__device__ float quadraticOut(float x) { float u = 1.0f - x; return 1.0f - u * u; }",
      c: "double quadraticOut(double x) { double u = 1.0 - x; return 1.0 - u * u; }",
      json: '{"name": "Quadratic Out", "formula": "y = 1 - (1 - x)^2", "params": {}}',
      metal:
        "float quadraticOut(float x) { float u = 1.0 - x; return 1.0 - u * u; }",
      opencl:
        "float quadraticOut(float x) { float u = 1.0f - x; return 1.0f - u * u; }",
      unity:
        "public static float QuadraticOut(float x) { float u = 1.0f - x; return 1.0f - u * u; }",
      shadertoy: "float u = 1.0 - x; return 1.0 - u * u;",
      svelte:
        "export const quadraticOut = (x) => { const u = 1 - x; return 1 - u * u; };",
      matlab: "y = @(x) quadraticOutImpl(x);",
      excel: "=1-(1-A1)*(1-A1)",
      desmos: "y=1-\\left(1-x\\right)^{2}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quadratic-in", "quadratic-in-out", "cubic-out", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quadraticOutCurve(params as QuadraticOutParams),
    },
  };
}
