import { DEFAULT_SAMPLING, expKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { k: 2 } as const;
export type ExpParams = { k: number };

export function expCurve(params: ExpParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = expKernel(params.k);
  return {
    id: "exp",
    name: "Exp",
    aliases: [
      "exponential",
      "exponential curve",
      "exp ramp",
      "exponential ease",
    ],
    family: "log-exp",
    summary: "Normalized exp ramp",
    formula: "y = (e^(kx) - 1) / (e^k - 1)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["log", "exp", "ramp", "exponential"],
    useCases: ["exposure-curves", "audio-response", "heat-maps"],
    snippets: {
      equation: "y = (e^(kx) - 1) / (e^k - 1)",
      js: "function expCurve(x, k) { return (Math.exp(k * x) - 1) / (Math.exp(k) - 1); }",
      glsl: "float expCurve(float x, float k) { return (exp(k * x) - 1.0) / (exp(k) - 1.0); }",
      vex: "float expCurve(float x; float k) { return (exp(k * x) - 1) / (exp(k) - 1); }",
      ts: "function expCurve(x: number, k: number = 2): number { return (Math.exp(k * x) - 1) / (Math.exp(k) - 1); }",
      csharp:
        "float ExpCurve(float x, float k = 2f) { return (MathF.Exp(k * x) - 1.0f) / (MathF.Exp(k) - 1.0f); }",
      rust: "fn expCurve(x: f64, k: f64) -> f64 { ((k * x).exp() - 1.0) / (k.exp() - 1.0) }",
      hlsl: "float expCurve(float x, float k) { return (exp(k * x) - 1.0) / (exp(k) - 1.0); }",
      wgsl: "fn expCurve(x: f32, k: f32) -> f32 { return (exp(k * x) - 1.0) / (exp(k) - 1.0); }",
      python:
        "def expCurve(x, k=2): return (math.exp(k * x) - 1) / (math.exp(k) - 1)",
      cpp: "#include <cmath>\nfloat expCurve(float x, float k = 2.0f) { return (std::exp(k * x) - 1.0f) / (std::exp(k) - 1.0f); }",
      lua: "function expCurve(x, k) k = k or 2; return (math.exp(k * x) - 1) / (math.exp(k) - 1) end",
      gdscript:
        "func exp_curve(x: float, k: float = 2.0) -> float: return (exp(k * x) - 1.0) / (exp(k) - 1.0)",
      cuda: "__device__ float expCurve(float x, float k) { return (expf(k * x) - 1.0f) / (expf(k) - 1.0f); }",
      c: "#include <math.h>\ndouble expCurve(double x, double k) { return (exp(k * x) - 1.0) / (exp(k) - 1.0); }",
      json: '{"name": "Exp", "formula": "y = (e^(kx) - 1) / (e^k - 1)", "params": {"k": 2}}',
      metal:
        "float expCurve(float x, float k) { return (exp(k * x) - 1.0) / (exp(k) - 1.0); }",
      opencl:
        "float expCurve(float x, float k) { return (exp(k * x) - 1.0f) / (exp(k) - 1.0f); }",
      unity:
        "public static float ExpCurve(float x, float k) { return (Mathf.Exp(k * x) - 1.0f) / (Mathf.Exp(k) - 1.0f); }",
      matlab: "y = @(x, k) (exp(k * x) - 1) / (exp(k) - 1);",
      excel: "=(EXP(A1*A2)-1)/(EXP(A2)-1)",
      desmos: "y=\\frac{e^{kx}-1}{e^{k}-1}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["logistic", "power"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => expCurve(p as ExpParams),
    },
  };
}
