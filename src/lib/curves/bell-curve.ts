import {
  DEFAULT_SAMPLING,
  bellCurveKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { mu: 0.5, sigma: 0.2 } as const;
export type BellCurveParams = { mu: number; sigma: number };

export function bellCurveCurve(
  params: BellCurveParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = bellCurveKernel(params.mu, params.sigma);
  return {
    id: "bell-curve",
    name: "Bell Curve",
    aliases: ["bell", "narrow gaussian", "soft bell"],
    family: "distribution",
    summary: "Narrow bell curve",
    formula: "y = exp(-((x - mu) / sigma)^2 / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["bell", "gaussian", "distribution", "peak"],
    useCases: ["weighting", "soft-peaks", "soft-masks", "ui-animation"],
    snippets: {
      equation: "y = exp(-((x - mu) / sigma)^2 / 2)",
      js: "function bellCurve(x, mu, sigma) { const z = (x - mu) / sigma; return Math.exp(-0.5 * z * z); }",
      glsl: "float bellCurve(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      vex: "float bellCurve(float x; float mu; float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      ts: "function bellCurve(x: number, mu: number = 0.5, sigma: number = 0.2): number { const z = (x - mu) / sigma; return Math.exp(-0.5 * z * z); }",
      csharp:
        "float BellCurve(float x, float mu = 0.5f, float sigma = 0.2f) { float z = (x - mu) / sigma; return MathF.Exp(-0.5f * z * z); }",
      rust: "fn bellCurve(x: f64, mu: f64, sigma: f64) -> f64 { let z = (x - mu) / sigma; (-0.5 * z * z).exp() }",
      hlsl: "float bellCurve(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      wgsl: "fn bellCurve(x: f32, mu: f32, sigma: f32) -> f32 { let z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      python:
        "def bellCurve(x, mu=0.5, sigma=0.2): z = (x - mu) / sigma; return math.exp(-0.5 * z * z)",
      cpp: "float bellCurve(float x, float mu = 0.5f, float sigma = 0.2f) { float z = (x - mu) / sigma; return std::exp(-0.5f * z * z); }",
      lua: "function bellCurve(x, mu, sigma) mu = mu or 0.5 sigma = sigma or 0.2 local z = (x - mu) / sigma return math.exp(-0.5 * z * z) end",
      gdscript:
        "func bellCurve(x: float, mu: float = 0.5, sigma: float = 0.2) -> float: var z = (x - mu) / sigma; return exp(-0.5 * z * z)",
      cuda: "__device__ float bellCurve(float x, float mu, float sigma) { float z = (x - mu) / sigma; return expf(-0.5f * z * z); }",
      c: "double bellCurve(double x, double mu, double sigma) { double z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      json: '{"name": "Bell Curve", "formula": "y = exp(-((x - mu) / sigma)^2 / 2)", "params": {"mu": 0.5, "sigma": 0.2}}',
      metal:
        "float bellCurve(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      opencl:
        "float bellCurve(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5f * z * z); }",
      unity:
        "public static float BellCurve(float x, float mu = 0.5f, float sigma = 0.2f) { float z = (x - mu) / sigma; return MathF.Exp(-0.5f * z * z); }",
      shadertoy: "float z = (x - mu) / sigma; return exp(-0.5 * z * z);",
      matlab: "y = @(x, mu, sigma) exp(-0.5 * ((x - mu) / sigma) ^ 2);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["gaussian", "sinc", "window-hann", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => bellCurveCurve(p as BellCurveParams),
    },
  };
}
