import {
  DEFAULT_SAMPLING,
  resonantFilterKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { cutoff: 0.3, resonance: 0.5 } as const;
export type ResonantFilterParams = { cutoff: number; resonance: number };

export function resonantFilterCurve(
  params: ResonantFilterParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = resonantFilterKernel(params.cutoff, params.resonance);
  return {
    id: "resonant-filter",
    name: "Resonant Filter",
    aliases: [],
    family: "dsp",
    summary: "Resonant filter magnitude response",
    formula: "y = 1 / sqrt((1 - (f/fc)^2)^2 + (2*R*f/fc)^2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 10],
    tags: ["dsp", "filter", "resonant", "audio", "synthesizer"],
    useCases: [
      "audio-filtering",
      "synthesizer-filter",
      "resonant-peak",
      "sound-design",
    ],
    snippets: {
      equation: "y = 1 / sqrt((1 - (f/fc)^2)^2 + (2*R*f/fc)^2)",
      js: "function resonantFilter(x, fc, R) { fc = fc == null ? 0.3 : fc; R = R == null ? 0.5 : R; var ratio = x / fc; return 1 / Math.sqrt(Math.pow(1 - ratio * ratio, 2) + Math.pow(2 * R * ratio, 2)); }",
      ts: "function resonantFilter(x: number, fc: number = 0.3, R: number = 0.5): number { const ratio = x / fc; return 1 / Math.sqrt(Math.pow(1 - ratio * ratio, 2) + Math.pow(2 * R * ratio, 2)); }",
      glsl: "float resonantFilter(float x, float fc, float R) { fc = (fc == 0.0) ? 0.3 : fc; R = (R == 0.0) ? 0.5 : R; float ratio = x / fc; return 1.0 / sqrt(pow(1.0 - ratio * ratio, 2.0) + pow(2.0 * R * ratio, 2.0)); }",
      vex: "float resonantFilter(float x; float fc; float R) { if (fc == 0) fc = 0.3; if (R == 0) R = 0.5; float ratio = x / fc; return 1 / sqrt(pow(1 - ratio * ratio, 2) + pow(2 * R * ratio, 2)); }",
      csharp: "float ResonantFilter(float x, float fc = 0.3f, float R = 0.5f) { float ratio = x / fc; return 1 / MathF.Sqrt(MathF.Pow(1 - ratio * ratio, 2) + MathF.Pow(2 * R * ratio, 2)); }",
      rust: "fn resonant_filter(x: f64, fc: f64, R: f64) -> f64 { let fc = if fc == 0.0 { 0.3 } else { fc }; let R = if R == 0.0 { 0.5 } else { R }; let ratio = x / fc; 1.0 / ((1.0 - ratio * ratio).powi(2) + (2.0 * R * ratio).powi(2)).sqrt() }",
      hlsl: "float resonantFilter(float x, float fc, float R) { fc = (fc == 0.0) ? 0.3 : fc; R = (R == 0.0) ? 0.5 : R; float ratio = x / fc; return 1.0 / sqrt(pow(1.0 - ratio * ratio, 2.0) + pow(2.0 * R * ratio, 2.0)); }",
      wgsl: "fn resonant_filter(x: f32, fc: f32, R: f32) -> f32 { let fc = select(0.3, fc, fc != 0.0); let R = select(0.5, R, R != 0.0); let ratio = x / fc; return 1.0 / sqrt(pow(1.0 - ratio * ratio, 2.0) + pow(2.0 * R * ratio, 2.0)); }",
      python: "def resonant_filter(x, fc=0.3, R=0.5): fc = fc or 0.3; R = R or 0.5; ratio = x / fc; return 1 / math.sqrt((1 - ratio * ratio) ** 2 + (2 * R * ratio) ** 2)",
      cpp: "float resonantFilter(float x, float fc = 0.3f, float R = 0.5f) { float ratio = x / fc; return 1.0f / std::sqrt(std::pow(1.0f - ratio * ratio, 2.0f) + std::pow(2.0f * R * ratio, 2.0f)); }",
      lua: "function resonantFilter(x, fc, R) fc = fc or 0.3; R = R or 0.5; local ratio = x / fc; return 1 / math.sqrt((1 - ratio * ratio) ^ 2 + (2 * R * ratio) ^ 2) end",
      gdscript: "func resonantFilter(x: float, fc: float = 0.3, R: float = 0.5) -> float: var ratio = x / fc; return 1.0 / sqrt(pow(1.0 - ratio * ratio, 2.0) + pow(2.0 * R * ratio, 2.0))",
      cuda: "__device__ float resonantFilter(float x, float fc, float R) { float ratio = x / fc; return 1.0f / sqrtf(powf(1.0f - ratio * ratio, 2.0f) + powf(2.0f * R * ratio, 2.0f)); }",
      c: "double resonantFilter(double x, double fc, double R) { double ratio = x / fc; return 1.0 / sqrt(pow(1.0 - ratio * ratio, 2.0) + pow(2.0 * R * ratio, 2.0)); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["biquad", "svf", "compressor"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => resonantFilterCurve(p as ResonantFilterParams),
    },
  };
}
