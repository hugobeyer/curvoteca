import {
  DEFAULT_SAMPLING,
  triangleWaveKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { freq: 4 } as const;
export type TriangleWaveParams = { freq: number };

export function triangleWaveCurve(
  params: TriangleWaveParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = triangleWaveKernel(params.freq);
  return {
    id: "triangle-wave",
    name: "Triangle Wave",
    aliases: ["tri wave", "triangle wave", "saw wave bipolar"],
    family: "wave",
    summary: "Linear triangle oscillator",
    formula: "y = 2*|2*(x*freq mod 1) - 1| - 1",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["wave", "oscillator", "triangle", "linear"],
    useCases: ["audio-synthesis", "lfo", "oscillators", "test-signals"],
    snippets: {
      equation: "y = 2 * abs(2 * fract(x * freq) - 1) - 1",
      js: "function triangleWave(x, freq) { freq = freq == null ? 4 : freq; const f = (x * freq) % 1; return 2 * Math.abs(2 * f - 1) - 1; }",
      ts: "function triangleWave(x: number, freq: number = 4): number { const f = (x * freq) % 1; return 2 * Math.abs(2 * f - 1) - 1; }",
      glsl: "float triangleWave(float x, float freq) { float f = fract(x * freq); return 2.0 * abs(2.0 * f - 1.0) - 1.0; }",
      vex: "float triangleWave(float x; float freq) { float f = (x * freq) % 1; return 2 * abs(2 * f - 1) - 1; }",
      csharp: "float TriangleWave(float x, float freq = 4) { float f = (x * freq) % 1; return 2 * Math.Abs(2 * f - 1) - 1; }",
      rust: "fn triangle_wave(x: f64, freq: f64) -> f64 { let freq = if freq < 0.01 { 4.0 } else { freq }; let f = (x * freq) % 1.0; 2.0 * (2.0 * f - 1.0).abs() - 1.0 }",
      hlsl: "float triangleWave(float x, float freq) { freq = (freq < 0.01) ? 4.0 : freq; float f = frac(x * freq); return 2.0 * abs(2.0 * f - 1.0) - 1.0; }",
      wgsl: "fn triangle_wave(x: f32, freq: f32) -> f32 { let freq = max(freq, 0.01); let f = fract(x * freq); return 2.0 * abs(2.0 * f - 1.0) - 1.0; }",
      python: "def triangle_wave(x, freq=4): f = (x * freq) % 1; return 2 * abs(2 * f - 1) - 1",
      cpp: "float triangleWave(float x, float freq = 4.0f) { if (freq < 0.01f) freq = 4.0f; float f = std::fmod(x * freq, 1.0f); return 2.0f * std::abs(2.0f * f - 1.0f) - 1.0f; }",
      lua: "function triangleWave(x, freq) freq = freq or 4 if freq < 0.01 then freq = 4 end local f = (x * freq) % 1 return 2 * math.abs(2 * f - 1) - 1 end",
      gdscript: "func triangleWave(x: float, freq: float = 4.0) -> float: if freq < 0.01: freq = 4.0; var f = fmod(x * freq, 1.0); return 2.0 * abs(2.0 * f - 1.0) - 1.0",
      cuda: "__device__ float triangleWave(float x, float freq) { if (freq < 0.01f) freq = 4.0f; float f = fmodf(x * freq, 1.0f); return 2.0f * fabsf(2.0f * f - 1.0f) - 1.0f; }",
      c: "double triangleWave(double x, double freq) { if (freq < 0.01) freq = 4.0; double f = fmod(x * freq, 1.0); return 2.0 * fabs(2.0 * f - 1.0) - 1.0; }",
      json: "{\"name\": \"Triangle Wave\", \"formula\": \"y = 2 * |2 * fract(x * freq) - 1| - 1\", \"params\": {\"freq\": 4}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["square-wave", "sawtooth-wave", "pulse", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => triangleWaveCurve(p as TriangleWaveParams),
    },
  };
}
