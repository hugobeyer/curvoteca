import { DEFAULT_SAMPLING, adKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { attack: 0.3, decay: 0.4 } as const;
export type AdParams = { attack: number; decay: number };

export function adCurve(params: AdParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = adKernel(params.attack, params.decay);
  return {
    id: "ad",
    name: "AD Envelope",
    aliases: ["attack-decay", "percussion envelope"],
    family: "envelope",
    summary: "Attack-decay envelope",
    formula: "y = (t < a) ? t/a : 1 - (t-a)/d",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["envelope", "audio", "attack", "decay", "percussion"],
    useCases: [
      "audio-envelope",
      "percussion-shaping",
      "modulation",
      "transient-design",
    ],
    snippets: {
      equation: "y = (t < a) ? t/a : 1 - (t-a)/d",
      js: "function ad(x, a, d) { a = a == null ? 0.3 : a; d = d == null ? 0.4 : d; return x < a ? x / a : 1 - (x - a) / d; }",
      ts: "function ad(x: number, a: number = 0.3, d: number = 0.4): number { return x < a ? x / a : 1 - (x - a) / d; }",
      glsl: "float ad(float x, float a, float d) { a = (a < 0.01) ? 0.3 : a; d = (d < 0.01) ? 0.4 : d; return x < a ? x / a : 1.0 - (x - a) / d; }",
      vex: "float ad(float x; float a; float d) { if (a < 0.01) a = 0.3; if (d < 0.01) d = 0.4; return x < a ? x / a : 1 - (x - a) / d; }",
      csharp:
        "float Ad(float x, float a = 0.3f, float d = 0.4f) { return x < a ? x / a : 1 - (x - a) / d; }",
      rust: "fn ad(x: f64, a: f64, d: f64) -> f64 { let a = if a < 0.01 { 0.3 } else { a }; let d = if d < 0.01 { 0.4 } else { d }; if x < a { x / a } else { 1.0 - (x - a) / d } }",
      hlsl: "float ad(float x, float a, float d) { a = (a < 0.01) ? 0.3 : a; d = (d < 0.01) ? 0.4 : d; return x < a ? x / a : 1.0 - (x - a) / d; }",
      wgsl: "fn ad(x: f32, a: f32, d: f32) -> f32 { let a = max(a, 0.01); let d = max(d, 0.01); return select(1.0 - (x - a) / d, x / a, x < a); }",
      python:
        "def ad(x, a=0.3, d=0.4): return x / a if x < a else 1 - (x - a) / d",
      cpp: "float ad(float x, float a = 0.3f, float d = 0.4f) { return x < a ? x / a : 1.0f - (x - a) / d; }",
      lua: "function ad(x, a, d) a = a or 0.3 d = d or 0.4 return x < a and x / a or 1 - (x - a) / d end",
      gdscript:
        "func ad(x: float, a: float = 0.3, d: float = 0.4) -> float: return x / a if x < a else 1 - (x - a) / d",
      cuda: "__device__ float ad(float x, float a, float d) { return x < a ? x / a : 1.0f - (x - a) / d; }",
      c: "double ad(double x, double a, double d) { return x < a ? x / a : 1.0 - (x - a) / d; }",
      json: '{"name": "AD Envelope", "formula": "y = (t < a) ? t/a : 1 - (t-a)/d", "params": {"attack": 0.3, "decay": 0.4}}',
      metal:
        "float ad(float x, float a, float d) { a = (a < 0.01) ? 0.3 : a; d = (d < 0.01) ? 0.4 : d; return x < a ? x / a : 1.0 - (x - a) / d; }",
      opencl:
        "float ad(float x, float a, float d) { return x < a ? x / a : 1.0f - (x - a) / d; }",
      unity:
        "public static float Ad(float x, float a = 0.3f, float d = 0.4f) { return x < a ? x / a : 1 - (x - a) / d; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["adsr", "ar", "dadsr", "asr"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => adCurve(p as AdParams),
    },
  };
}
