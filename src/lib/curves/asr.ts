import {
  DEFAULT_SAMPLING,
  asrKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  attack: 0.2,
  sustain: 0.5,
  release: 0.3,
  sustainLevel: 0.7,
} as const;
export type AsrParams = {
  attack: number;
  sustain: number;
  release: number;
  sustainLevel: number;
};

export function asrCurve(
  params: AsrParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = asrKernel(
    params.attack,
    params.sustain,
    params.release,
    params.sustainLevel,
  );
  return {
    id: "asr",
    name: "ASR Envelope",
    family: "envelope",
    summary: "Attack-sustain-release envelope",
    formula: "y = (t < a) ? t/a : (t < a+s) ? sl : sl * (1 - (t-a-s)/r)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["envelope", "audio", "attack", "sustain", "release", "gate"],
    useCases: [
      "audio-envelope",
      "gate-shaping",
      "sustained-notes",
      "modulation",
    ],
    snippets: {
      equation: "y = (t < a) ? t/a : (t < a+s) ? sl : sl * (1 - (t-a-s)/r)",
      js: "function asr(x, a, s, r, sl) { a = a == null ? 0.2 : a; s = s == null ? 0.5 : s; r = r == null ? 0.3 : r; sl = sl == null ? 0.7 : sl; if (x < a) return x / a; if (x < a + s) return sl; return sl * (1 - (x - a - s) / r); }",
      ts: "function asr(x: number, a: number = 0.2, s: number = 0.5, r: number = 0.3, sl: number = 0.7): number { if (x < a) return x / a; if (x < a + s) return sl; return sl * (1 - (x - a - s) / r); }",
      glsl: "float asr(float x, float a, float s, float r, float sl) { a = (a < 0.01) ? 0.2 : a; s = (s < 0.01) ? 0.5 : s; r = (r < 0.01) ? 0.3 : r; if (x < a) return x / a; if (x < a + s) return sl; return sl * (1.0 - (x - a - s) / r); }",
      vex: "float asr(float x; float a; float s; float r; float sl) { if (a < 0.01) a = 0.2; if (s < 0.01) s = 0.5; if (r < 0.01) r = 0.3; if (x < a) return x / a; if (x < a + s) return sl; return sl * (1 - (x - a - s) / r); }",
      csharp: "float Asr(float x, float a = 0.2f, float s = 0.5f, float r = 0.3f, float sl = 0.7f) { if (x < a) return x / a; if (x < a + s) return sl; return sl * (1 - (x - a - s) / r); }",
      rust: "fn asr(x: f64, a: f64, s: f64, r: f64, sl: f64) -> f64 { let a = if a < 0.01 { 0.2 } else { a }; let s = if s < 0.01 { 0.5 } else { s }; let r = if r < 0.01 { 0.3 } else { r }; if x < a { x / a } else if x < a + s { sl } else { sl * (1.0 - (x - a - s) / r) } }",
      hlsl: "float asr(float x, float a, float s, float r, float sl) { a = (a < 0.01) ? 0.2 : a; s = (s < 0.01) ? 0.5 : s; r = (r < 0.01) ? 0.3 : r; if (x < a) return x / a; if (x < a + s) return sl; return sl * (1.0 - (x - a - s) / r); }",
      wgsl: "fn asr(x: f32, a: f32, s: f32, r: f32, sl: f32) -> f32 { let a = max(a, 0.01); let s = max(s, 0.01); let r = max(r, 0.01); if (x < a) { return x / a; } if (x < a + s) { return sl; } return sl * (1.0 - (x - a - s) / r); }",
      python: "def asr(x, a=0.2, s=0.5, r=0.3, sl=0.7): if x < a: return x / a; if x < a + s: return sl; return sl * (1 - (x - a - s) / r)",
      cpp: "float asr(float x, float a = 0.2f, float s = 0.5f, float r = 0.3f, float sl = 0.7f) { if (x < a) return x / a; if (x < a + s) return sl; return sl * (1.0f - (x - a - s) / r); }",
      lua: "function asr(x, a, s, r, sl) a = a or 0.2 s = s or 0.5 r = r or 0.3 sl = sl or 0.7 if x < a then return x / a end if x < a + s then return sl end return sl * (1 - (x - a - s) / r) end",
      gdscript: "func asr(x: float, a: float = 0.2, s: float = 0.5, r: float = 0.3, sl: float = 0.7) -> float: if x < a: return x / a; if x < a + s: return sl; return sl * (1 - (x - a - s) / r)",
      cuda: "__device__ float asr(float x, float a, float s, float r, float sl) { if (x < a) return x / a; if (x < a + s) return sl; return sl * (1.0f - (x - a - s) / r); }",
      c: "double asr(double x, double a, double s, double r, double sl) { if (x < a) return x / a; if (x < a + s) return sl; return sl * (1.0 - (x - a - s) / r); }",
      json: '{"name": "ASR Envelope", "formula": "y = (t < a) ? t/a : (t < a+s) ? sl : sl * (1 - (t-a-s)/r)", "params": {"attack": 0.2, "sustain": 0.5, "release": 0.3, "sustainLevel": 0.7}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["adsr", "ad", "ar", "dadsr"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => asrCurve(p as AsrParams),
    },
  };
}
