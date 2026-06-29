import {
  circularInKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CircularInParams = typeof defaultParams;

export function circularInCurve(
  _params: CircularInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = circularInKernel;
  return {
    id: "circular-in",
    name: "Circular In",
    aliases: ["easeInCirc", "circ in", "quarter circle in"],
    family: "trigonometric",
    summary: "Circular ease-in",
    formula: "y = 1 - sqrt(1 - x^2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "circular", "ease-in"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],
    snippets: {
      equation: "y = 1 - sqrt(1 - x^2)",
      js: "function circularIn(x) { return 1 - Math.sqrt(Math.max(0, 1 - x * x)); }",
      ts: "function circularIn(x: number): number { return 1 - Math.sqrt(Math.max(0, 1 - x * x)); }",
      glsl: "float circularIn(float x) { return 1.0 - sqrt(max(0.0, 1.0 - x * x)); }",
      vex: "float circularIn(float x) { return 1 - sqrt(max(0, 1 - x * x)); }",
      csharp: "float CircularIn(float x) { return 1 - MathF.Sqrt(Math.Max(0.0f, 1 - x * x)); }",
      rust: "fn circular_in(x: f64) -> f64 { 1.0 - (1.0 - x * x).max(0.0).sqrt() }",
      hlsl: "float circularIn(float x) { return 1.0 - sqrt(max(0.0, 1.0 - x * x)); }",
      wgsl: "fn circular_in(x: f32) -> f32 { return 1.0 - sqrt(max(0.0, 1.0 - x * x)); }",
      python: "def circular_in(x): return 1 - math.sqrt(max(0, 1 - x * x))",
      cpp: "float circularIn(float x) { return 1.0f - std::sqrt(std::max(0.0f, 1.0f - x * x)); }",
      lua: "function circularIn(x) return 1 - math.sqrt(math.max(0, 1 - x * x)) end",
      gdscript: "func circularIn(x: float) -> float: return 1 - sqrt(max(0, 1 - x * x))",
      cuda: "__device__ float circularIn(float x) { return 1.0f - sqrtf(fmaxf(0.0f, 1.0f - x * x)); }",
      c: "double circularIn(double x) { return 1.0 - sqrt(fmax(0.0, 1.0 - x * x)); }",
      json: '{"name": "Circular In", "formula": "y = 1 - sqrt(1 - x^2)", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["circular-out", "sine-ease", "cosine-ease", "power"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => circularInCurve(params as CircularInParams),
    },
  };
}
