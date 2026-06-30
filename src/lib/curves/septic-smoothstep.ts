import { DEFAULT_SAMPLING, septicKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SepticSmoothstepParams = typeof defaultParams;

export function septicSmoothstepCurve(
  _params: SepticSmoothstepParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = septicKernel;
  return {
    id: "septic-smoothstep",
    name: "Septic Smoothstep",
    aliases: [
      "septic step",
      "7th degree smoothstep",
      "c6 smoothstep",
      "perlin septic",
    ],
    family: "smoothstep",
    summary: "C6 soft mask",
    formula: "y = 20x^7 - 70x^6 + 84x^5 - 35x^4",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["mask", "ui", "perlin", "soft-step", "septic"],
    useCases: [
      "image-masking",
      "ui-transitions",
      "height-blending",
      "noise-derivatives",
      "high-order-interpolation",
    ],

    snippets: {
      equation: "y = 20x^7 - 70x^6 + 84x^5 - 35x^4",
      js: "function septicSmoothstep(x) { const x2 = x*x, x3 = x2*x; return x3*x2*x2 * (35 - 84*x + 70*x2 - 20*x3); }",
      glsl: "float septicSmoothstep(float x) { float x2 = x*x, x3 = x2*x; return x3*x2*x2 * (35.0 - 84.0*x + 70.0*x2 - 20.0*x3); }",
      vex: "float septicSmoothstep(float x) { float x2 = x*x, x3 = x2*x; return x3*x2*x2 * (35 - 84*x + 70*x2 - 20*x3); }",
      ts: "function septicSmoothstep(x: number): number { const x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35 - 84 * x + 70 * x2 - 20 * x3); }",
      csharp:
        "float SepticSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35 - 84 * x + 70 * x2 - 20 * x3); }",
      rust: "fn septic_smoothstep(x: f64) -> f64 { let x2 = x * x; let x3 = x2 * x; x3 * x2 * x2 * (35.0 - 84.0 * x + 70.0 * x2 - 20.0 * x3) }",
      hlsl: "float septicSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35.0 - 84.0 * x + 70.0 * x2 - 20.0 * x3); }",
      wgsl: "fn septicSmoothstep(x: f32) -> f32 { let x2 = x * x; let x3 = x2 * x; return x3 * x2 * x2 * (35.0 - 84.0 * x + 70.0 * x2 - 20.0 * x3); }",
      python:
        "def septic_smoothstep(x): x2 = x * x; x3 = x2 * x; return x3 * x2 * x2 * (35 - 84 * x + 70 * x2 - 20 * x3)",
      css: "cubic-bezier(0.4, 0, 0.6, 1)",
      cpp: "float septicSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35.0f - 84.0f * x + 70.0f * x2 - 20.0f * x3); }",
      lua: "function septicSmoothstep(x) local x2 = x * x; local x3 = x2 * x; return x3 * x2 * x2 * (35 - 84 * x + 70 * x2 - 20 * x3) end",
      gdscript:
        "func septicSmoothstep(x: float) -> float: var x2 = x * x; var x3 = x2 * x; return x3 * x2 * x2 * (35.0 - 84.0 * x + 70.0 * x2 - 20.0 * x3)",
      cuda: "__device__ float septicSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35.0f - 84.0f * x + 70.0f * x2 - 20.0f * x3); }",
      c: "double septicSmoothstep(double x) { double x2 = x*x, x3 = x2*x; return x3*x2*x2 * (35.0 - 84.0*x + 70.0*x2 - 20.0*x3); }",
      json: '{"name": "Septic Smoothstep", "formula": "y = 20x^7 - 70x^6 + 84x^5 - 35x^4", "params": {}}',
      metal:
        "float septicSmoothstep(float x) { float x2 = x*x, x3 = x2*x; return x3*x2*x2 * (35.0 - 84.0*x + 70.0*x2 - 20.0*x3); }",
      opencl:
        "float septicSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35.0f - 84.0f * x + 70.0f * x2 - 20.0f * x3); }",
      unity:
        "public static float SepticSmoothstep(float x) { float x2 = x * x, x3 = x2 * x; return x3 * x2 * x2 * (35 - 84 * x + 70 * x2 - 20 * x3); }",
      matlab: "y = @(x) x^3 * x^2 * x^2 * (35 - 84*x + 70*x^2 - 20*x^3);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smootherstep", "smoothstep", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) =>
        septicSmoothstepCurve(params as SepticSmoothstepParams),
    },
  };
}
