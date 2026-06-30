import {
  DEFAULT_SAMPLING,
  smootherstepKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SmootherstepParams = typeof defaultParams;

export function smootherstepCurve(
  _params: SmootherstepParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = smootherstepKernel;
  return {
    id: "smootherstep",
    name: "Smootherstep",
    aliases: [
      "ken perlin smootherstep",
      "perlin smoothstep",
      "quintic smoothstep",
      "c2 smoothstep",
    ],
    family: "smoothstep",
    summary: "C2 soft mask",
    formula: "y = 6x^5 - 15x^4 + 10x^3",
    continuity: "C2",
    domain: [0, 1],
    range: [0, 1],
    tags: ["mask", "ui", "perlin", "soft-step", "quintic"],
    useCases: [
      "image-masking",
      "ui-transitions",
      "height-blending",
      "noise-derivatives",
      "smooth-interpolation",
    ],

    snippets: {
      equation: "y = 6x^5 - 15x^4 + 10x^3",
      js: "function smootherstep(x) { return x * x * x * (x * (x * 6 - 15) + 10); }",
      glsl: "float smootherstep(float x) { return x*x*x*(x*(x*6.0 - 15.0) + 10.0); }",
      vex: "float smootherstep(float x) { return x*x*x*(x*(x*6 - 15) + 10); }",
      ts: "function smootherstep(x: number): number { return x * x * x * (x * (x * 6 - 15) + 10); }",
      csharp:
        "float Smootherstep(float x) { return x * x * x * (x * (x * 6 - 15) + 10); }",
      rust: "fn smootherstep(x: f64) -> f64 { x * x * x * (x * (x * 6.0 - 15.0) + 10.0) }",
      hlsl: "float smootherstep(float x) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }",
      wgsl: "fn smootherstep(x: f32) -> f32 { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }",
      python: "def smootherstep(x): return x * x * x * (x * (x * 6 - 15) + 10)",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float smootherstep(float x) { return x * x * x * (x * (x * 6.0f - 15.0f) + 10.0f); }",
      lua: "function smootherstep(x) return x * x * x * (x * (x * 6 - 15) + 10) end",
      gdscript:
        "func smootherstep(x: float) -> float: return x * x * x * (x * (x * 6.0 - 15.0) + 10.0)",
      cuda: "__device__ float smootherstep(float x) { return x * x * x * (x * (x * 6.0f - 15.0f) + 10.0f); }",
      c: "double smootherstep(double x) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }",
      json: '{"name": "Smootherstep", "formula": "y = 6x^5 - 15x^4 + 10x^3", "params": {}}',
      metal:
        "float smootherstep(float x) { return x*x*x*(x*(x*6.0 - 15.0) + 10.0); }",
      opencl:
        "float smootherstep(float x) { return x * x * x * (x * (x * 6.0f - 15.0f) + 10.0f); }",
      unity:
        "public static float Smootherstep(float x) { return x * x * x * (x * (x * 6 - 15) + 10); }",
      matlab: "y = @(x) x^3 * (x * (x * 6 - 15) + 10);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "linear", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => smootherstepCurve(params as SmootherstepParams),
    },
  };
}
