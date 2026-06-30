import { DEFAULT_SAMPLING, linearKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type LinearParams = typeof defaultParams;

export function linearCurve(
  _params: LinearParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = linearKernel;
  return {
    id: "linear",
    name: "Linear",
    aliases: ["identity", "passthrough", "lerp", "no-easing"],
    family: "linear",
    summary: "Identity range fit",
    formula: "y = x",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["fit", "ui", "identity", "baseline"],
    useCases: ["ui-interpolation", "value-remapping", "baseline-comparison"],
    snippets: {
      equation: "y = x",
      js: "function linear(x) { return x; }",
      glsl: "float linear(float x) { return x; }",
      vex: "float linear(float x) { return x; }",
      ts: "function linear(x: number): number { return x; }",
      csharp: "float Linear(float x) { return x; }",
      rust: "fn linear(x: f64) -> f64 { x }",
      hlsl: "float linear(float x) { return x; }",
      wgsl: "fn linear(x: f32) -> f32 { return x; }",
      python: "def linear(x): return x",
      css: "linear",
      cpp: "float linear(float x) { return x; }",
      lua: "function linear(x) return x end",
      gdscript: "func linear(x: float) -> float: return x",
      cuda: "__device__ float linear(float x) { return x; }",
      c: "double linear(double x) { return x; }",
      json: '{"name": "Linear", "formula": "y = x", "params": {}}',
      metal: "float linear(float x) { return x; }",
      opencl: "float linear(float x) { return x; }",
      unity: "public static float Linear(float x) { return x; }",
      svelte: "export const linear = (x) => x;",
      matlab: "y = @(x) x;",
      excel: "=A1",
      desmos: "y=x",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: [
      "smoothstep",
      "smootherstep",
      "gain",
      "signed-scale",
      "dead-zone",
    ],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => linearCurve(params as LinearParams),
    },
  };
}
