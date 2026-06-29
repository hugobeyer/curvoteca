import {
  cosineInKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CosineInParams = typeof defaultParams;

export function cosineInCurve(
  _params: CosineInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cosineInKernel;
  return {
    id: "cosine-in",
    name: "Cosine In",
    aliases: ["easeInCosine", "cos in", "quarter cosine in"],
    family: "trigonometric",
    summary: "Cosine ease-in",
    formula: "y = sin(x * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "cosine", "ease-in"],
    useCases: ["ui-animation", "ease-in", "motion-blend"],
    snippets: {
      equation: "y = sin(x * pi / 2)",
      js: "function cosineIn(x) { return Math.sin(x * Math.PI / 2); }",
      ts: "function cosineIn(x: number): number { return Math.sin(x * Math.PI / 2); }",
      glsl: "float cosineIn(float x) { return sin(x * 1.57079633); }",
      vex: "float cosineIn(float x) { return sin(x * M_PI / 2); }",
      csharp: "float CosineIn(float x) { return MathF.Sin(x * MathF.PI / 2); }",
      rust: "fn cosine_in(x: f64) -> f64 { (x * std::f64::consts::PI / 2.0).sin() }",
      hlsl: "float cosineIn(float x) { return sin(x * 1.57079633); }",
      wgsl: "fn cosine_in(x: f32) -> f32 { return sin(x * 1.57079633); }",
      python: "def cosine_in(x): return math.sin(x * math.pi / 2)",
      cpp: "#include <cmath>\nfloat cosineIn(float x) { return std::sin(x * M_PI / 2.0f); }",
      lua: "function cosineIn(x) return math.sin(x * math.pi / 2) end",
      gdscript: "func cosine_in(x: float) -> float: return sin(x * PI / 2.0)",
      cuda: "__device__ float cosineIn(float x) { return sinf(x * 3.14159265f / 2.0f); }",
      c: "#include <math.h>\ndouble cosineIn(double x) { return sin(x * M_PI / 2.0); }",
      json: '{"name": "Cosine In", "formula": "y = sin(x * pi / 2)", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["cosine-ease", "cosine-in-out", "sine-in", "circular-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cosineInCurve(params as CosineInParams),
    },
  };
}
