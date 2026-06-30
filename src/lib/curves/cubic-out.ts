import {
  DEFAULT_SAMPLING,
  cubicOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CubicOutParams = typeof defaultParams;

export function cubicOutCurve(
  _params: CubicOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cubicOutKernel;
  return {
    id: "cubic-out",
    name: "Cubic Out",
    aliases: ["easeOutCubic", "ease-out-cubic", "cube out"],
    family: "easing",
    summary: "Cubic ease-out",
    formula: "y = 1 - (1 - x)^3",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-out", "cubic", "css"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 - (1 - x)^3",
      js: "function cubicOut(x) { var u = 1 - x; return 1 - u * u * u; }",
      glsl: "float cubicOut(float x) { float u = 1.0 - x; return 1.0 - u * u * u; }",
      vex: "float cubicOut(float x) { float u = 1 - x; return 1 - u * u * u; }",
      ts: "function cubicOut(x: number): number { const u = 1 - x; return 1 - u * u * u; }",
      csharp:
        "float CubicOut(float x) { float u = 1.0f - x; return 1.0f - u * u * u; }",
      rust: "fn cubic_out(x: f64) -> f64 { let u = 1.0 - x; 1.0 - u * u * u }",
      hlsl: "float cubicOut(float x) { float u = 1.0 - x; return 1.0 - u * u * u; }",
      wgsl: "fn cubicOut(x: f32) -> f32 { let u = 1.0 - x; return 1.0 - u * u * u; }",
      python: "def cubic_out(x): u = 1 - x; return 1 - u * u * u",
      css: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      cpp: "float cubicOut(float x) { float u = 1.0f - x; return 1.0f - u * u * u; }",
      lua: "function cubicOut(x) local u = 1 - x; return 1 - u * u * u end",
      gdscript:
        "func cubic_out(x: float) -> float: var u = 1.0 - x; return 1.0 - u * u * u",
      cuda: "__device__ float cubicOut(float x) { float u = 1.0f - x; return 1.0f - u * u * u; }",
      c: "double cubicOut(double x) { double u = 1.0 - x; return 1.0 - u * u * u; }",
      json: '{"name": "Cubic Out", "formula": "y = 1 - (1 - x)^3", "params": {}}',
      metal:
        "float cubicOut(float x) { float u = 1.0 - x; return 1.0 - u * u * u; }",
      opencl:
        "float cubicOut(float x) { float u = 1.0f - x; return 1.0f - u * u * u; }",
      unity:
        "public static float CubicOut(float x) { float u = 1.0f - x; return 1.0f - u * u * u; }",
      shadertoy: "float u = 1.0 - x; return 1.0 - u * u * u;",
      svelte:
        "export const cubicOut = (x) => { const u = 1 - x; return 1 - u * u * u; };",
      matlab: "y = @(x) 1 - (1-x)^3;",
      excel: "=1-(1-A1)^3",
      desmos: "y = 1 - (1 - x)^3",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["cubic-in", "cubic-in-out", "quadratic-out", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cubicOutCurve(params as CubicOutParams),
    },
  };
}
