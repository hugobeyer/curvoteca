import {
  DEFAULT_SAMPLING,
  elasticOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { amplitude: 1, period: 0.3 } as const;
export type ElasticOutParams = { amplitude: number; period: number };

export function elasticOutCurve(
  params: ElasticOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = elasticOutKernel(params.amplitude, params.period);
  return {
    id: "elastic-out",
    name: "Elastic Out",
    aliases: ["easeOutElastic", "spring out", "elastic settle"],
    family: "trigonometric",
    summary: "Elastic settle",
    formula: "y = a * 2^(-10x) * sin((x - s) * 2pi / p) + 1",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "elastic", "spring", "ease-out"],
    useCases: [
      "ui-animation",
      "spring-physics",
      "elastic-settle",
      "playful-ease",
    ],
    snippets: {
      equation: "y = a * 2^(-10x) * sin((x - s) * 2pi / p) + 1",
      js: "function elasticOut(x, a, p) { a = a == null ? 1 : a; p = p == null ? 0.3 : p; if (x === 0 || x === 1) return x; var s = (p / (2 * Math.PI)) * Math.asin(1 / a); return a * Math.pow(2, -10 * x) * Math.sin(((x - s) * 2 * Math.PI) / p) + 1; }",
      ts: "function elasticOut(x: number, a: number = 1, p: number = 0.3): number { if (x === 0 || x === 1) return x; const s = (p / (2 * Math.PI)) * Math.asin(1 / a); return a * Math.pow(2, -10 * x) * Math.sin(((x - s) * 2 * Math.PI) / p) + 1; }",
      glsl: "float elasticOut(float x, float a, float p) { a = (a < 1.0) ? 1.0 : a; p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return a * pow(2.0, -10.0 * x) * sin(((x - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      vex: "float elasticOut(float x; float a; float p) { if (a < 1) a = 1; if (p == 0) p = 0.3; if (x == 0 || x == 1) return x; float s = (p / (2 * M_PI)) * asin(1 / a); return a * pow(2, -10 * x) * sin(((x - s) * 2 * M_PI) / p) + 1; }",
      csharp: "float ElasticOut(float x, float a = 1, float p = 0.3f) { if (x == 0 || x == 1) return x; float s = (p / (2 * MathF.PI)) * MathF.Asin(1 / a); return a * MathF.Pow(2, -10 * x) * MathF.Sin(((x - s) * 2 * MathF.PI) / p) + 1; }",
      rust: "fn elastic_out(x: f64, a: f64, p: f64) -> f64 { let a = if a < 1.0 { 1.0 } else { a }; let p = if p == 0.0 { 0.3 } else { p }; if x == 0.0 || x == 1.0 { return x; } let s = (p / (2.0 * std::f64::consts::PI)) * (1.0 / a).asin(); a * (2.0_f64).powf(-10.0 * x) * (((x - s) * 2.0 * std::f64::consts::PI) / p).sin() + 1.0 }",
      hlsl: "float elasticOut(float x, float a, float p) { a = (a < 1.0) ? 1.0 : a; p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return a * pow(2.0, -10.0 * x) * sin(((x - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      wgsl: "fn elastic_out(x: f32, a: f32, p: f32) -> f32 { let a = select(1.0, a, a >= 1.0); let p = select(0.3, p, p != 0.0); if (x == 0.0 || x == 1.0) { return x; } let s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return a * pow(2.0, -10.0 * x) * sin(((x - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      python: "def elastic_out(x, a=1, p=0.3): a = a if a >= 1 else 1; p = p or 0.3; if x == 0 or x == 1: return x; s = (p / (2 * math.pi)) * math.asin(1 / a); return a * 2 ** (-10 * x) * math.sin(((x - s) * 2 * math.pi) / p) + 1",
      cpp: "#include <cmath>\nfloat elasticOut(float x, float a = 1.0f, float p = 0.3f) { if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * M_PI)) * std::asin(1.0f / a); return a * std::pow(2.0f, -10.0f * x) * std::sin(((x - s) * 2.0f * M_PI) / p) + 1.0f; }",
      lua: "function elasticOut(x, a, p) a = a or 1; p = p or 0.3; if x == 0 or x == 1 then return x end; local s = (p / (2 * math.pi)) * math.asin(1 / a); return a * math.pow(2, -10 * x) * math.sin(((x - s) * 2 * math.pi) / p) + 1 end",
      gdscript: "func elastic_out(x: float, a: float = 1.0, p: float = 0.3) -> float: if x == 0.0 or x == 1.0: return x; var s = (p / (2.0 * PI)) * asin(1.0 / a); return a * pow(2.0, -10.0 * x) * sin(((x - s) * 2.0 * PI) / p) + 1.0",
      cuda: "__device__ float elasticOut(float x, float a, float p) { if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * 3.14159265f)) * asinf(1.0f / a); return a * powf(2.0f, -10.0f * x) * sinf(((x - s) * 2.0f * 3.14159265f) / p) + 1.0f; }",
      c: "#include <math.h>\ndouble elasticOut(double x, double a, double p) { if (x == 0.0 || x == 1.0) return x; double s = (p / (2.0 * M_PI)) * asin(1.0 / a); return a * pow(2.0, -10.0 * x) * sin(((x - s) * 2.0 * M_PI) / p) + 1.0; }",
      json: '{"name": "Elastic Out", "formula": "y = a * 2^(-10x) * sin((x - s) * 2pi / p) + 1", "params": {"amplitude": 1, "period": 0.3}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["elastic-in", "back-out", "bounce-out", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => elasticOutCurve(p as ElasticOutParams),
    },
  };
}
