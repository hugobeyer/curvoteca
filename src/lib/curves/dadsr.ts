import { DEFAULT_SAMPLING, dadsrKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  delay: 0.1,
  attack: 0.2,
  decay: 0.2,
  sustain: 0.3,
  release: 0.2,
  sustainLevel: 0.6,
} as const;
export type DadsrParams = {
  delay: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  sustainLevel: number;
};

export function dadsrCurve(
  params: DadsrParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = dadsrKernel(
    params.delay,
    params.attack,
    params.decay,
    params.sustain,
    params.release,
    params.sustainLevel,
  );
  return {
    id: "dadsr",
    name: "DADSR Envelope",
    family: "envelope",
    summary: "Delay-attack-decay-sustain-release envelope",
    formula: "y = delay → attack → decay → sustain → release",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: [
      "envelope",
      "audio",
      "delay",
      "attack",
      "decay",
      "sustain",
      "release",
    ],
    useCases: [
      "audio-envelope",
      "complex-shaping",
      "modulation",
      "sound-design",
    ],
    snippets: {
      equation: "y = delay → attack → decay → sustain → release",
      js: "function dadsr(x, d, a, de, s, r, sl) { d = d == null ? 0.1 : d; a = a == null ? 0.2 : a; de = de == null ? 0.2 : de; s = s == null ? 0.3 : s; r = r == null ? 0.2 : r; sl = sl == null ? 0.6 : sl; var t = x; if (t < d) return 0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1 - (1 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1 - t / r); }",
      ts: "function dadsr(x: number, d: number = 0.1, a: number = 0.2, de: number = 0.2, s: number = 0.3, r: number = 0.2, sl: number = 0.6): number { let t = x; if (t < d) return 0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1 - (1 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1 - t / r); }",
      glsl: "float dadsr(float x, float d, float a, float de, float s, float r, float sl) { d = (d < 0.01) ? 0.1 : d; a = (a < 0.01) ? 0.2 : a; de = (de < 0.01) ? 0.2 : de; s = (s < 0.01) ? 0.3 : s; r = (r < 0.01) ? 0.2 : r; float t = x; if (t < d) return 0.0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0 - (1.0 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0 - t / r); }",
      vex: "float dadsr(float x; float d; float a; float de; float s; float r; float sl) { if (d < 0.01) d = 0.1; if (a < 0.01) a = 0.2; if (de < 0.01) de = 0.2; if (s < 0.01) s = 0.3; if (r < 0.01) r = 0.2; float t = x; if (t < d) return 0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1 - (1 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1 - t / r); }",
      csharp:
        "float Dadsr(float x, float d = 0.1f, float a = 0.2f, float de = 0.2f, float s = 0.3f, float r = 0.2f, float sl = 0.6f) { float t = x; if (t < d) return 0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1 - (1 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1 - t / r); }",
      rust: "fn dadsr(x: f64, d: f64, a: f64, de: f64, s: f64, r: f64, sl: f64) -> f64 { let d = if d < 0.01 { 0.1 } else { d }; let a = if a < 0.01 { 0.2 } else { a }; let de = if de < 0.01 { 0.2 } else { de }; let s = if s < 0.01 { 0.3 } else { s }; let r = if r < 0.01 { 0.2 } else { r }; let mut t = x; if t < d { return 0.0; } t -= d; if t < a { return t / a; } t -= a; if t < de { return 1.0 - (1.0 - sl) * t / de; } t -= de; if t < s { return sl; } t -= s; sl * (1.0 - t / r) }",
      hlsl: "float dadsr(float x, float d, float a, float de, float s, float r, float sl) { d = (d < 0.01) ? 0.1 : d; a = (a < 0.01) ? 0.2 : a; de = (de < 0.01) ? 0.2 : de; s = (s < 0.01) ? 0.3 : s; r = (r < 0.01) ? 0.2 : r; float t = x; if (t < d) return 0.0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0 - (1.0 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0 - t / r); }",
      wgsl: "fn dadsr(x: f32, d: f32, a: f32, de: f32, s: f32, r: f32, sl: f32) -> f32 { let d = max(d, 0.01); let a = max(a, 0.01); let de = max(de, 0.01); let s = max(s, 0.01); let r = max(r, 0.01); var t = x; if (t < d) { return 0.0; } t -= d; if (t < a) { return t / a; } t -= a; if (t < de) { return 1.0 - (1.0 - sl) * t / de; } t -= de; if (t < s) { return sl; } t -= s; return sl * (1.0 - t / r); }",
      python:
        "def dadsr(x, d=0.1, a=0.2, de=0.2, s=0.3, r=0.2, sl=0.6): t = x; if t < d: return 0; t -= d; if t < a: return t / a; t -= a; if t < de: return 1 - (1 - sl) * t / de; t -= de; if t < s: return sl; t -= s; return sl * (1 - t / r)",
      cpp: "float dadsr(float x, float d = 0.1f, float a = 0.2f, float de = 0.2f, float s = 0.3f, float r = 0.2f, float sl = 0.6f) { float t = x; if (t < d) return 0.0f; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0f - (1.0f - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0f - t / r); }",
      lua: "function dadsr(x, d, a, de, s, r, sl) d = d or 0.1; a = a or 0.2; de = de or 0.2; s = s or 0.3; r = r or 0.2; sl = sl or 0.6; local t = x; if t < d then return 0 end; t = t - d; if t < a then return t / a end; t = t - a; if t < de then return 1 - (1 - sl) * t / de end; t = t - de; if t < s then return sl end; t = t - s; return sl * (1 - t / r) end",
      gdscript:
        "func dadsr(x: float, d: float = 0.1, a: float = 0.2, de: float = 0.2, s: float = 0.3, r: float = 0.2, sl: float = 0.6) -> float: var t = x; if t < d: return 0.0; t -= d; if t < a: return t / a; t -= a; if t < de: return 1.0 - (1.0 - sl) * t / de; t -= de; if t < s: return sl; t -= s; return sl * (1.0 - t / r)",
      cuda: "__device__ float dadsr(float x, float d, float a, float de, float s, float r, float sl) { float t = x; if (t < d) return 0.0f; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0f - (1.0f - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0f - t / r); }",
      c: "double dadsr(double x, double d, double a, double de, double s, double r, double sl) { double t = x; if (t < d) return 0.0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0 - (1.0 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0 - t / r); }",
      json: '{"name": "DADSR", "formula": "Delay-attack-decay-sustain-release envelope", "params": {"delay": 0.1, "attack": 0.2, "decay": 0.2, "sustain": 0.3, "release": 0.2, "sustainLevel": 0.6}}',
      metal:
        "float dadsr(float x, float d, float a, float de, float s, float r, float sl) { d = (d < 0.01) ? 0.1 : d; a = (a < 0.01) ? 0.2 : a; de = (de < 0.01) ? 0.2 : de; s = (s < 0.01) ? 0.3 : s; r = (r < 0.01) ? 0.2 : r; float t = x; if (t < d) return 0.0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0 - (1.0 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0 - t / r); }",
      opencl:
        "float dadsr(float x, float d, float a, float de, float s, float r, float sl) { float t = x; if (t < d) return 0.0f; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1.0f - (1.0f - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1.0f - t / r); }",
      unity:
        "public static float Dadsr(float x, float d = 0.1f, float a = 0.2f, float de = 0.2f, float s = 0.3f, float r = 0.2f, float sl = 0.6f) { float t = x; if (t < d) return 0; t -= d; if (t < a) return t / a; t -= a; if (t < de) return 1 - (1 - sl) * t / de; t -= de; if (t < s) return sl; t -= s; return sl * (1 - t / r); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["adsr", "ad", "ar", "asr"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => dadsrCurve(p as DadsrParams),
    },
  };
}
