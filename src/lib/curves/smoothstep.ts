import {
  DEFAULT_SAMPLING,
  smoothstepKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SmoothstepParams = typeof defaultParams;

export function smoothstepCurve(
  _params: SmoothstepParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = smoothstepKernel;
  return {
    id: "smoothstep",
    name: "Smoothstep",
    aliases: ["smooth step", "hermite interpolation", "cubic smoothstep"],
    family: "smoothstep",
    summary: "C1 soft mask",
    formula: "y = 3x^2 - 2x^3",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["mask", "ui", "hermite", "soft-step"],
    useCases: [
      "image-masking",
      "ui-transitions",
      "height-blending",
      "edge-softening",
      "alpha-falloff",
    ],

    snippets: {
      equation: "y = 3x^2 - 2x^3",
      js: "function smoothstep(x) { return x * x * (3 - 2 * x); }",
      glsl: "float smoothstep(float x) { return x * x * (3.0 - 2.0 * x); }",
      vex: "float smoothstep(float x) { return x * x * (3 - 2 * x); }",
      ts: "function smoothstep(x: number): number { return x * x * (3 - 2 * x); }",
      csharp: "float Smoothstep(float x) { return x * x * (3 - 2 * x); }",
      rust: "fn smoothstep(x: f64) -> f64 { x * x * (3.0 - 2.0 * x) }",
      hlsl: "float smoothstep(float x) { return x * x * (3.0 - 2.0 * x); }",
      wgsl: "fn smoothstep(x: f32) -> f32 { return x * x * (3.0 - 2.0 * x); }",
      python: "def smoothstep(x): return x * x * (3 - 2 * x)",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float smoothstep(float x) { return x * x * (3.0f - 2.0f * x); }",
      lua: "function smoothstep(x) return x * x * (3 - 2 * x) end",
      gdscript: "func smoothstep(x: float) -> float: return x * x * (3.0 - 2.0 * x)",
      cuda: "__device__ float smoothstep(float x) { return x * x * (3.0f - 2.0f * x); }",
      c: "double smoothstep(double x) { return x * x * (3.0 - 2.0 * x); }",
      json: "{\"name\": \"Smoothstep\", \"formula\": \"y = 3x^2 - 2x^3\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smootherstep", "linear", "sine-ease", "gain"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => smoothstepCurve(params as SmoothstepParams),
    },
  };
}
