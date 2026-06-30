import {
  DEFAULT_SAMPLING,
  elasticInKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { amplitude: 1, period: 0.3 } as const;
export type ElasticInParams = { amplitude: number; period: number };

export function elasticInCurve(
  params: ElasticInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = elasticInKernel(params.amplitude, params.period);
  return {
    id: "elastic-in",
    name: "Elastic In",
    aliases: ["easeInElastic", "spring in", "elastic anticipation"],
    family: "trigonometric",
    summary: "Elastic ease-in with damped oscillation",
    formula: "y = -(a * 2^(10x-10) * sin(((x-1-s) * 2pi) / p))",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "elastic", "spring", "ease-in"],
    useCases: [
      "ui-animation",
      "spring-physics",
      "elastic-anticipation",
      "playful-ease",
    ],
    snippets: {
      equation: "y = -(a * 2^(10x-10) * sin(((x-1-s) * 2pi) / p))",
      js: "function elasticIn(x, a, p) { a = a == null ? 1 : a; p = p == null ? 0.3 : p; if (x === 0 || x === 1) return x; var s = (p / (2 * Math.PI)) * Math.asin(1 / a); return -(a * Math.pow(2, 10 * x - 10) * Math.sin(((x - 1 - s) * 2 * Math.PI) / p)); }",
      ts: "function elasticIn(x: number, a: number = 1, p: number = 0.3): number { if (x === 0 || x === 1) return x; const s = (p / (2 * Math.PI)) * Math.asin(1 / a); return -(a * Math.pow(2, 10 * x - 10) * Math.sin(((x - 1 - s) * 2 * Math.PI) / p)); }",
      glsl: "float elasticIn(float x, float a, float p) { a = (a < 1.0) ? 1.0 : a; p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * 3.14159265) / p)); }",
      vex: "float elasticIn(float x; float a; float p) { if (a < 1) a = 1; if (p == 0) p = 0.3; if (x == 0 || x == 1) return x; float s = (p / (2 * M_PI)) * asin(1 / a); return -(a * pow(2, 10 * x - 10) * sin(((x - 1 - s) * 2 * M_PI) / p)); }",
      csharp:
        "float ElasticIn(float x, float a = 1, float p = 0.3f) { a = Math.Max(1, a); p = p == 0 ? 0.3f : p; if (x == 0 || x == 1) return x; float s = (p / (2 * MathF.PI)) * MathF.Asin(1 / a); return -(a * MathF.Pow(2, 10 * x - 10) * MathF.Sin(((x - 1 - s) * 2 * MathF.PI) / p)); }",
      rust: "fn elastic_in(x: f64, a: f64, p: f64) -> f64 { let a = a.max(1.0); let p = if p == 0.0 { 0.3 } else { p }; if x == 0.0 || x == 1.0 { return x; } let s = (p / (2.0 * std::f64::consts::PI)) * (1.0 / a).asin(); -(a * (2.0_f64).powf(10.0 * x - 10.0) * (((x - 1.0 - s) * 2.0 * std::f64::consts::PI) / p).sin()) }",
      hlsl: "float elasticIn(float x, float a, float p) { a = max(1.0, a); p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * 3.14159265) / p)); }",
      wgsl: "fn elastic_in(x: f32, a: f32, p: f32) -> f32 { let a = max(1.0, a); let p = select(0.3, p, p != 0.0); if (x == 0.0 || x == 1.0) { return x; } let s = (p / (2.0 * 3.14159265)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * 3.14159265) / p)); }",
      python:
        "def elastic_in(x, a=1, p=0.3): a = max(1, a); p = p or 0.3; if x == 0 or x == 1: return x; s = (p / (2 * math.pi)) * math.asin(1 / a); return -(a * math.pow(2, 10 * x - 10) * math.sin(((x - 1 - s) * 2 * math.pi) / p))",
      cpp: "#include <cmath>\nfloat elasticIn(float x, float a = 1.0f, float p = 0.3f) { if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * M_PI)) * std::asin(1.0f / a); return -(a * std::pow(2.0f, 10.0f * x - 10.0f) * std::sin(((x - 1.0f - s) * 2.0f * M_PI) / p)); }",
      lua: "function elasticIn(x, a, p) a = a or 1; p = p or 0.3; if x == 0 or x == 1 then return x end; local s = (p / (2 * math.pi)) * math.asin(1 / a); return -(a * math.pow(2, 10 * x - 10) * math.sin(((x - 1 - s) * 2 * math.pi) / p)) end",
      gdscript:
        "func elastic_in(x: float, a: float = 1.0, p: float = 0.3) -> float: if x == 0.0 or x == 1.0: return x; var s = (p / (2.0 * PI)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * PI) / p))",
      cuda: "__device__ float elasticIn(float x, float a, float p) { if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * 3.14159265f)) * asinf(1.0f / a); return -(a * powf(2.0f, 10.0f * x - 10.0f) * sinf(((x - 1.0f - s) * 2.0f * 3.14159265f) / p)); }",
      c: "#include <math.h>\ndouble elasticIn(double x, double a, double p) { if (x == 0.0 || x == 1.0) return x; double s = (p / (2.0 * M_PI)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * M_PI) / p)); }",
      json: '{"name": "Elastic In", "formula": "y = -(a * 2^(10x-10) * sin(((x-1-s) * 2pi) / p))", "params": {"amplitude": 1, "period": 0.3}}',
      metal:
        "float elasticIn(float x, float a, float p) { a = (a < 1.0) ? 1.0 : a; p = (p == 0.0) ? 0.3 : p; if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 1.57079633)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * 1.57079633) / p)); }",
      opencl:
        "float elasticIn(float x, float a, float p) { a = (a < 1.0f) ? 1.0f : a; p = (p == 0.0f) ? 0.3f : p; if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * 1.57079633f)) * asin(1.0f / a); return -(a * pow(2.0f, 10.0f * x - 10.0f) * sin(((x - 1.0f - s) * 2.0f * 1.57079633f) / p)); }",
      unity:
        "public static float ElasticIn(float x, float a, float p) { a = Mathf.Max(1.0f, a); p = p == 0.0f ? 0.3f : p; if (x == 0.0f || x == 1.0f) return x; float s = (p / (2.0f * Mathf.PI)) * Mathf.Asin(1.0f / a); return -(a * Mathf.Pow(2.0f, 10.0f * x - 10.0f) * Mathf.Sin(((x - 1.0f - s) * 2.0f * Mathf.PI) / p)); }",
      shadertoy:
        "if (x == 0.0 || x == 1.0) return x; float s = (p / (2.0 * 1.57079633)) * asin(1.0 / a); return -(a * pow(2.0, 10.0 * x - 10.0) * sin(((x - 1.0 - s) * 2.0 * 1.57079633) / p));",
      svelte:
        "export const elasticIn = (x, a, p) => { a = a == null ? 1 : a; p = p == null ? 0.3 : p; if (x === 0 || x === 1) return x; const s = (p / (2 * Math.PI)) * Math.asin(1 / a); return -(a * Math.pow(2, 10 * x - 10) * Math.sin(((x - 1 - s) * 2 * Math.PI) / p)); };",
      matlab: "y = @(x, a, p) elasticInImpl(x, a, p);",
      excel:
        "=IF(OR(A1=0,A1=1),A1,-A2*POWER(2,10*A1-10)*SIN(((A1-1-(A3/(2*PI()))*ASIN(1/A2))*2*PI())/A3))",
      desmos:
        "y=-a\\cdot2^{10x-10}\\sin\\left(\\frac{\\left(x-1-s\\right)2\\pi}{p}\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["elastic-out", "elastic-in-out", "back-in", "bounce-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => elasticInCurve(p as ElasticInParams),
    },
  };
}
