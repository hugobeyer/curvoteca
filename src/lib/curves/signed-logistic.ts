import {
  DEFAULT_SAMPLING,
  signedLogisticKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { k: 4 } as const;
export type SignedLogisticParams = { k: number };

export function signedLogisticCurve(
  params: SignedLogisticParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = signedLogisticKernel(params.k);
  return {
    id: "signed-logistic",
    name: "Signed Logistic",
    aliases: ["tanh-shaped sigmoid", "logistic signed", "centered sigmoid"],
    family: "signed",
    summary: "Signed logistic on [-1, 1]",
    formula: "y = 2 / (1 + e^(-k*x)) - 1",
    continuity: "C3+",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["sigmoid", "slider", "tooling", "signed", "activation"],
    useCases: [
      "slider-response",
      "soft-thresholds",
      "gamepad-curves",
      "symmetric-remapping",
    ],

    snippets: {
      equation: "y = 2 / (1 + e^(-k*x)) - 1",
      js: "function signedLogistic(x, k) { return 2 / (1 + Math.exp(-k * x)) - 1; }",
      glsl: "float signedLogistic(float x, float k) { return 2.0 / (1.0 + exp(-k * x)) - 1.0; }",
      vex: "float signedLogistic(float x; float k) { return 2 / (1 + exp(-k * x)) - 1; }",
      ts: "function signedLogistic(x: number, k: number): number { return 2 / (1 + Math.exp(-k * x)) - 1; }",
      csharp:
        "float SignedLogistic(float x, float k) { return 2.0f / (1.0f + MathF.Exp(-k * x)) - 1.0f; }",
      rust: "fn signed_logistic(x: f64, k: f64) -> f64 { 2.0 / (1.0 + (-k * x).exp()) - 1.0 }",
      hlsl: "float signedLogistic(float x, float k) { return 2.0 / (1.0 + exp(-k * x)) - 1.0; }",
      wgsl: "fn signedLogistic(x: f32, k: f32) -> f32 { return 2.0 / (1.0 + exp(-k * x)) - 1.0; }",
      python:
        "def signed_logistic(x, k): return 2 / (1 + math.exp(-k * x)) - 1",
      css: "cubic-bezier(0.5, 0, 0.5, 1)",
      cpp: "float signedLogistic(float x, float k) { return 2.0f / (1.0f + std::exp(-k * x)) - 1.0f; }",
      lua: "function signedLogistic(x, k) return 2 / (1 + math.exp(-k * x)) - 1 end",
      gdscript:
        "func signedLogistic(x: float, k: float) -> float: return 2.0 / (1.0 + exp(-k * x)) - 1.0",
      cuda: "__device__ float signedLogistic(float x, float k) { return 2.0f / (1.0f + expf(-k * x)) - 1.0f; }",
      c: "double signedLogistic(double x, double k) { return 2.0 / (1.0 + exp(-k * x)) - 1.0; }",
      json: '{"name": "Signed Logistic", "formula": "y = 2 / (1 + e^(-k*x)) - 1", "params": {"k": 4}}',
      metal:
        "float signedLogistic(float x, float k) { return 2.0 / (1.0 + exp(-k * x)) - 1.0; }",
      opencl:
        "float signedLogistic(float x, float k) { return 2.0f / (1.0f + exp(-k * x)) - 1.0f; }",
      unity:
        "public static float SignedLogistic(float x, float k) { return 2.0f / (1.0f + Mathf.Exp(-k * x)) - 1.0f; }",
      matlab: "y = @(x, k) 2 / (1 + exp(-k * x)) - 1;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["logistic", "signed-quintic", "signed-scale", "soft-dead-zone"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => signedLogisticCurve(p as SignedLogisticParams),
    },
  };
}
