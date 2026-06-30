import { DEFAULT_SAMPLING, filmicKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  a: 0.22,
  b: 0.3,
  c: 0.1,
  d: 0.2,
  e: 0.01,
} as const;
export type FilmicParams = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
};

export function filmicCurve(
  params: FilmicParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = filmicKernel(
    params.a,
    params.b,
    params.c,
    params.d,
    params.e,
  );
  return {
    id: "filmic",
    name: "Filmic Tone Map",
    aliases: ["ACES filmic", "film curve", "ACES approximation"],
    family: "tone-mapping",
    summary: "Filmic/ACES tone mapping curve",
    formula: "y = t*(a*t + b) / (t*(c*t + d) + e)",
    continuity: "C3+",
    domain: [0, 10],
    range: [0, 1],
    tags: ["tonemap", "hdr", "filmic", "aces", "rendering"],
    useCases: [
      "hdr-tonemapping",
      "film-emulation",
      "rendering-pipeline",
      "color-science",
    ],
    snippets: {
      equation: "y = t*(a*t + b) / (t*(c*t + d) + e)",
      js: "function filmic(x, a, b, c, d, e) { a = a == null ? 0.22 : a; b = b == null ? 0.3 : b; c = c == null ? 0.1 : c; d = d == null ? 0.2 : d; e = e == null ? 0.01 : e; return x * (a * x + b) / (x * (c * x + d) + e); }",
      ts: "function filmic(x: number, a: number = 0.22, b: number = 0.3, c: number = 0.1, d: number = 0.2, e: number = 0.01): number { return x * (a * x + b) / (x * (c * x + d) + e); }",
      glsl: "float filmic(float x, float a, float b, float c, float d, float e) { a = (a == 0.0) ? 0.22 : a; b = (b == 0.0) ? 0.3 : b; c = (c == 0.0) ? 0.1 : c; d = (d == 0.0) ? 0.2 : d; e = (e == 0.0) ? 0.01 : e; return x * (a * x + b) / (x * (c * x + d) + e); }",
      vex: "float filmic(float x; float a; float b; float c; float d; float e) { if (a == 0) a = 0.22; if (b == 0) b = 0.3; if (c == 0) c = 0.1; if (d == 0) d = 0.2; if (e == 0) e = 0.01; return x * (a * x + b) / (x * (c * x + d) + e); }",
      csharp:
        "float Filmic(float x, float a = 0.22f, float b = 0.3f, float c = 0.1f, float d = 0.2f, float e = 0.01f) { return x * (a * x + b) / (x * (c * x + d) + e); }",
      rust: "fn filmic(x: f64, a: f64, b: f64, c: f64, d: f64, e: f64) -> f64 { let a = if a == 0.0 { 0.22 } else { a }; let b = if b == 0.0 { 0.3 } else { b }; let c = if c == 0.0 { 0.1 } else { c }; let d = if d == 0.0 { 0.2 } else { d }; let e = if e == 0.0 { 0.01 } else { e }; x * (a * x + b) / (x * (c * x + d) + e) }",
      hlsl: "float filmic(float x, float a, float b, float c, float d, float e) { a = (a == 0.0) ? 0.22 : a; b = (b == 0.0) ? 0.3 : b; c = (c == 0.0) ? 0.1 : c; d = (d == 0.0) ? 0.2 : d; e = (e == 0.0) ? 0.01 : e; return x * (a * x + b) / (x * (c * x + d) + e); }",
      wgsl: "fn filmic(x: f32, a: f32, b: f32, c: f32, d: f32, e: f32) -> f32 { let a = select(0.22, a, a != 0.0); let b = select(0.3, b, b != 0.0); let c = select(0.1, c, c != 0.0); let d = select(0.2, d, d != 0.0); let e = select(0.01, e, e != 0.0); return x * (a * x + b) / (x * (c * x + d) + e); }",
      python:
        "def filmic(x, a=0.22, b=0.3, c=0.1, d=0.2, e=0.01): a = a or 0.22; b = b or 0.3; c = c or 0.1; d = d or 0.2; e = e or 0.01; return x * (a * x + b) / (x * (c * x + d) + e)",
      cpp: "float filmic(float x, float a = 0.22f, float b = 0.3f, float c = 0.1f, float d = 0.2f, float e = 0.01f) { return x * (a * x + b) / (x * (c * x + d) + e); }",
      lua: "function filmic(x, a, b, c, d, e) a = a or 0.22; b = b or 0.3; c = c or 0.1; d = d or 0.2; e = e or 0.01; return x * (a * x + b) / (x * (c * x + d) + e) end",
      gdscript:
        "func filmic(x: float, a: float = 0.22, b: float = 0.3, c: float = 0.1, d: float = 0.2, e: float = 0.01) -> float: return x * (a * x + b) / (x * (c * x + d) + e)",
      cuda: "__device__ float filmic(float x, float a, float b, float c, float d, float e) { return x * (a * x + b) / (x * (c * x + d) + e); }",
      c: "double filmic(double x, double a, double b, double c, double d, double e) { return x * (a * x + b) / (x * (c * x + d) + e); }",
      metal:
        "float filmic(float x, float a, float b, float c, float d, float e) { a = (a == 0.0) ? 0.22 : a; b = (b == 0.0) ? 0.3 : b; c = (c == 0.0) ? 0.1 : c; d = (d == 0.0) ? 0.2 : d; e = (e == 0.0) ? 0.01 : e; return x * (a * x + b) / (x * (c * x + d) + e); }",
      opencl:
        "float filmic(float x, float a, float b, float c, float d, float e) { a = (a == 0.0f) ? 0.22f : a; b = (b == 0.0f) ? 0.3f : b; c = (c == 0.0f) ? 0.1f : c; d = (d == 0.0f) ? 0.2f : d; e = (e == 0.0f) ? 0.01f : e; return x * (a * x + b) / (x * (c * x + d) + e); }",
      unity:
        "public static float Filmic(float x, float a, float b, float c, float d, float e) { return x * (a * x + b) / (x * (c * x + d) + e); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["reinhard", "compressor", "s-curve-contrast"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => filmicCurve(p as FilmicParams),
    },
  };
}
