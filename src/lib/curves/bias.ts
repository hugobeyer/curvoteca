import { DEFAULT_SAMPLING, biasKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { b: 0.3 } as const;
export type BiasParams = { b: number };

export function biasCurve(params: BiasParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = biasKernel(params.b);
  return {
    id: "bias",
    name: "Bias",
    aliases: ["perlin bias", "midtone bias", "exponential bias"],
    family: "remap",
    summary: "Midtone remap",
    formula: "y = x^(log(b) / log(0.5))",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["remap", "ui", "midtone", "perlin"],
    useCases: ["texture-remapping", "color-grading", "midtone-control"],
    snippets: {
      equation: "y = x^(log(b) / log(0.5))",
      js: "function bias(x, b) { return Math.pow(x, Math.log(b) / Math.log(0.5)); }",
      glsl: "float bias(float x, float b) { return pow(x, log(b) / log(0.5)); }",
      vex: "float bias(float x; float b) { return pow(x, log(b) / log(0.5)); }",
      ts: "function bias(x: number, b: number): number { return Math.pow(x, Math.log(b) / Math.log(0.5)); }",
      csharp:
        "float Bias(float x, float b) { return MathF.Pow(x, MathF.Log(b) / MathF.Log(0.5f)); }",
      rust: "fn bias(x: f64, b: f64) -> f64 { (x).powf(b.ln() / (0.5_f64).ln()) }",
      hlsl: "float bias(float x, float b) { return pow(x, log(b) / log(0.5)); }",
      wgsl: "fn bias(x: f32, b: f32) -> f32 { return pow(x, log(b) / log(0.5)); }",
      python: "def bias(x, b): return math.pow(x, math.log(b) / math.log(0.5))",
      cpp: "float bias(float x, float b) { return std::pow(x, std::log(b) / std::log(0.5f)); }",
      lua: "function bias(x, b) return math.pow(x, math.log(b) / math.log(0.5)) end",
      gdscript:
        "func bias(x: float, b: float) -> float: return pow(x, log(b) / log(0.5))",
      cuda: "__device__ float bias(float x, float b) { return powf(x, logf(b) / logf(0.5f)); }",
      c: "double bias(double x, double b) { return pow(x, log(b) / log(0.5)); }",
      json: '{"name": "Bias", "formula": "y = x^(log(b) / log(0.5))", "params": {"b": 0.3}}',
      metal:
        "float bias(float x, float b) { return pow(x, log(b) / log(0.5)); }",
      opencl:
        "float bias(float x, float b) { return pow(x, log(b) / log(0.5)); }",
      unity:
        "public static float Bias(float x, float b) { return MathF.Pow(x, MathF.Log(b) / MathF.Log(0.5f)); }",
      shadertoy: "return pow(x, log(b) / log(0.5));",
      matlab: "y = @(x, b) x ^ (log(b) / log(0.5));",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["gain", "power"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => biasCurve(p as BiasParams),
    },
  };
}
