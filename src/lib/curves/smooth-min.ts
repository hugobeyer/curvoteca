import {
  DEFAULT_SAMPLING,
  smoothminKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { k: 1 } as const;
export type SmoothMinParams = { k: number };

export function smoothMinCurve(
  params: SmoothMinParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = smoothminKernel(params.k);
  return {
    id: "smooth-min",
    name: "Smooth Min",
    aliases: ["soft minimum", "smooth min", "log-sum-exp min"],
    family: "utility",
    summary: "Smooth minimum of two values",
    formula: "y = -ln(e^(-k*t) + e^(-k*(1-t))) / k",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["utility", "smooth", "blending", "rounding"],
    useCases: [
      "smooth-blending",
      "soft-edges",
      "sdf-combination",
      "audio-crossfade",
    ],
    snippets: {
      equation: "y = -ln(e^(-k*t) + e^(-k*(1-t))) / k",
      js: "function smoothMin(x, k) { k = k == null ? 1 : k; if (k === 0) return Math.min(x, 1 - x); return -Math.log(Math.exp(-k * x) + Math.exp(-k * (1 - x))) / k; }",
      ts: "function smoothMin(x: number, k: number = 1): number { if (k === 0) return Math.min(x, 1 - x); return -Math.log(Math.exp(-k * x) + Math.exp(-k * (1 - x))) / k; }",
      glsl: "float smoothMin(float x, float k) { k = (k == 0.0) ? 1.0 : k; return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k; }",
      vex: "float smoothMin(float x; float k) { if (k == 0) k = 1; return -log(exp(-k * x) + exp(-k * (1 - x))) / k; }",
      csharp:
        "float SmoothMin(float x, float k = 1) { k = k == 0 ? 1 : k; return -MathF.Log(MathF.Exp(-k * x) + MathF.Exp(-k * (1 - x))) / k; }",
      rust: "fn smooth_min(x: f64, k: f64) -> f64 { let k = if k == 0.0 { 1.0 } else { k }; -( (-k * x).exp() + (-k * (1.0 - x)).exp() ).ln() / k }",
      hlsl: "float smoothMin(float x, float k) { k = (k == 0.0) ? 1.0 : k; return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k; }",
      wgsl: "fn smooth_min(x: f32, k: f32) -> f32 { let k = select(1.0, k, k != 0.0); return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k; }",
      python:
        "def smooth_min(x, k=1): k = k or 1; return -math.log(math.exp(-k * x) + math.exp(-k * (1 - x))) / k",
      cpp: "float smoothMin(float x, float k = 1.0f) { if (k == 0.0f) k = 1.0f; return -std::log(std::exp(-k * x) + std::exp(-k * (1.0f - x))) / k; }",
      lua: "function smoothMin(x, k) k = k or 1 if k == 0 then k = 1 end return -math.log(math.exp(-k * x) + math.exp(-k * (1 - x))) / k end",
      gdscript:
        "func smoothMin(x: float, k: float = 1.0) -> float: if k == 0: k = 1.0; return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k",
      cuda: "__device__ float smoothMin(float x, float k) { if (k == 0.0f) k = 1.0f; return -logf(expf(-k * x) + expf(-k * (1.0f - x))) / k; }",
      c: "double smoothMin(double x, double k) { if (k == 0) k = 1; return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k; }",
      json: '{"name": "Smooth Min", "formula": "y = -ln(e^(-k*t) + e^(-k*(1-t))) / k", "params": {"k": 1}}',
      metal:
        "float smoothMin(float x, float k) { k = (k == 0.0) ? 1.0 : k; return -log(exp(-k * x) + exp(-k * (1.0 - x))) / k; }",
      opencl:
        "float smoothMin(float x, float k) { if (k == 0.0f) k = 1.0f; return -log(exp(-k * x) + exp(-k * (1.0f - x))) / k; }",
      unity:
        "public static float SmoothMin(float x, float k = 1) { k = k == 0 ? 1 : k; return -Mathf.Log(Mathf.Exp(-k * x) + Mathf.Exp(-k * (1 - x))) / k; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smooth-max", "gain", "bias"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => smoothMinCurve(p as SmoothMinParams),
    },
  };
}
