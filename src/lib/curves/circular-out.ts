import {
  circularOutKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CircularOutParams = typeof defaultParams;

export function circularOutCurve(
  _params: CircularOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = circularOutKernel;
  return {
    id: "circular-out",
    name: "Circular Out",
    aliases: ["easeOutCirc", "circ out", "quarter circle out"],
    family: "trigonometric",
    summary: "Circular ease-out",
    formula: "y = sqrt(1 - (1 - x)^2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "circular", "ease-out"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],
    snippets: {
      equation: "y = sqrt(1 - (1 - x)^2)",
      js: "function circularOut(x) { const u = 1 - x; return Math.sqrt(Math.max(0, 1 - u * u)); }",
      ts: "function circularOut(x: number): number { const u = 1 - x; return Math.sqrt(Math.max(0, 1 - u * u)); }",
      glsl: "float circularOut(float x) { float u = 1.0 - x; return sqrt(max(0.0, 1.0 - u * u)); }",
      vex: "float circularOut(float x) { float u = 1 - x; return sqrt(max(0, 1 - u * u)); }",
      csharp:
        "float CircularOut(float x) { float u = 1 - x; return MathF.Sqrt(Math.Max(0.0f, 1 - u * u)); }",
      rust: "fn circular_out(x: f64) -> f64 { let u = 1.0 - x; (1.0 - u * u).max(0.0).sqrt() }",
      hlsl: "float circularOut(float x) { float u = 1.0 - x; return sqrt(max(0.0, 1.0 - u * u)); }",
      wgsl: "fn circular_out(x: f32) -> f32 { let u = 1.0 - x; return sqrt(max(0.0, 1.0 - u * u)); }",
      python:
        "def circular_out(x): u = 1 - x; return math.sqrt(max(0, 1 - u * u))",
      cpp: "float circularOut(float x) { float u = 1.0f - x; return std::sqrt(std::max(0.0f, 1.0f - u * u)); }",
      lua: "function circularOut(x) local u = 1 - x return math.sqrt(math.max(0, 1 - u * u)) end",
      gdscript:
        "func circularOut(x: float) -> float: var u = 1 - x; return sqrt(max(0, 1 - u * u))",
      cuda: "__device__ float circularOut(float x) { float u = 1.0f - x; return sqrtf(fmaxf(0.0f, 1.0f - u * u)); }",
      c: "double circularOut(double x) { double u = 1.0 - x; return sqrt(fmax(0.0, 1.0 - u * u)); }",
      json: '{"name": "Circular Out", "formula": "y = sqrt(1 - (1 - x)^2)", "params": {}}',
      metal:
        "float circularOut(float x) { float u = 1.0 - x; return sqrt(max(0.0, 1.0 - u * u)); }",
      opencl:
        "float circularOut(float x) { float u = 1.0f - x; return sqrt(fmax(0.0f, 1.0f - u * u)); }",
      unity:
        "public static float CircularOut(float x) { float u = 1 - x; return MathF.Sqrt(Math.Max(0.0f, 1 - u * u)); }",
      shadertoy: "float u = 1.0 - x; return sqrt(max(0.0, 1.0 - u * u));",
      svelte:
        "export const circularOut = (x) => { const u = 1 - x; return Math.sqrt(Math.max(0, 1 - u * u)); };",
      matlab: "y = @(x) sqrt(max(0, 1 - (1-x) * (1-x)));",
      excel: "=SQRT(MAX(0,1-(1-A1)^2))",
      desmos: "y = \\sqrt{\\max(0, 1 - (1 - x)^2)}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["circular-in", "sine-ease", "cosine-ease", "power"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => circularOutCurve(params as CircularOutParams),
    },
  };
}
