import { DEFAULT_SAMPLING, cosineOutKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CosineOutParams = typeof defaultParams;

export function cosineOutCurve(
  _params: CosineOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cosineOutKernel;
  return {
    id: "cosine-out",
    name: "Cosine Out",
    aliases: ["easeOutCos", "ease-out-cosine", "cos out", "quarter cosine out"],
    family: "trigonometric",
    summary: "Cosine-based ease-out",
    formula: "y = 1 - sin((1 - x) * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "sinusoidal", "ease-out"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 - sin((1 - x) * pi / 2)",
      js: "function cosineOut(x) { return 1 - Math.sin((1 - x) * Math.PI / 2); }",
      ts: "function cosineOut(x: number): number { return 1 - Math.sin((1 - x) * Math.PI / 2); }",
      glsl: "float cosineOut(float x) { return 1.0 - sin((1.0 - x) * 1.57079633); }",
      vex: "float cosineOut(float x) { return 1 - sin((1 - x) * M_PI / 2); }",
      csharp: "float CosineOut(float x) { return 1 - MathF.Sin((1 - x) * MathF.PI / 2); }",
      rust: "fn cosine_out(x: f64) -> f64 { 1.0 - ((1.0 - x) * std::f64::consts::PI / 2.0).sin() }",
      hlsl: "float cosineOut(float x) { return 1.0 - sin((1.0 - x) * 1.57079633); }",
      wgsl: "fn cosine_out(x: f32) -> f32 { return 1.0 - sin((1.0 - x) * 1.57079633); }",
      python: "def cosine_out(x): return 1 - math.sin((1 - x) * math.pi / 2)",
      cpp: "#include <cmath>\nfloat cosineOut(float x) { return 1.0f - std::sin((1.0f - x) * M_PI / 2.0f); }",
      lua: "function cosineOut(x) return 1 - math.sin((1 - x) * math.pi / 2) end",
      gdscript: "func cosine_out(x: float) -> float: return 1.0 - sin((1.0 - x) * PI / 2.0)",
      cuda: "__device__ float cosineOut(float x) { return 1.0f - sinf((1.0f - x) * 3.14159265f / 2.0f); }",
      c: "#include <math.h>\ndouble cosineOut(double x) { return 1.0 - sin((1.0 - x) * M_PI / 2.0); }",
      json: '{"name": "Cosine Out", "formula": "y = 1 - sin((1 - x) * pi / 2)", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-in", "sine-out", "sine-in-out", "circular-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => cosineOutCurve(params as CosineOutParams),
    },
  };
}
