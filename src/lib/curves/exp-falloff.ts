import {
  DEFAULT_SAMPLING,
  expFalloffKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { k: 3 } as const;
export type ExpFalloffParams = { k: number };

export function expFalloffCurve(
  params: ExpFalloffParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = expFalloffKernel(params.k);
  return {
    id: "exp-falloff",
    name: "Exp Falloff",
    aliases: ["exponential falloff", "1 - e^-x", "asymptotic ramp"],
    family: "log-exp",
    summary: "Asymptotic exponential ramp",
    formula: "y = (1 - e^(-k*x)) / (1 - e^(-k))",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["log", "exp", "falloff", "asymptotic", "ramp"],
    useCases: [
      "distance-falloff",
      "exposure-curves",
      "audio-response",
      "heat-maps",
    ],
    snippets: {
      equation: "y = (1 - e^(-k*x)) / (1 - e^(-k))",
      js: "function expFalloff(x, k) { k = k == null ? 3 : k; return (1 - Math.exp(-k * x)) / (1 - Math.exp(-k)); }",
      glsl: "float expFalloff(float x, float k) { k = (k == 0.0) ? 3.0 : k; return (1.0 - exp(-k * x)) / (1.0 - exp(-k)); }",
      vex: "float expFalloff(float x; float k) { if (k == 0) k = 3; return (1 - exp(-k * x)) / (1 - exp(-k)); }",
      ts: "function expFalloff(x: number, k: number = 3): number { return (1 - Math.exp(-k * x)) / (1 - Math.exp(-k)); }",
      csharp:
        "float ExpFalloff(float x, float k = 3f) { return (1.0f - MathF.Exp(-k * x)) / (1.0f - MathF.Exp(-k)); }",
      rust: "fn expFalloff(x: f64, k: f64) -> f64 { (1.0 - (-k * x).exp()) / (1.0 - (-k).exp()) }",
      hlsl: "float expFalloff(float x, float k) { return (1.0 - exp(-k * x)) / (1.0 - exp(-k)); }",
      wgsl: "fn expFalloff(x: f32, k: f32) -> f32 { return (1.0 - exp(-k * x)) / (1.0 - exp(-k)); }",
      python:
        "def expFalloff(x, k=3): return (1 - math.exp(-k * x)) / (1 - math.exp(-k))",
      cpp: "#include <cmath>\nfloat expFalloff(float x, float k = 3.0f) { return (1.0f - std::exp(-k * x)) / (1.0f - std::exp(-k)); }",
      lua: "function expFalloff(x, k) k = k or 3; return (1 - math.exp(-k * x)) / (1 - math.exp(-k)) end",
      gdscript:
        "func exp_falloff(x: float, k: float = 3.0) -> float: return (1.0 - exp(-k * x)) / (1.0 - exp(-k))",
      cuda: "__device__ float expFalloff(float x, float k) { return (1.0f - expf(-k * x)) / (1.0f - expf(-k)); }",
      c: "#include <math.h>\ndouble expFalloff(double x, double k) { return (1.0 - exp(-k * x)) / (1.0 - exp(-k)); }",
      json: '{"name": "Exp Falloff", "formula": "y = (1 - e^(-k*x)) / (1 - e^(-k))", "params": {"k": 3}}',
      metal:
        "float expFalloff(float x, float k) { k = (k == 0.0) ? 3.0 : k; return (1.0 - exp(-k * x)) / (1.0 - exp(-k)); }",
      opencl:
        "float expFalloff(float x, float k) { k = (k == 0.0f) ? 3.0f : k; return (1.0f - exp(-k * x)) / (1.0f - exp(-k)); }",
      unity:
        "public static float ExpFalloff(float x, float k) { return (1.0f - Mathf.Exp(-k * x)) / (1.0f - Mathf.Exp(-k)); }",
      matlab: "y = @(x, k) (1 - exp(-k * x)) / (1 - exp(-k));",
      excel: "=(1-EXP(-A1*A2))/(1-EXP(-A2))",
      desmos: "y=\\frac{1-e^{-kx}}{1-e^{-k}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["exp", "logistic", "soft-dead-zone"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => expFalloffCurve(p as ExpFalloffParams),
    },
  };
}
