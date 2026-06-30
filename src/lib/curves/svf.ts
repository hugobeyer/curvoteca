import { DEFAULT_SAMPLING, svfKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  cutoff: 0.3,
  resonance: 0.5,
  mode: 0,
} as const;
export type SvfParams = { cutoff: number; resonance: number; mode: number };

export function svfCurve(params: SvfParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = svfKernel(
    params.cutoff,
    params.resonance,
    params.mode,
  );
  return {
    id: "svf",
    name: "State-Variable Filter",
    family: "dsp",
    summary: "Multimode state-variable filter",
    formula: "y = lowpass/highpass/bandpass output",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["dsp", "filter", "svf", "audio", "synthesizer", "multimode"],
    useCases: [
      "audio-filtering",
      "multimode-filter",
      "synthesizer-filter",
      "sound-design",
    ],
    snippets: {
      equation: "y = lowpass/highpass/bandpass output",
      js: "function svf(x, c, r, m) { c = c == null ? 0.3 : c; r = r == null ? 0.5 : r; m = m == null ? 0 : m; var f = 2 * Math.sin(Math.PI * c); var q = 1 - r; var lp = 0, bp = 0, hp = 0; for (var i = 0; i < 10; i++) { hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1 ? lp : m < 2 ? bp : hp; }",
      ts: "function svf(x: number, c: number = 0.3, r: number = 0.5, m: number = 0): number { const f = 2 * Math.sin(Math.PI * c); const q = 1 - r; let lp = 0, bp = 0; for (let i = 0; i < 10; i++) { const hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1 ? lp : m < 2 ? bp : hp; }",
      glsl: "float svf(float x, float c, float r, float m) { c = (c < 0.01) ? 0.3 : c; r = (r < 0.01) ? 0.5 : r; float f = 2.0 * sin(3.14159265 * c); float q = 1.0 - r; float lp = 0.0, bp = 0.0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0 ? lp : m < 2.0 ? bp : hp; }",
      vex: "float svf(float x; float c; float r; float m) { if (c < 0.01) c = 0.3; if (r < 0.01) r = 0.5; float f = 2 * sin(M_PI * c); float q = 1 - r; float lp = 0, bp = 0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1 ? lp : m < 2 ? bp : hp; }",
      csharp:
        "float Svf(float x, float c = 0.3f, float r = 0.5f, float m = 0) { float f = 2 * MathF.Sin(MathF.PI * c); float q = 1 - r; float lp = 0, bp = 0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1 ? lp : m < 2 ? bp : hp; }",
      rust: "fn svf(x: f64, c: f64, r: f64, m: i32) -> f64 { let c = if c < 0.01 { 0.3 } else { c }; let r = if r < 0.01 { 0.5 } else { r }; let f = 2.0 * (std::f64::consts::PI * c).sin(); let q = 1.0 - r; let mut lp = 0.0; let mut bp = 0.0; for _ in 0..10 { let hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } if m < 1 { lp } else if m < 2 { bp } else { hp } }",
      hlsl: "float svf(float x, float c, float r, float m) { c = (c < 0.01) ? 0.3 : c; r = (r < 0.01) ? 0.5 : r; float f = 2.0 * sin(3.14159265 * c); float q = 1.0 - r; float lp = 0.0, bp = 0.0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0 ? lp : m < 2.0 ? bp : hp; }",
      wgsl: "fn svf(x: f32, c: f32, r: f32, m: f32) -> f32 { let c = max(c, 0.01); let r = max(r, 0.01); let f = 2.0 * sin(3.14159265 * c); let q = 1.0 - r; var lp = 0.0; var bp = 0.0; for (var i: i32 = 0; i < 10; i++) { let hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return select(select(bp, hp, m >= 2.0), lp, m < 1.0); }",
      python:
        "def svf(x, c=0.3, r=0.5, m=0): f = 2 * math.sin(math.pi * c); q = 1 - r; lp = 0; bp = 0; for _ in range(10): hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; return lp if m < 1 else bp if m < 2 else hp",
      cpp: "float svf(float x, float c = 0.3f, float r = 0.5f, float m = 0.0f) { float f = 2.0f * std::sin(M_PI * c); float q = 1.0f - r; float lp = 0.0f, bp = 0.0f; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0f ? lp : m < 2.0f ? bp : hp; }",
      lua: "function svf(x, c, r, m) c = c or 0.3 r = r or 0.5 m = m or 0 local f = 2 * math.sin(math.pi * c) local q = 1 - r local lp = 0 local bp = 0 for i = 1, 10 do local hp = x - lp - q * bp bp = bp + f * hp lp = lp + f * bp end if m < 1 then return lp elseif m < 2 then return bp else return hp end end",
      gdscript:
        "func svf(x: float, c: float = 0.3, r: float = 0.5, m: float = 0.0) -> float: var f = 2.0 * sin(PI * c); var q = 1.0 - r; var lp = 0.0; var bp = 0.0; for i in range(10): var hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; return lp if m < 1 else bp if m < 2 else hp",
      cuda: "__device__ float svf(float x, float c, float r, float m) { if (c < 0.01f) c = 0.3f; if (r < 0.01f) r = 0.5f; float f = 2.0f * sinf(3.14159265f * c); float q = 1.0f - r; float lp = 0.0f, bp = 0.0f; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0f ? lp : m < 2.0f ? bp : hp; }",
      c: "double svf(double x, double c, double r, double m) { if (c < 0.01) c = 0.3; if (r < 0.01) r = 0.5; double f = 2.0 * sin(M_PI * c); double q = 1.0 - r; double lp = 0.0, bp = 0.0; for (int i = 0; i < 10; i++) { double hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0 ? lp : m < 2.0 ? bp : hp; }",
      metal:
        "float svf(float x, float c, float r, float m) { c = (c < 0.01) ? 0.3 : c; r = (r < 0.01) ? 0.5 : r; float f = 2.0 * sin(3.14159265 * c); float q = 1.0 - r; float lp = 0.0, bp = 0.0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0 ? lp : m < 2.0 ? bp : hp; }",
      opencl:
        "float svf(float x, float c, float r, float m) { if (c < 0.01f) c = 0.3f; if (r < 0.01f) r = 0.5f; float f = 2.0f * sinf(3.14159265f * c); float q = 1.0f - r; float lp = 0.0f, bp = 0.0f; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1.0f ? lp : m < 2.0f ? bp : hp; }",
      unity:
        "public static float Svf(float x, float c = 0.3f, float r = 0.5f, float m = 0) { float f = 2 * Mathf.Sin(Mathf.PI * c); float q = 1 - r; float lp = 0, bp = 0; for (int i = 0; i < 10; i++) { float hp = x - lp - q * bp; bp = bp + f * hp; lp = lp + f * bp; } return m < 1 ? lp : m < 2 ? bp : hp; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["biquad", "resonant-filter", "compressor"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => svfCurve(p as SvfParams),
    },
  };
}
