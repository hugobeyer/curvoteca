import {
  DEFAULT_SAMPLING,
  squareWaveKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { freq: 4 } as const;
export type SquareWaveParams = { freq: number };

export function squareWaveCurve(
  params: SquareWaveParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = squareWaveKernel(params.freq);
  return {
    id: "square-wave",
    name: "Square Wave",
    aliases: ["square wave", "50% duty wave", "sign wave"],
    family: "wave",
    summary: "Square wave oscillator",
    formula: "y = sign(sin(2*pi*freq*x))",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["wave", "oscillator", "square", "sign"],
    useCases: ["audio-synthesis", "lfo", "clock-signals", "digital-signals"],
    snippets: {
      equation: "y = sin(2*pi*freq*x) < 0 ? -1 : 1",
      js: "function squareWave(x, freq) { freq = freq == null ? 4 : freq; return Math.sin(2 * Math.PI * freq * x) < 0 ? -1 : 1; }",
      ts: "function squareWave(x: number, freq: number = 4): number { return Math.sin(2 * Math.PI * freq * x) < 0 ? -1 : 1; }",
      glsl: "float squareWave(float x, float freq) { return sin(2.0 * 3.14159265 * freq * x) < 0.0 ? -1.0 : 1.0; }",
      vex: "float squareWave(float x; float freq) { return sin(2 * M_PI * freq * x) < 0 ? -1 : 1; }",
      csharp: "float SquareWave(float x, float freq = 4) { return MathF.Sin(2 * MathF.PI * freq * x) < 0 ? -1 : 1; }",
      rust: "fn square_wave(x: f64, freq: f64) -> f64 { let freq = if freq < 0.01 { 4.0 } else { freq }; if (2.0 * std::f64::consts::PI * freq * x).sin() < 0.0 { -1.0 } else { 1.0 } }",
      hlsl: "float squareWave(float x, float freq) { freq = (freq < 0.01) ? 4.0 : freq; return sin(2.0 * 3.14159265 * freq * x) < 0.0 ? -1.0 : 1.0; }",
      wgsl: "fn square_wave(x: f32, freq: f32) -> f32 { let freq = max(freq, 0.01); return select(1.0, -1.0, sin(2.0 * 3.14159265 * freq * x) < 0.0); }",
      python: "def square_wave(x, freq=4): import math; return -1 if math.sin(2 * math.pi * freq * x) < 0 else 1",
      cpp: "float squareWave(float x, float freq = 4.0f) { if (freq < 0.01f) freq = 4.0f; return std::sin(2.0f * M_PI * freq * x) < 0.0f ? -1.0f : 1.0f; }",
      lua: "function squareWave(x, freq) freq = freq or 4 if freq < 0.01 then freq = 4 end return math.sin(2 * math.pi * freq * x) < 0 and -1 or 1 end",
      gdscript: "func squareWave(x: float, freq: float = 4.0) -> float: if freq < 0.01: freq = 4.0; return -1.0 if sin(2.0 * PI * freq * x) < 0 else 1.0",
      cuda: "__device__ float squareWave(float x, float freq) { if (freq < 0.01f) freq = 4.0f; return sinf(2.0f * 3.14159265f * freq * x) < 0.0f ? -1.0f : 1.0f; }",
      c: "double squareWave(double x, double freq) { if (freq < 0.01) freq = 4.0; return sin(2.0 * M_PI * freq * x) < 0.0 ? -1.0 : 1.0; }",
      json: "{\"name\": \"Square Wave\", \"formula\": \"y = sin(2*pi*freq*x) < 0 ? -1 : 1\", \"params\": {\"freq\": 4}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["triangle-wave", "sawtooth-wave", "pulse", "step"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => squareWaveCurve(p as SquareWaveParams),
    },
  };
}
