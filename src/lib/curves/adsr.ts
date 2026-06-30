import { DEFAULT_SAMPLING, adsrKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  attack: 0.1,
  decay: 0.2,
  sustain: 0.5,
  release: 0.3,
  sustainLevel: 0.6,
} as const;
export type AdsrParams = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  sustainLevel: number;
};

export function adsrCurve(params: AdsrParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = adsrKernel(
    params.attack,
    params.decay,
    params.sustain,
    params.release,
    params.sustainLevel,
  );
  return {
    id: "adsr",
    name: "ADSR",
    aliases: ["attack-decay-sustain-release", "envelope", "dynamic envelope"],
    family: "envelope",
    summary: "Attack-decay-sustain-release envelope",
    formula: "Piecewise linear envelope over [0,1]",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["envelope", "audio", "synthesis", "modulation", "dynamic"],
    useCases: [
      "audio-envelope",
      "modulation-shaping",
      "gain-profiling",
      "animation-timing",
    ],
    snippets: {
      equation: "Piecewise linear envelope over [0,1]",
      js: "function adsr(x, a, d, s, r, sl) { a = a == null ? 0.1 : a; d = d == null ? 0.2 : d; s = s == null ? 0.5 : s; r = r == null ? 0.3 : r; sl = sl == null ? 0.6 : sl; if (x < a) return x / a; if (x < a + d) return 1 - (1 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1) return sl * (1 - (x - a - d - s) / r); return 0; }",
      ts: "function adsr(x: number, a: number = 0.1, d: number = 0.2, s: number = 0.5, r: number = 0.3, sl: number = 0.6): number { if (x < a) return x / a; if (x < a + d) return 1 - (1 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1) return sl * (1 - (x - a - d - s) / r); return 0; }",
      glsl: "float adsr(float x, float a, float d, float s, float r, float sl) { a = (a == 0.0) ? 0.1 : a; d = (d == 0.0) ? 0.2 : d; s = (s == 0.0) ? 0.5 : s; r = (r == 0.0) ? 0.3 : r; sl = (sl < 0.01) ? 0.6 : sl; if (x < a) return x / a; if (x < a + d) return 1.0 - (1.0 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0) return sl * (1.0 - (x - a - d - s) / r); return 0.0; }",
      vex: "float adsr(float x; float a; float d; float s; float r; float sl) { if (a == 0) a = 0.1; if (d == 0) d = 0.2; if (s == 0) s = 0.5; if (r == 0) r = 0.3; if (sl < 0.01) sl = 0.6; if (x < a) return x / a; if (x < a + d) return 1 - (1 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1) return sl * (1 - (x - a - d - s) / r); return 0; }",
      csharp:
        "float Adsr(float x, float a = 0.1f, float d = 0.2f, float s = 0.5f, float r = 0.3f, float sl = 0.6f) { if (x < a) return x / a; if (x < a + d) return 1 - (1 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1) return sl * (1 - (x - a - d - s) / r); return 0; }",
      rust: "fn adsr(x: f64, a: f64, d: f64, s: f64, r: f64, sl: f64) -> f64 { let a = if a == 0.0 { 0.1 } else { a }; let d = if d == 0.0 { 0.2 } else { d }; let s = if s == 0.0 { 0.5 } else { s }; let r = if r == 0.0 { 0.3 } else { r }; let sl = if sl < 0.01 { 0.6 } else { sl }; if x < a { return x / a; } if x < a + d { return 1.0 - (1.0 - sl) * (x - a) / d; } if x < a + d + s { return sl; } if x < 1.0 { return sl * (1.0 - (x - a - d - s) / r); } 0.0 }",
      hlsl: "float adsr(float x, float a, float d, float s, float r, float sl) { a = (a == 0.0) ? 0.1 : a; d = (d == 0.0) ? 0.2 : d; s = (s == 0.0) ? 0.5 : s; r = (r == 0.0) ? 0.3 : r; sl = (sl < 0.01) ? 0.6 : sl; if (x < a) return x / a; if (x < a + d) return 1.0 - (1.0 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0) return sl * (1.0 - (x - a - d - s) / r); return 0.0; }",
      wgsl: "fn adsr(x: f32, a: f32, d: f32, s: f32, r: f32, sl: f32) -> f32 { let a = select(0.1, a, a != 0.0); let d = select(0.2, d, d != 0.0); let s = select(0.5, s, s != 0.0); let r = select(0.3, r, r != 0.0); let sl = select(0.6, sl, sl >= 0.01); if (x < a) { return x / a; } if (x < a + d) { return 1.0 - (1.0 - sl) * (x - a) / d; } if (x < a + d + s) { return sl; } if (x < 1.0) { return sl * (1.0 - (x - a - d - s) / r); } return 0.0; }",
      python:
        "def adsr(x, a=0.1, d=0.2, s=0.5, r=0.3, sl=0.6): a = a or 0.1; d = d or 0.2; s = s or 0.5; r = r or 0.3; sl = sl if sl >= 0.01 else 0.6; if x < a: return x / a; if x < a + d: return 1 - (1 - sl) * (x - a) / d; if x < a + d + s: return sl; if x < 1: return sl * (1 - (x - a - d - s) / r); return 0",
      cpp: "float adsr(float x, float a = 0.1f, float d = 0.2f, float s = 0.5f, float r = 0.3f, float sl = 0.6f) { if (x < a) return x / a; if (x < a + d) return 1.0f - (1.0f - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0f) return sl * (1.0f - (x - a - d - s) / r); return 0.0f; }",
      lua: "function adsr(x, a, d, s, r, sl) a = a or 0.1 d = d or 0.2 s = s or 0.5 r = r or 0.3 sl = sl or 0.6 if x < a then return x / a end if x < a + d then return 1 - (1 - sl) * (x - a) / d end if x < a + d + s then return sl end if x < 1 then return sl * (1 - (x - a - d - s) / r) end return 0 end",
      gdscript:
        "func adsr(x: float, a: float = 0.1, d: float = 0.2, s: float = 0.5, r: float = 0.3, sl: float = 0.6) -> float: if x < a: return x / a; if x < a + d: return 1 - (1 - sl) * (x - a) / d; if x < a + d + s: return sl; if x < 1: return sl * (1 - (x - a - d - s) / r); return 0",
      cuda: "__device__ float adsr(float x, float a, float d, float s, float r, float sl) { if (x < a) return x / a; if (x < a + d) return 1.0f - (1.0f - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0f) return sl * (1.0f - (x - a - d - s) / r); return 0.0f; }",
      c: "double adsr(double x, double a, double d, double s, double r, double sl) { if (x < a) return x / a; if (x < a + d) return 1.0 - (1.0 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0) return sl * (1.0 - (x - a - d - s) / r); return 0.0; }",
      json: '{"name": "ADSR", "formula": "Piecewise linear envelope", "params": {"attack": 0.1, "decay": 0.2, "sustain": 0.5, "release": 0.3, "sustainLevel": 0.6}}',
      metal:
        "float adsr(float x, float a, float d, float s, float r, float sl) { a = (a == 0.0) ? 0.1 : a; d = (d == 0.0) ? 0.2 : d; s = (s == 0.0) ? 0.5 : s; r = (r == 0.0) ? 0.3 : r; sl = (sl < 0.01) ? 0.6 : sl; if (x < a) return x / a; if (x < a + d) return 1.0 - (1.0 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0) return sl * (1.0 - (x - a - d - s) / r); return 0.0; }",
      opencl:
        "float adsr(float x, float a, float d, float s, float r, float sl) { if (x < a) return x / a; if (x < a + d) return 1.0f - (1.0f - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1.0f) return sl * (1.0f - (x - a - d - s) / r); return 0.0f; }",
      unity:
        "public static float Adsr(float x, float a = 0.1f, float d = 0.2f, float s = 0.5f, float r = 0.3f, float sl = 0.6f) { if (x < a) return x / a; if (x < a + d) return 1 - (1 - sl) * (x - a) / d; if (x < a + d + s) return sl; if (x < 1) return sl * (1 - (x - a - d - s) / r); return 0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["ad", "ar", "dadsr", "asr"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => adsrCurve(p as AdsrParams),
    },
  };
}
