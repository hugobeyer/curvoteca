import {
  DEFAULT_SAMPLING,
  gaussianKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { mu: 0.5, sigma: 0.25 } as const;
export type GaussianParams = { mu: number; sigma: number };

export function gaussianCurve(
  params: GaussianParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = gaussianKernel(params.mu, params.sigma);
  return {
    id: "gaussian",
    name: "Gaussian",
    aliases: ["normal distribution", "bell", "gauss"],
    family: "distribution",
    summary: "Gaussian distribution",
    formula: "y = exp(-((x - mu) / sigma)^2 / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["gaussian", "distribution", "bell", "statistics"],
    useCases: ["statistics", "weighting", "soft-masks", "probabilities"],
    snippets: {
      equation: "y = exp(-((x - mu) / sigma)^2 / 2)",
      js: "function gaussian(x, mu, sigma) { const z = (x - mu) / sigma; return Math.exp(-0.5 * z * z); }",
      glsl: "float gaussian(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      vex: "float gaussian(float x; float mu; float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      ts: "function gaussian(x: number, mu: number = 0.5, sigma: number = 0.25): number { const z = (x - mu) / sigma; return Math.exp(-0.5 * z * z); }",
      csharp: "float Gaussian(float x, float mu = 0.5f, float sigma = 0.25f) { float z = (x - mu) / sigma; return MathF.Exp(-0.5f * z * z); }",
      rust: "fn gaussian(x: f64, mu: f64, sigma: f64) -> f64 { let z = (x - mu) / sigma; (-0.5 * z * z).exp() }",
      hlsl: "float gaussian(float x, float mu, float sigma) { float z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      wgsl: "fn gaussian(x: f32, mu: f32, sigma: f32) -> f32 { let z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      python: "def gaussian(x, mu=0.5, sigma=0.25): z = (x - mu) / sigma; return math.exp(-0.5 * z * z)",
      cpp: "float gaussian(float x, float mu = 0.5f, float sigma = 0.25f) { float z = (x - mu) / sigma; return std::exp(-0.5f * z * z); }",
      lua: "function gaussian(x, mu, sigma) mu = mu or 0.5; sigma = sigma or 0.25; local z = (x - mu) / sigma; return math.exp(-0.5 * z * z) end",
      gdscript: "func gaussian(x: float, mu: float = 0.5, sigma: float = 0.25) -> float: var z = (x - mu) / sigma; return exp(-0.5 * z * z)",
      cuda: "__device__ float gaussian(float x, float mu, float sigma) { float z = (x - mu) / sigma; return expf(-0.5f * z * z); }",
      c: "double gaussian(double x, double mu, double sigma) { double z = (x - mu) / sigma; return exp(-0.5 * z * z); }",
      json: "{\"name\": \"Gaussian\", \"formula\": \"y = exp(-((x - mu) / sigma)^2 / 2)\", \"params\": {\"mu\": 0.5, \"sigma\": 0.25}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["bell-curve", "sinc", "logistic", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => gaussianCurve(p as GaussianParams),
    },
  };
}
