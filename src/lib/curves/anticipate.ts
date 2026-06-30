import {
  DEFAULT_SAMPLING,
  anticipateKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type AnticipateParams = typeof defaultParams;

export function anticipateCurve(
  _params: AnticipateParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = anticipateKernel;
  return {
    id: "anticipate",
    name: "Anticipate",
    aliases: ["easeInAnticipate", "anticipate ease", "wind up", "back ease in"],
    family: "easing",
    summary: "Anticipatory wind-up ease",
    formula: "y = 1 - bounceOut(1 - x), clamped",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in", "anticipate", "game-feel"],
    useCases: ["ui-animation", "ease-in", "anticipation", "game-feel"],

    snippets: {
      equation: "y = 1 - bounceOut(1 - x)",
      js: "function anticipate(x) { return anticipateKernel(x); }",
      glsl: "float anticipate(float x) { return anticipateKernel(x); }",
      vex: "float anticipate(float x) { return anticipateKernel(x); }",
      ts: "function anticipate(x: number): number { return anticipateKernel(x); }",
      csharp: "float Anticipate(float x) { return AnticipateKernel(x); }",
      rust: "fn anticipate(x: f64) -> f64 { anticipate_kernel(x) }",
      hlsl: "float anticipate(float x) { return anticipateKernel(x); }",
      wgsl: "fn anticipate(x: f32) -> f32 { return anticipateKernel(x); }",
      python: "def anticipate(x): return anticipate_kernel(x)",
      cpp: "float anticipate(float x) { return anticipateKernel(x); }",
      lua: "function anticipate(x) return anticipateKernel(x) end",
      gdscript:
        "func anticipate(x: float) -> float: return anticipateKernel(x)",
      cuda: "__device__ float anticipate(float x) { return anticipateKernel(x); }",
      c: "double anticipate(double x) { return anticipateKernel(x); }",
      json: '{"name": "Anticipate", "formula": "y = 1 - bounceOut(1 - x)", "params": {}}',
      metal: "float anticipate(float x) { return anticipateKernel(x); }",
      opencl: "float anticipate(float x) { return anticipateKernel(x); }",
      unity:
        "public static float Anticipate(float x) { return AnticipateKernel(x); }",
      shadertoy: "return anticipateKernel(x);",
      svelte: "export const anticipate = (x) => anticipateKernel(x);",
      matlab: "y = @(x) anticipateKernel(x);",
      excel: "=anticipateKernel(A1)",
      desmos: "y = \\operatorname{anticipateKernel}(x)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-in", "cubic-in", "exponential-in", "overshoot"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => anticipateCurve(params as AnticipateParams),
    },
  };
}
