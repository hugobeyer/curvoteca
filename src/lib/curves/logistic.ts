import {
  DEFAULT_SAMPLING,
  logisticKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { k: 4, x0: 0.5 } as const;
export type LogisticParams = { k: number; x0: number };

export function logisticCurve(
  params: LogisticParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = logisticKernel(params.k, params.x0);
  return {
    id: "logistic",
    name: "Logistic",
    aliases: ["sigmoid", "logistic function", "soft step", "activation curve"],
    family: "sigmoid",
    summary: "Logistic sigmoid",
    formula: "y = 1 / (1 + e^(-k(x - x0)))",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["sigmoid", "curve", "soft-step", "activation"],
    useCases: [
      "activation-functions",
      "soft-thresholds",
      "population-models",
      "soft-transitions",
    ],
    snippets: {
      equation: "y = 1 / (1 + e^(-k(x - x0)))",
      js: "function logistic(x, k, x0) { return 1 / (1 + Math.exp(-k * (x - x0))); }",
      glsl: "float logistic(float x, float k, float x0) { return 1.0 / (1.0 + exp(-k * (x - x0))); }",
      vex: "float logistic(float x; float k; float x0) { return 1 / (1 + exp(-k * (x - x0))); }",
      ts: "function logistic(x: number, k: number, x0: number): number { return 1 / (1 + Math.exp(-k * (x - x0))); }",
      csharp:
        "float Logistic(float x, float k, float x0) { return 1.0f / (1.0f + MathF.Exp(-k * (x - x0))); }",
      rust: "fn logistic(x: f64, k: f64, x0: f64) -> f64 { 1.0 / (1.0 + (-k * (x - x0)).exp()) }",
      hlsl: "float logistic(float x, float k, float x0) { return 1.0 / (1.0 + exp(-k * (x - x0))); }",
      wgsl: "fn logistic(x: f32, k: f32, x0: f32) -> f32 { return 1.0 / (1.0 + exp(-k * (x - x0))); }",
      python:
        "def logistic(x, k, x0): return 1 / (1 + math.exp(-k * (x - x0)))",
      css: "cubic-bezier(0.5, 0, 0.5, 1)",
      cpp: "float logistic(float x, float k, float x0) { return 1.0f / (1.0f + std::exp(-k * (x - x0))); }",
      lua: "function logistic(x, k, x0) return 1 / (1 + math.exp(-k * (x - x0))) end",
      gdscript:
        "func logistic(x: float, k: float, x0: float) -> float: return 1 / (1 + exp(-k * (x - x0)))",
      cuda: "__device__ float logistic(float x, float k, float x0) { return 1.0f / (1.0f + expf(-k * (x - x0))); }",
      c: "double logistic(double x, double k, double x0) { return 1 / (1 + exp(-k * (x - x0))); }",
      json: '{"name": "Logistic", "formula": "y = 1 / (1 + e^(-k(x - x0)))", "params": {"k": 4, "x0": 0.5}}',
      metal:
        "float logistic(float x, float k, float x0) { return 1.0 / (1.0 + exp(-k * (x - x0))); }",
      opencl:
        "float logistic(float x, float k, float x0) { return 1.0f / (1.0f + exp(-k * (x - x0))); }",
      unity:
        "public static float Logistic(float x, float k, float x0) { return 1.0f / (1.0f + Mathf.Exp(-k * (x - x0))); }",
      matlab: "y = @(x, k, x0) 1 / (1 + exp(-k * (x - x0)));",
      excel: "=1/(1+EXP(-A1*A2+A2*A3))",
      desmos: "y=\\frac{1}{1+e^{-k\\left(x-x_{0}\\right)}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["exp", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => logisticCurve(p as LogisticParams),
    },
  };
}
