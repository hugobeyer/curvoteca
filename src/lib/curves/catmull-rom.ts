import {
  DEFAULT_SAMPLING,
  catmullRomKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  p0: 0,
  p1: 0.5,
  p2: 1,
  p3: 0.8,
  alpha: 0.5,
} as const;
export type CatmullRomParams = {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
  alpha: number;
};

export function catmullRomCurve(
  params: CatmullRomParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = catmullRomKernel(
    params.p0,
    params.p1,
    params.p2,
    params.p3,
    params.alpha,
  );
  return {
    id: "catmull-rom",
    name: "Catmull-Rom Spline",
    aliases: ["catmull-rom", "cardinal spline", "spline interpolation"],
    family: "interpolation",
    summary: "Interpolating spline with centripetal parameterization",
    formula: "Standard Catmull-Rom with centripetal parameterization",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["interpolation", "spline", "catmull-rom", "smooth", "animation"],
    useCases: [
      "keyframe-interpolation",
      "path-smoothing",
      "camera-animation",
      "motion-graphics",
    ],
    snippets: {
      equation: "Standard Catmull-Rom with centripetal parameterization",
      js: "function catmullRom(x, p0, p1, p2, p3, a) { p0 = p0 == null ? 0 : p0; p1 = p1 == null ? 0.5 : p1; p2 = p2 == null ? 1 : p2; p3 = p3 == null ? 0.8 : p3; a = a == null ? 0.5 : a; var t = x; var t0 = 0; var t1 = Math.pow(Math.abs(p1 - p0), a) + t0; var t2 = Math.pow(Math.abs(p2 - p1), a) + t1; var t3 = Math.pow(Math.abs(p3 - p2), a) + t2; t = t1 + t * (t2 - t1); var A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; var B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; var C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; var D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; var E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      ts: "function catmullRom(x: number, p0: number = 0, p1: number = 0.5, p2: number = 1, p3: number = 0.8, a: number = 0.5): number { const t0 = 0; const t1 = Math.pow(Math.abs(p1 - p0), a) + t0; const t2 = Math.pow(Math.abs(p2 - p1), a) + t1; const t3 = Math.pow(Math.abs(p3 - p2), a) + t2; const t = t1 + x * (t2 - t1); const A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; const B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; const C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; const D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; const E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      glsl: "float catmullRom(float x, float p0, float p1, float p2, float p3, float a) { p0 = (p0 == 0.0) ? 0.0 : p0; p1 = (p1 == 0.0) ? 0.5 : p1; p2 = (p2 == 0.0) ? 1.0 : p2; p3 = (p3 == 0.0) ? 0.8 : p3; a = (a == 0.0) ? 0.5 : a; float t0 = 0.0; float t1 = pow(abs(p1 - p0), a) + t0; float t2 = pow(abs(p2 - p1), a) + t1; float t3 = pow(abs(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      vex: "float catmullRom(float x; float p0; float p1; float p2; float p3; float a) { if (p0 == 0) p0 = 0; if (p1 == 0) p1 = 0.5; if (p2 == 0) p2 = 1; if (p3 == 0) p3 = 0.8; if (a == 0) a = 0.5; float t0 = 0; float t1 = pow(abs(p1 - p0), a) + t0; float t2 = pow(abs(p2 - p1), a) + t1; float t3 = pow(abs(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      csharp: "float CatmullRom(float x, float p0 = 0, float p1 = 0.5f, float p2 = 1, float p3 = 0.8f, float a = 0.5f) { float t0 = 0; float t1 = MathF.Pow(MathF.Abs(p1 - p0), a) + t0; float t2 = MathF.Pow(MathF.Abs(p2 - p1), a) + t1; float t3 = MathF.Pow(MathF.Abs(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      rust: "fn catmull_rom(x: f64, p0: f64, p1: f64, p2: f64, p3: f64, a: f64) -> f64 { let p0 = if p0 == 0.0 { 0.0 } else { p0 }; let p1 = if p1 == 0.0 { 0.5 } else { p1 }; let p2 = if p2 == 0.0 { 1.0 } else { p2 }; let p3 = if p3 == 0.0 { 0.8 } else { p3 }; let a = if a == 0.0 { 0.5 } else { a }; let t0 = 0.0; let t1 = (p1 - p0).abs().powf(a) + t0; let t2 = (p2 - p1).abs().powf(a) + t1; let t3 = (p3 - p2).abs().powf(a) + t2; let t = t1 + x * (t2 - t1); let A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; let B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; let C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; let D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; let E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E }",
      hlsl: "float catmullRom(float x, float p0, float p1, float p2, float p3, float a) { p0 = (p0 == 0.0) ? 0.0 : p0; p1 = (p1 == 0.0) ? 0.5 : p1; p2 = (p2 == 0.0) ? 1.0 : p2; p3 = (p3 == 0.0) ? 0.8 : p3; a = (a == 0.0) ? 0.5 : a; float t0 = 0.0; float t1 = pow(abs(p1 - p0), a) + t0; float t2 = pow(abs(p2 - p1), a) + t1; float t3 = pow(abs(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      wgsl: "fn catmull_rom(x: f32, p0: f32, p1: f32, p2: f32, p3: f32, a: f32) -> f32 { let p0 = select(0.0, p0, p0 != 0.0); let p1 = select(0.5, p1, p1 != 0.0); let p2 = select(1.0, p2, p2 != 0.0); let p3 = select(0.8, p3, p3 != 0.0); let a = select(0.5, a, a != 0.0); let t0 = 0.0; let t1 = pow(abs(p1 - p0), a) + t0; let t2 = pow(abs(p2 - p1), a) + t1; let t3 = pow(abs(p3 - p2), a) + t2; let t = t1 + x * (t2 - t1); let A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; let B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; let C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; let D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; let E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      python: "def catmull_rom(x, p0=0, p1=0.5, p2=1, p3=0.8, a=0.5): t0 = 0; t1 = abs(p1 - p0) ** a + t0; t2 = abs(p2 - p1) ** a + t1; t3 = abs(p3 - p2) ** a + t2; t = t1 + x * (t2 - t1); A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E",
      cpp: "float catmullRom(float x, float p0 = 0.0f, float p1 = 0.5f, float p2 = 1.0f, float p3 = 0.8f, float a = 0.5f) { float t0 = 0.0f; float t1 = std::pow(std::abs(p1 - p0), a) + t0; float t2 = std::pow(std::abs(p2 - p1), a) + t1; float t3 = std::pow(std::abs(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      lua: "function catmullRom(x, p0, p1, p2, p3, a) p0 = p0 or 0 p1 = p1 or 0.5 p2 = p2 or 1 p3 = p3 or 0.8 a = a or 0.5 local t0 = 0 local t1 = math.abs(p1 - p0) ^ a + t0 local t2 = math.abs(p2 - p1) ^ a + t1 local t3 = math.abs(p3 - p2) ^ a + t2 local t = t1 + x * (t2 - t1) local A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1 local B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2 local C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3 local D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B local E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E end",
      gdscript: "func catmullRom(x: float, p0: float = 0.0, p1: float = 0.5, p2: float = 1.0, p3: float = 0.8, a: float = 0.5) -> float: var t0 = 0.0; var t1 = pow(abs(p1 - p0), a) + t0; var t2 = pow(abs(p2 - p1), a) + t1; var t3 = pow(abs(p3 - p2), a) + t2; var t = t1 + x * (t2 - t1); var A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; var B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; var C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; var D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; var E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E",
      cuda: "__device__ float catmullRom(float x, float p0, float p1, float p2, float p3, float a) { float t0 = 0.0f; float t1 = powf(fabsf(p1 - p0), a) + t0; float t2 = powf(fabsf(p2 - p1), a) + t1; float t3 = powf(fabsf(p3 - p2), a) + t2; float t = t1 + x * (t2 - t1); float A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; float B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; float C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; float D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; float E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
      c: "double catmullRom(double x, double p0, double p1, double p2, double p3, double a) { double t0 = 0.0; double t1 = pow(fabs(p1 - p0), a) + t0; double t2 = pow(fabs(p2 - p1), a) + t1; double t3 = pow(fabs(p3 - p2), a) + t2; double t = t1 + x * (t2 - t1); double A = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1; double B = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2; double C = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3; double D = (t2 - t) / (t2 - t0) * A + (t - t0) / (t2 - t0) * B; double E = (t3 - t) / (t3 - t1) * B + (t - t1) / (t3 - t1) * C; return (t2 - t) / (t2 - t1) * D + (t - t1) / (t2 - t1) * E; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["hermite", "cubic-bezier", "smoothstep", "smootherstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => catmullRomCurve(p as CatmullRomParams),
    },
  };
}
