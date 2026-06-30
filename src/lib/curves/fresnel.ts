import {
  DEFAULT_SAMPLING,
  fresnelKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { power: 5, bias: 0 } as const;
export type FresnelParams = { power: number; bias: number };

export function fresnelCurve(
  params: FresnelParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = fresnelKernel(params.power, params.bias);
  return {
    id: "fresnel",
    name: "Fresnel",
    aliases: ["fresnel effect", "rim light", "edge glow"],
    family: "trigonometric",
    summary: "Fresnel effect approximation for edge highlights",
    formula: "y = bias + (1 - bias) * (1 - t)^power",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["shader", "lighting", "fresnel", "edge", "rim"],
    useCases: [
      "shader-rim-lighting",
      "edge-detection",
      "view-dependent-effects",
    ],
    snippets: {
      equation: "y = bias + (1 - bias) * (1 - t)^power",
      js: "function fresnel(x, p, b) { p = p == null ? 5 : p; b = b == null ? 0 : b; return b + (1 - b) * Math.pow(1 - x, p); }",
      ts: "function fresnel(x: number, p: number = 5, b: number = 0): number { return b + (1 - b) * Math.pow(1 - x, p); }",
      glsl: "float fresnel(float x, float p, float b) { p = (p < 0.01) ? 5.0 : p; return b + (1.0 - b) * pow(1.0 - x, p); }",
      vex: "float fresnel(float x; float p; float b) { if (p < 0.01) p = 5; return b + (1 - b) * pow(1 - x, p); }",
      csharp:
        "float Fresnel(float x, float p = 5, float b = 0) { return b + (1 - b) * MathF.Pow(1 - x, p); }",
      rust: "fn fresnel(x: f64, p: f64, b: f64) -> f64 { b + (1.0 - b) * (1.0 - x).powf(p) }",
      hlsl: "float fresnel(float x, float p, float b) { p = (p < 0.01) ? 5.0 : p; return b + (1.0 - b) * pow(1.0 - x, p); }",
      wgsl: "fn fresnel(x: f32, p: f32, b: f32) -> f32 { let p = select(5.0, p, p >= 0.01); return b + (1.0 - b) * pow(1.0 - x, p); }",
      python:
        "def fresnel(x, p=5, b=0): p = p if p >= 0.01 else 5; return b + (1 - b) * math.pow(1 - x, p)",
      cpp: "float fresnel(float x, float p = 5.0f, float b = 0.0f) { return b + (1.0f - b) * std::pow(1.0f - x, p); }",
      lua: "function fresnel(x, p, b) p = p or 5; b = b or 0; return b + (1 - b) * math.pow(1 - x, p) end",
      gdscript:
        "func fresnel(x: float, p: float = 5.0, b: float = 0.0) -> float: return b + (1 - b) * pow(1 - x, p)",
      cuda: "__device__ float fresnel(float x, float p, float b) { return b + (1.0f - b) * powf(1.0f - x, p); }",
      c: "double fresnel(double x, double p, double b) { return b + (1 - b) * pow(1 - x, p); }",
      json: '{"name": "Fresnel", "formula": "y = bias + (1 - bias) * (1 - t)^power", "params": {"p": 5, "b": 0}}',
      metal:
        "float fresnel(float x, float p, float b) { p = (p < 0.01) ? 5.0 : p; return b + (1.0 - b) * pow(1.0 - x, p); }",
      opencl:
        "float fresnel(float x, float p, float b) { p = (p < 0.01f) ? 5.0f : p; return b + (1.0f - b) * pow(1.0f - x, p); }",
      unity:
        "public static float Fresnel(float x, float p, float b) { return b + (1.0f - b) * Mathf.Pow(1.0f - x, p); }",
      svelte:
        "export const fresnel = (x, p, b) => { p = p == null ? 5 : p; b = b == null ? 0 : b; return b + (1 - b) * Math.pow(1 - x, p); };",
      matlab: "y = @(x, p, b) b + (1 - b) * (1 - x) ^ p;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["power", "inverse-power", "exp-falloff"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => fresnelCurve(p as FresnelParams),
    },
  };
}
