import { DEFAULT_SAMPLING, softClipKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { threshold: 0.5 } as const;
export type SoftClipParams = { threshold: number };

export function softClipCurve(
  params: SoftClipParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = softClipKernel(params.threshold);
  return {
    id: "soft-clip",
    name: "Soft Clip",
    aliases: [],
    family: "distortion",
    summary: "Soft clipping waveshaper",
    formula: "y = (|t| < t) ? t : sign(t) * (t + (1-t) * tanh((|t|-t)/(1-t)))",
    continuity: "C1",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["audio", "distortion", "soft-clip", "saturation", "waveshaping"],
    useCases: [
      "audio-saturation",
      "soft-clipping",
      "tube-emulation",
      "waveshaping",
    ],
    snippets: {
      equation: "y = (|t| < t) ? t : sign(t) * (t + (1-t) * tanh((|t|-t)/(1-t)))",
      js: "function softClip(x, t) { t = t == null ? 0.5 : t; var a = Math.abs(x); return a < t ? x : Math.sign(x) * (t + (1 - t) * Math.tanh((a - t) / (1 - t))); }",
      ts: "function softClip(x: number, t: number = 0.5): number { const a = Math.abs(x); return a < t ? x : Math.sign(x) * (t + (1 - t) * Math.tanh((a - t) / (1 - t))); }",
      glsl: "float softClip(float x, float t) { t = (t == 0.0) ? 0.5 : t; float a = abs(x); return a < t ? x : sign(x) * (t + (1.0 - t) * tanh((a - t) / (1.0 - t))); }",
      vex: "float softClip(float x; float t) { if (t == 0) t = 0.5; float a = abs(x); return a < t ? x : sign(x) * (t + (1 - t) * tanh((a - t) / (1 - t))); }",
      csharp: "float SoftClip(float x, float t = 0.5f) { float a = Math.Abs(x); return a < t ? x : Math.Sign(x) * (t + (1 - t) * MathF.Tanh((a - t) / (1 - t))); }",
      rust: "fn soft_clip(x: f64, t: f64) -> f64 { let t = if t == 0.0 { 0.5 } else { t }; let a = x.abs(); if a < t { x } else { x.signum() * (t + (1.0 - t) * ((a - t) / (1.0 - t)).tanh()) } }",
      hlsl: "float softClip(float x, float t) { t = (t == 0.0) ? 0.5 : t; float a = abs(x); return a < t ? x : sign(x) * (t + (1.0 - t) * tanh((a - t) / (1.0 - t))); }",
      wgsl: "fn soft_clip(x: f32, t: f32) -> f32 { let t = select(0.5, t, t != 0.0); let a = abs(x); return select(sign(x) * (t + (1.0 - t) * tanh((a - t) / (1.0 - t))), x, a < t); }",
      python: "def soft_clip(x, t=0.5): t = t or 0.5; a = abs(x); return x if a < t else math.copysign(1, x) * (t + (1 - t) * math.tanh((a - t) / (1 - t)))",
      cpp: "float softClip(float x, float t = 0.5f) { float a = std::abs(x); return a < t ? x : (x < 0.0f ? -1.0f : 1.0f) * (t + (1.0f - t) * std::tanh((a - t) / (1.0f - t))); }",
      lua: "function softClip(x, t) t = t or 0.5 local a = math.abs(x) if a < t then return x end local s = x < 0 and -1 or 1 return s * (t + (1 - t) * math.tanh((a - t) / (1 - t))) end",
      gdscript: "func softClip(x: float, t: float = 0.5) -> float: var a = abs(x); if a < t: return x; var s = -1.0 if x < 0 else 1.0; return s * (t + (1.0 - t) * tanh((a - t) / (1.0 - t)))",
      cuda: "__device__ float softClip(float x, float t) { if (t == 0.0f) t = 0.5f; float a = fabsf(x); return a < t ? x : (x < 0.0f ? -1.0f : 1.0f) * (t + (1.0f - t) * tanhf((a - t) / (1.0f - t))); }",
      c: "double softClip(double x, double t) { if (t == 0) t = 0.5; double a = fabs(x); return a < t ? x : (x < 0 ? -1 : 1) * (t + (1.0 - t) * tanh((a - t) / (1.0 - t))); }",
      json: "{\"name\": \"Soft Clip\", \"formula\": \"y = (|x| < t) ? x : sign(x) * (t + (1 - t) * tanh((|x| - t) / (1 - t)))\", \"params\": {\"threshold\": 0.5}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["wavefolder", "cubic-distortion", "compressor"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => softClipCurve(p as SoftClipParams),
    },
  };
}
