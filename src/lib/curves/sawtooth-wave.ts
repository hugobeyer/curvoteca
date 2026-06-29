import {
  DEFAULT_SAMPLING,
  sawtoothWaveKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { freq: 4 } as const;
export type SawtoothWaveParams = { freq: number };

export function sawtoothWaveCurve(
  params: SawtoothWaveParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sawtoothWaveKernel(params.freq);
  return {
    id: "sawtooth-wave",
    name: "Sawtooth Wave",
    aliases: ["saw wave", "ramp wave", "ascending saw"],
    family: "wave",
    summary: "Ramp oscillator",
    formula: "y = (x * freq) mod 1",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["wave", "oscillator", "sawtooth", "ramp"],
    useCases: ["audio-synthesis", "lfo", "oscillators", "test-signals"],
    snippets: {
      equation: "y = fract(x * freq) * 2 - 1",
      js: "function sawtoothWave(x, freq) { freq = freq == null ? 4 : freq; return ((x * freq) % 1) * 2 - 1; }",
      ts: "function sawtoothWave(x: number, freq: number = 4): number { return ((x * freq) % 1) * 2 - 1; }",
      glsl: "float sawtoothWave(float x, float freq) { return fract(x * freq) * 2.0 - 1.0; }",
      vex: "float sawtoothWave(float x; float freq) { return ((x * freq) % 1) * 2 - 1; }",
      csharp: "float SawtoothWave(float x, float freq = 4) { return ((x * freq) % 1) * 2 - 1; }",
      rust: "fn sawtooth_wave(x: f64, freq: f64) -> f64 { let freq = if freq < 0.01 { 4.0 } else { freq }; ((x * freq) % 1.0) * 2.0 - 1.0 }",
      hlsl: "float sawtoothWave(float x, float freq) { freq = (freq < 0.01) ? 4.0 : freq; return frac(x * freq) * 2.0 - 1.0; }",
      wgsl: "fn sawtooth_wave(x: f32, freq: f32) -> f32 { let freq = max(freq, 0.01); return fract(x * freq) * 2.0 - 1.0; }",
      python: "def sawtooth_wave(x, freq=4): return ((x * freq) % 1) * 2 - 1",
      cpp: "float sawtoothWave(float x, float freq = 4.0f) { return std::fmod(x * freq, 1.0f) * 2.0f - 1.0f; }",
      lua: "function sawtoothWave(x, freq) freq = freq or 4; return ((x * freq) % 1) * 2 - 1 end",
      gdscript: "func sawtoothWave(x: float, freq: float = 4.0) -> float: return fmod(x * freq, 1.0) * 2.0 - 1.0",
      cuda: "__device__ float sawtoothWave(float x, float freq) { return fmodf(x * freq, 1.0f) * 2.0f - 1.0f; }",
      c: "double sawtoothWave(double x, double freq) { return fmod(x * freq, 1.0) * 2.0 - 1.0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["triangle-wave", "square-wave", "pulse", "linear"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sawtoothWaveCurve(p as SawtoothWaveParams),
    },
  };
}
