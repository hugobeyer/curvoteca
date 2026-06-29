import { DEFAULT_SAMPLING, powerKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { p: 2 } as const;
export type PowerParams = { p: number };

export function powerCurve(
  params: PowerParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = powerKernel(params.p);
  return {
    id: "power",
    name: "Power",
    aliases: ["pow", "gamma curve", "gamma correction", "exponent curve"],
    family: "power",
    summary: "Gamma / power",
    formula: "y = x^p",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["gamma", "curve", "power", "exponent"],
    useCases: [
      "gamma-correction",
      "contrast-adjustment",
      "exposure-curves",
      "tone-shaping",
    ],
    snippets: {
      equation: "y = x^p",
      js: "function power(x, p) { return Math.pow(x, p); }",
      glsl: "float power(float x, float p) { return pow(x, p); }",
      vex: "float power(float x; float p) { return pow(x, p); }",
      ts: "function power(x: number, p: number): number { return Math.pow(x, p); }",
      csharp: "float Power(float x, float p) { return MathF.Pow(x, p); }",
      rust: "fn power(x: f64, p: f64) -> f64 { x.powf(p) }",
      hlsl: "float power(float x, float p) { return pow(x, p); }",
      wgsl: "fn power(x: f32, p: f32) -> f32 { return pow(x, p); }",
      python: "def power(x, p): return math.pow(x, p)",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float power(float x, float p = 2.0f) { return std::pow(x, p); }",
      lua: "function power(x, p) p = p or 2; return math.pow(x, p) end",
      gdscript: "func power(x: float, p: float = 2.0) -> float: return pow(x, p)",
      cuda: "__device__ float power(float x, float p) { return powf(x, p); }",
      c: "#include <math.h>\ndouble power(double x, double p) { return pow(x, p); }",
      json: "{\"name\": \"Power\", \"formula\": \"y = x^p\", \"params\": {\"p\": 2}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["inverse-power", "signed-scale", "bias", "gain", "exp"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => powerCurve(p as PowerParams),
    },
  };
}
