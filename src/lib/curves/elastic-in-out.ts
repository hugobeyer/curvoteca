import {
  DEFAULT_SAMPLING,
  elasticInOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { amplitude: 1, period: 0.3 } as const;
export type ElasticInOutParams = { amplitude: number; period: number };

export function elasticInOutCurve(
  params: ElasticInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = elasticInOutKernel(params.amplitude, params.period);
  return {
    id: "elastic-in-out",
    name: "Elastic In-Out",
    aliases: ["easeInOutElastic", "spring in-out", "elastic bookend"],
    family: "trigonometric",
    summary: "Elastic ease-in-out with symmetric damped oscillation",
    formula: "y = (u < 0) ? -0.5 * a * 2^(10u) * sin((u-s)*2pi/p) : 0.5 * a * 2^(-10u) * sin((u-s)*2pi/p) + 1",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "elastic", "spring", "ease-in-out"],
    useCases: [
      "ui-animation",
      "spring-physics",
      "elastic-transitions",
      "playful-ease",
    ],
    snippets: {
      equation: "y = (u < 0) ? -0.5 * a * 2^(10u) * sin((u-s)*2pi/p) : 0.5 * a * 2^(-10u) * sin((u-s)*2pi/p) + 1",
      js: "function elasticInOut(x, a, p) { a = a == null ? 1 : a; p = p == null ? 0.3 : p; if (x === 0 || x === 1) return x; var u = 2 * x - 1; var s = (p / (2 * Math.PI)) * Math.asin(1 / a); if (u < 0) return -0.5 * a * Math.pow(2, 10 * u) * Math.sin(((u - s) * 2 * Math.PI) / p); return 0.5 * a * Math.pow(2, -10 * u) * Math.sin(((u - s) * 2 * Math.PI) / p) + 1; }",
      ts: "function elasticInOut(x: number, a: number = 1, p: number = 0.3): number { if (x === 0 || x === 1) return x; const u = 2 * x - 1; const s = (p / (2 * Math.PI)) * Math.asin(1 / a); if (u < 0) return -0.5 * a * Math.pow(2, 10 * u) * Math.sin(((u - s) * 2 * Math.PI) / p); return 0.5 * a * Math.pow(2, -10 * u) * Math.sin(((u - s) * 2 * Math.PI) / p) + 1; }",
      glsl: "float elasticInOut(float x, float a, float p) { a = (a < 1.0) ? 1.0 : a; p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float u = 2.0 * x - 1.0; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); if (u < 0.0) return -0.5 * a * pow(2.0, 10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p); return 0.5 * a * pow(2.0, -10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      vex: "float elasticInOut(float x; float a; float p) { if (a < 1) a = 1; if (p == 0) p = 0.3; if (x == 0 || x == 1) return x; float u = 2 * x - 1; float s = (p / (2 * M_PI)) * asin(1 / a); if (u < 0) return -0.5 * a * pow(2, 10 * u) * sin(((u - s) * 2 * M_PI) / p); return 0.5 * a * pow(2, -10 * u) * sin(((u - s) * 2 * M_PI) / p) + 1; }",
      csharp: "float ElasticInOut(float x, float a = 1, float p = 0.3f) { a = Math.Max(1, a); p = p == 0 ? 0.3f : p; if (x == 0 || x == 1) return x; float u = 2 * x - 1; float s = (p / (2 * MathF.PI)) * MathF.Asin(1 / a); if (u < 0) return -0.5f * a * MathF.Pow(2, 10 * u) * MathF.Sin(((u - s) * 2 * MathF.PI) / p); return 0.5f * a * MathF.Pow(2, -10 * u) * MathF.Sin(((u - s) * 2 * MathF.PI) / p) + 1; }",
      rust: "fn elastic_in_out(x: f64, a: f64, p: f64) -> f64 { let a = a.max(1.0); let p = if p == 0.0 { 0.3 } else { p }; if x == 0.0 || x == 1.0 { return x; } let u = 2.0 * x - 1.0; let s = (p / (2.0 * std::f64::consts::PI)) * (1.0 / a).asin(); if u < 0.0 { -0.5 * a * (2.0_f64).powf(10.0 * u) * (((u - s) * 2.0 * std::f64::consts::PI) / p).sin() } else { 0.5 * a * (2.0_f64).powf(-10.0 * u) * (((u - s) * 2.0 * std::f64::consts::PI) / p).sin() + 1.0 } }",
      hlsl: "float elasticInOut(float x, float a, float p) { a = max(1.0, a); p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float u = 2.0 * x - 1.0; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); if (u < 0.0) return -0.5 * a * pow(2.0, 10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p); return 0.5 * a * pow(2.0, -10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      wgsl: "fn elastic_in_out(x: f32, a: f32, p: f32) -> f32 { let a = max(1.0, a); let p = select(0.3, p, p != 0.0); if (x == 0.0 || x == 1.0) { return x; } let u = 2.0 * x - 1.0; let s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); if (u < 0.0) { return -0.5 * a * pow(2.0, 10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p); } return 0.5 * a * pow(2.0, -10.0 * u) * sin(((u - s) * 2.0 * 3.14159265) / p) + 1.0; }",
      python: "def elastic_in_out(x, a=1, p=0.3): a = max(1, a); p = p or 0.3; if x == 0 or x == 1: return x; u = 2 * x - 1; s = (p / (2 * math.pi)) * math.asin(1 / a); if u < 0: return -0.5 * a * math.pow(2, 10 * u) * math.sin(((u - s) * 2 * math.pi) / p); return 0.5 * a * math.pow(2, -10 * u) * math.sin(((u - s) * 2 * math.pi) / p) + 1",
      cpp: "#include <cmath>\nfloat elasticInOut(float x, float a = 1.0f, float p = 0.3f) { if (x == 0.0f || x == 1.0f) return x; float u = 2.0f * x - 1.0f; float s = (p / (2.0f * M_PI)) * std::asin(1.0f / a); if (u < 0.0f) return -0.5f * a * std::pow(2.0f, 10.0f * u) * std::sin(((u - s) * 2.0f * M_PI) / p); return 0.5f * a * std::pow(2.0f, -10.0f * u) * std::sin(((u - s) * 2.0f * M_PI) / p) + 1.0f; }",
      lua: "function elasticInOut(x, a, p) a = a or 1; p = p or 0.3; if x == 0 or x == 1 then return x end; local u = 2 * x - 1; local s = (p / (2 * math.pi)) * math.asin(1 / a); if u < 0 then return -0.5 * a * math.pow(2, 10 * u) * math.sin(((u - s) * 2 * math.pi) / p) end; return 0.5 * a * math.pow(2, -10 * u) * math.sin(((u - s) * 2 * math.pi) / p) + 1 end",
      gdscript: "func elastic_in_out(x: float, a: float = 1.0, p: float = 0.3) -> float: if x == 0.0 or x == 1.0: return x; var u = 2.0 * x - 1.0; var s = (p / (2.0 * PI)) * asin(1.0 / a); if u < 0.0: return -0.5 * a * pow(2.0, 10.0 * u) * sin(((u - s) * 2.0 * PI) / p); return 0.5 * a * pow(2.0, -10.0 * u) * sin(((u - s) * 2.0 * PI) / p) + 1.0",
      cuda: "__device__ float elasticInOut(float x, float a, float p) { if (x == 0.0f || x == 1.0f) return x; float u = 2.0f * x - 1.0f; float s = (p / (2.0f * 3.14159265f)) * asinf(1.0f / a); if (u < 0.0f) return -0.5f * a * powf(2.0f, 10.0f * u) * sinf(((u - s) * 2.0f * 3.14159265f) / p); return 0.5f * a * powf(2.0f, -10.0f * u) * sinf(((u - s) * 2.0f * 3.14159265f) / p) + 1.0f; }",
      c: "#include <math.h>\ndouble elasticInOut(double x, double a, double p) { if (x == 0.0 || x == 1.0) return x; double u = 2.0 * x - 1.0; double s = (p / (2.0 * M_PI)) * asin(1.0 / a); if (u < 0.0) return -0.5 * a * pow(2.0, 10.0 * u) * sin(((u - s) * 2.0 * M_PI) / p); return 0.5 * a * pow(2.0, -10.0 * u) * sin(((u - s) * 2.0 * M_PI) / p) + 1.0; }",
      json: '{"name": "Elastic In-Out", "formula": "y = (u < 0) ? -0.5 * a * 2^(10u) * sin((u-s)*2pi/p) : 0.5 * a * 2^(-10u) * sin((u-s)*2pi/p) + 1", "params": {"amplitude": 1, "period": 0.3}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["elastic-in", "elastic-out", "back-in-out", "bounce-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => elasticInOutCurve(p as ElasticInOutParams),
    },
  };
}
