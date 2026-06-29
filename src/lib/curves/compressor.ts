import {
  DEFAULT_SAMPLING,
  compressorKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { threshold: 0.5, ratio: 4, knee: 0.1 } as const;
export type CompressorParams = { threshold: number; ratio: number; knee: number };

export function compressorCurve(
  params: CompressorParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = compressorKernel(params.threshold, params.ratio, params.knee);
  return {
    id: "compressor",
    name: "Compressor",
    aliases: [],
    family: "dynamics",
    summary: "Dynamic range compressor curve",
    formula: "y = piecewise linear with knee smoothing",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["audio", "dynamics", "compressor", "leveling", "dsp"],
    useCases: [
      "audio-dynamics",
      "compression-curve",
      "level-reduction",
      "mastering",
    ],
    snippets: {
      equation: "y = piecewise linear with knee smoothing",
      js: "function compressor(x, t, r, k) { t = t == null ? 0.5 : t; r = r == null ? 4 : r; k = k == null ? 0.1 : k; if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; var u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x); }",
      ts: "function compressor(x: number, t: number = 0.5, r: number = 4, k: number = 0.1): number { if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; const u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x); }",
      glsl: "float compressor(float x, float t, float r, float k) { t = (t == 0.0) ? 0.5 : t; r = (r == 0.0) ? 4.0 : r; k = (k == 0.0) ? 0.1 : k; if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2.0 * k); return x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x); }",
      vex: "float compressor(float x; float t; float r; float k) { if (t == 0) t = 0.5; if (r == 0) r = 4; if (k == 0) k = 0.1; if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x); }",
      csharp: "float Compressor(float x, float t = 0.5f, float r = 4, float k = 0.1f) { if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x); }",
      rust: "fn compressor(x: f64, t: f64, r: f64, k: f64) -> f64 { let t = if t == 0.0 { 0.5 } else { t }; let r = if r == 0.0 { 4.0 } else { r }; let k = if k == 0.0 { 0.1 } else { k }; if x < t - k { return x; } if x > t + k { return t + (x - t) / r; } let u = (x - t + k) / (2.0 * k); x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x) }",
      hlsl: "float compressor(float x, float t, float r, float k) { t = (t == 0.0) ? 0.5 : t; r = (r == 0.0) ? 4.0 : r; k = (k == 0.0) ? 0.1 : k; if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2.0 * k); return x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x); }",
      wgsl: "fn compressor(x: f32, t: f32, r: f32, k: f32) -> f32 { let t = select(0.5, t, t != 0.0); let r = select(4.0, r, r != 0.0); let k = select(0.1, k, k != 0.0); if (x < t - k) { return x; } if (x > t + k) { return t + (x - t) / r; } let u = (x - t + k) / (2.0 * k); return x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x); }",
      python: "def compressor(x, t=0.5, r=4, k=0.1): t = t or 0.5; r = r or 4; k = k or 0.1; if x < t - k: return x; if x > t + k: return t + (x - t) / r; u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x)",
      cpp: "float compressor(float x, float t = 0.5f, float r = 4.0f, float k = 0.1f) { if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2.0f * k); return x + (u * u * (3.0f - 2.0f * u)) * ((t + (x - t) / r) - x); }",
      lua: "function compressor(x, t, r, k) t = t or 0.5; r = r or 4; k = k or 0.1; if x < t - k then return x end; if x > t + k then return t + (x - t) / r end; local u = (x - t + k) / (2 * k); return x + (u * u * (3 - 2 * u)) * ((t + (x - t) / r) - x) end",
      gdscript: "func compressor(x: float, t: float = 0.5, r: float = 4.0, k: float = 0.1) -> float: if x < t - k: return x; if x > t + k: return t + (x - t) / r; var u = (x - t + k) / (2.0 * k); return x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x)",
      cuda: "__device__ float compressor(float x, float t, float r, float k) { if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; float u = (x - t + k) / (2.0f * k); return x + (u * u * (3.0f - 2.0f * u)) * ((t + (x - t) / r) - x); }",
      c: "double compressor(double x, double t, double r, double k) { if (x < t - k) return x; if (x > t + k) return t + (x - t) / r; double u = (x - t + k) / (2.0 * k); return x + (u * u * (3.0 - 2.0 * u)) * ((t + (x - t) / r) - x); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["soft-clip", "reinhard", "gain"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => compressorCurve(p as CompressorParams),
    },
  };
}
