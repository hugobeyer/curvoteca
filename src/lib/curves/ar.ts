import {
  DEFAULT_SAMPLING,
  arKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { attack: 0.3, release: 0.4 } as const;
export type ArParams = { attack: number; release: number };

export function arCurve(
  params: ArParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = arKernel(params.attack, params.release);
  return {
    id: "ar",
    name: "AR Envelope",
    aliases: ["attack-release", "gate envelope"],
    family: "envelope",
    summary: "Attack-release envelope with exponential decay",
    formula: "y = (t < a) ? t/a : e^(-(t-a)/r)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["envelope", "audio", "attack", "release", "gate"],
    useCases: [
      "audio-envelope",
      "gate-shaping",
      "modulation",
      "transient-design",
    ],
    snippets: {
      equation: "y = (t < a) ? t/a : e^(-(t-a)/r)",
      js: "function ar(x, a, r) { a = a == null ? 0.3 : a; r = r == null ? 0.4 : r; return x < a ? x / a : Math.exp(-(x - a) / r); }",
      ts: "function ar(x: number, a: number = 0.3, r: number = 0.4): number { return x < a ? x / a : Math.exp(-(x - a) / r); }",
      glsl: "float ar(float x, float a, float r) { a = (a < 0.01) ? 0.3 : a; r = (r < 0.01) ? 0.4 : r; return x < a ? x / a : exp(-(x - a) / r); }",
      vex: "float ar(float x; float a; float r) { if (a < 0.01) a = 0.3; if (r < 0.01) r = 0.4; return x < a ? x / a : exp(-(x - a) / r); }",
      csharp: "float Ar(float x, float a = 0.3f, float r = 0.4f) { return x < a ? x / a : MathF.Exp(-(x - a) / r); }",
      rust: "fn ar(x: f64, a: f64, r: f64) -> f64 { let a = if a < 0.01 { 0.3 } else { a }; let r = if r < 0.01 { 0.4 } else { r }; if x < a { x / a } else { (-(x - a) / r).exp() } }",
      hlsl: "float ar(float x, float a, float r) { a = (a < 0.01) ? 0.3 : a; r = (r < 0.01) ? 0.4 : r; return x < a ? x / a : exp(-(x - a) / r); }",
      wgsl: "fn ar(x: f32, a: f32, r: f32) -> f32 { let a = max(a, 0.01); let r = max(r, 0.01); return select(exp(-(x - a) / r), x / a, x < a); }",
      python: "def ar(x, a=0.3, r=0.4): return x / a if x < a else math.exp(-(x - a) / r)",
      cpp: "float ar(float x, float a = 0.3f, float r = 0.4f) { return x < a ? x / a : std::exp(-(x - a) / r); }",
      lua: "function ar(x, a, r) a = a or 0.3 r = r or 0.4 return x < a and x / a or math.exp(-(x - a) / r) end",
      gdscript: "func ar(x: float, a: float = 0.3, r: float = 0.4) -> float: return x / a if x < a else exp(-(x - a) / r)",
      cuda: "__device__ float ar(float x, float a, float r) { return x < a ? x / a : expf(-(x - a) / r); }",
      c: "double ar(double x, double a, double r) { return x < a ? x / a : exp(-(x - a) / r); }",
      json: '{"name": "AR Envelope", "formula": "y = (t < a) ? t/a : e^(-(t-a)/r)", "params": {"attack": 0.3, "release": 0.4}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["adsr", "ad", "dadsr", "asr"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => arCurve(p as ArParams),
    },
  };
}
