import { DEFAULT_SAMPLING, gainKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { b: 0.7 } as const;
export type GainParams = { b: number };

export function gainCurve(params: GainParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = gainKernel(params.b);
  return {
    id: "gain",
    name: "Gain",
    aliases: ["perlin gain", "s-curve gain", "symmetric contrast"],
    family: "remap",
    summary: "Symmetric contrast",
    formula: "y = bias(2x, b) / 2  if x < 0.5  else  1 - bias(2 - 2x, b) / 2",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["contrast", "ui", "s-curve", "perlin"],
    useCases: [
      "contrast-expansion",
      "tone-mapping",
      "threshold-softening",
      "s-curve-response",
    ],
    snippets: {
      equation: "y = bias(2x, b)/2 if x < 0.5 else 1 - bias(2-2x, b)/2",
      js: "function gain(x, b) { return x < 0.5 ? bias(2 * x, b) / 2 : 1 - bias(2 - 2 * x, b) / 2; }",
      glsl: "float gain(float x, float b) { return x < 0.5 ? bias(2.0*x, b)/2.0 : 1.0 - bias(2.0 - 2.0*x, b)/2.0; }",
      vex: "float gain(float x; float b) { return x < 0.5 ? bias(2*x, b) / 2 : 1 - bias(2 - 2*x, b) / 2; }",
      ts: "function gain(x: number, b: number): number { return x < 0.5 ? bias(2 * x, b) / 2 : 1 - bias(2 - 2 * x, b) / 2; }",
      csharp:
        "float Gain(float x, float b) { return x < 0.5f ? Bias(2 * x, b) / 2 : 1 - Bias(2 - 2 * x, b) / 2; }",
      rust: "fn gain(x: f64, b: f64) -> f64 { if x < 0.5 { bias(2.0 * x, b) / 2.0 } else { 1.0 - bias(2.0 - 2.0 * x, b) / 2.0 } }",
      hlsl: "float gain(float x, float b) { return x < 0.5 ? bias(2.0 * x, b) / 2.0 : 1.0 - bias(2.0 - 2.0 * x, b) / 2.0; }",
      wgsl: "fn gain(x: f32, b: f32) -> f32 { return select(1.0 - bias(2.0 - 2.0 * x, b) / 2.0, bias(2.0 * x, b) / 2.0, x < 0.5); }",
      python:
        "def gain(x, b): return bias(2 * x, b) / 2 if x < 0.5 else 1 - bias(2 - 2 * x, b) / 2",
      css: "cubic-bezier(0.5, 1.5, 0.5, -0.5)",
      cpp: "float gain(float x, float b) { return x < 0.5f ? bias(2.0f * x, b) / 2.0f : 1.0f - bias(2.0f - 2.0f * x, b) / 2.0f; }",
      lua: "function gain(x, b) return x < 0.5 and bias(2 * x, b) / 2 or 1 - bias(2 - 2 * x, b) / 2 end",
      gdscript:
        "func gain(x: float, b: float) -> float: return bias(2 * x, b) / 2 if x < 0.5 else 1 - bias(2 - 2 * x, b) / 2",
      cuda: "__device__ float gain(float x, float b) { return x < 0.5f ? bias(2.0f * x, b) / 2.0f : 1.0f - bias(2.0f - 2.0f * x, b) / 2.0f; }",
      c: "double gain(double x, double b) { return x < 0.5 ? bias(2 * x, b) / 2 : 1 - bias(2 - 2 * x, b) / 2; }",
      json: '{"name": "Gain", "formula": "y = bias(2x, b)/2 if x < 0.5 else 1 - bias(2-2x, b)/2", "params": {"b": 0.7}}',
      metal:
        "float gain(float x, float b) { return x < 0.5 ? bias(2.0*x, b)/2.0 : 1.0 - bias(2.0 - 2.0*x, b)/2.0; }",
      opencl:
        "float gain(float x, float b) { return x < 0.5f ? bias(2.0f*x, b)/2.0f : 1.0f - bias(2.0f - 2.0f*x, b)/2.0f; }",
      unity:
        "public static float Gain(float x, float b) { return x < 0.5f ? Bias(2.0f * x, b) / 2.0f : 1.0f - Bias(2.0f - 2.0f * x, b) / 2.0f; }",
      matlab: "y = @(x, b) gainImpl(x, b);",
      excel: "=IF(A1<0.5,gainImpl(2*A1,A2)/2,1-gainImpl(2-2*A1,A2)/2)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["bias", "power", "smoothstep", "linear"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => gainCurve(p as GainParams),
    },
  };
}
