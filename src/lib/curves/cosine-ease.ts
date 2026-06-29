import {
  cosineEaseKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CosineEaseParams = typeof defaultParams;

export function cosineEaseCurve(
  _params: CosineEaseParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cosineEaseKernel;
  return {
    id: "cosine-ease",
    name: "Cosine Ease",
    aliases: ["cosine ease out", "cos ease", "quarter cosine"],
    family: "trigonometric",
    summary: "Cosine ease out",
    formula: "y = 1 - cos(x * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "cosine"],
    useCases: ["ui-animation", "ease-out", "oscillators", "motion-blend"],
    snippets: {
      equation: "y = 1 - cos(x * pi / 2)",
      js: "function cosineEase(x) { return 1 - Math.cos(x * Math.PI / 2); }",
      ts: "function cosineEase(x: number): number { return 1 - Math.cos(x * Math.PI / 2); }",
      glsl: "float cosineEase(float x) { return 1.0 - cos(x * 1.57079633); }",
      vex: "float cosineEase(float x) { return 1 - cos(x * M_PI / 2); }",
      csharp: "float CosineEase(float x) { return 1 - MathF.Cos(x * MathF.PI / 2); }",
      rust: "fn cosine_ease(x: f64) -> f64 { 1.0 - (x * std::f64::consts::PI / 2.0).cos() }",
      hlsl: "float cosineEase(float x) { return 1.0 - cos(x * 1.57079633); }",
      wgsl: "fn cosine_ease(x: f32) -> f32 { return 1.0 - cos(x * 1.57079633); }",
      python: "def cosine_ease(x): return 1 - math.cos(x * math.pi / 2)",
      cpp: "#include <cmath>\nfloat cosineEase(float x) { return 1.0f - std::cos(x * M_PI / 2.0f); }",
      lua: "function cosineEase(x) return 1 - math.cos(x * math.pi / 2) end",
      gdscript: "func cosine_ease(x: float) -> float: return 1.0 - cos(x * PI / 2.0)",
      cuda: "__device__ float cosineEase(float x) { return 1.0f - cosf(x * 3.14159265f / 2.0f); }",
      c: "#include <math.h>\ndouble cosineEase(double x) { return 1.0 - cos(x * M_PI / 2.0); }",
      json: '{"name": "Cosine Ease", "formula": "y = 1 - cos(x * pi / 2)", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-ease", "smootherstep", "linear", "circular-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cosineEaseCurve(params as CosineEaseParams),
    },
  };
}
