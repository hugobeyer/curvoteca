import { DEFAULT_SAMPLING, pulseKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { freq: 4 } as const;
export type PulseParams = { freq: number };

export function pulseCurve(
  params: PulseParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = pulseKernel(params.freq);
  return {
    id: "pulse",
    name: "Pulse",
    aliases: ["pulse train", "square pulse", "duty cycle"],
    family: "wave",
    summary: "Binary pulse train",
    formula: "y = sign(sin(2*pi*freq*x)) with 50% duty",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["pulse", "wave", "binary", "square"],
    useCases: ["clock-signals", "synth-modulation", "logic-sequences"],
    snippets: {
      equation: "y = (sin(2*pi*freq*x) > 0) ? 1 : -1",
      js: "function pulse(x, freq) { freq = freq == null ? 4 : freq; const phase = (x * freq) % 1; return phase < 0.5 ? 1 : -1; }",
      ts: "function pulse(x: number, freq: number = 4): number { const phase = (x * freq) % 1; return phase < 0.5 ? 1 : -1; }",
      glsl: "float pulse(float x, float freq) { float phase = fract(x * freq); return phase < 0.5 ? 1.0 : -1.0; }",
      vex: "float pulse(float x; float freq) { float phase = (x * freq) % 1; return phase < 0.5 ? 1 : -1; }",
      csharp:
        "float Pulse(float x, float freq = 4) { float phase = (x * freq) % 1; return phase < 0.5 ? 1 : -1; }",
      rust: "fn pulse(x: f64, freq: f64) -> f64 { let freq = if freq < 0.01 { 4.0 } else { freq }; let phase = (x * freq) % 1.0; if phase < 0.5 { 1.0 } else { -1.0 } }",
      hlsl: "float pulse(float x, float freq) { freq = (freq < 0.01) ? 4.0 : freq; float phase = frac(x * freq); return phase < 0.5 ? 1.0 : -1.0; }",
      wgsl: "fn pulse(x: f32, freq: f32) -> f32 { let freq = max(freq, 0.01); let phase = fract(x * freq); return select(-1.0, 1.0, phase < 0.5); }",
      python:
        "def pulse(x, freq=4): phase = (x * freq) % 1; return 1 if phase < 0.5 else -1",
      cpp: "float pulse(float x, float freq = 4.0f) { float phase = std::fmod(x * freq, 1.0f); return phase < 0.5f ? 1.0f : -1.0f; }",
      lua: "function pulse(x, freq) freq = freq or 4; local phase = (x * freq) % 1; return phase < 0.5 and 1 or -1 end",
      gdscript:
        "func pulse(x: float, freq: float = 4.0) -> float: var phase = fmod(x * freq, 1.0); return 1.0 if phase < 0.5 else -1.0",
      cuda: "__device__ float pulse(float x, float freq) { float phase = fmodf(x * freq, 1.0f); return phase < 0.5f ? 1.0f : -1.0f; }",
      c: "#include <math.h>\ndouble pulse(double x, double freq) { double phase = fmod(x * freq, 1.0); return phase < 0.5 ? 1.0 : -1.0; }",
      json: '{"name": "Pulse", "formula": "y = (x*freq) % 1 < 0.5 ? 1 : -1", "params": {"freq": 4}}',
      metal:
        "float pulse(float x, float freq) { float phase = fract(x * freq); return phase < 0.5 ? 1.0 : -1.0; }",
      opencl:
        "float pulse(float x, float freq) { float phase = fmod(x * freq, 1.0f); return phase < 0.5f ? 1.0f : -1.0f; }",
      unity:
        "public static float Pulse(float x, float freq) { float phase = Mathf.Repeat(x * freq, 1.0f); return phase < 0.5f ? 1.0f : -1.0f; }",
      shadertoy:
        "float phase = fract(x * freq); return phase < 0.5 ? 1.0 : -1.0;",
      matlab: "y = @(x, freq) pulseImpl(x, freq);",
      excel: "=IF(MOD(A1*A2,1)<0.5,1,-1)",
      desmos:
        "y=\\left(\\left(x\\cdot freq\\right)\\bmod1<0.5\\right)\\cdot1+\\left(\\left(x\\cdot freq\\right)\\bmod1\\geq0.5\\right)\\cdot\\left(-1\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["square-wave", "triangle-wave", "sawtooth-wave", "step"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => pulseCurve(p as PulseParams),
    },
  };
}
