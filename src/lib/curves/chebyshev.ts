import {
  DEFAULT_SAMPLING,
  chebyshevKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { order: 3 } as const;
export type ChebyshevParams = { order: number };

export function chebyshevCurve(
  params: ChebyshevParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = chebyshevKernel(params.order);
  return {
    id: "chebyshev",
    name: "Chebyshev Waveshaping",
    family: "polynomial",
    summary: "Chebyshev polynomial waveshaper",
    formula: "T_n(t) = cos(n * acos(t))",
    continuity: "C0",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["audio", "chebyshev", "waveshaping", "harmonics", "polynomial"],
    useCases: [
      "waveshaping",
      "harmonic-generation",
      "audio-synthesis",
      "tube-emulation",
    ],
    snippets: {
      equation: "T_n(t) = cos(n * acos(t))",
      js: "function chebyshev(x, n) { n = n == null ? 3 : n; return Math.cos(n * Math.acos(x)); }",
      ts: "function chebyshev(x: number, n: number = 3): number { return Math.cos(n * Math.acos(x)); }",
      glsl: "float chebyshev(float x, float n) { n = (n == 0.0) ? 3.0 : n; return cos(n * acos(clamp(x, -1.0, 1.0))); }",
      vex: "float chebyshev(float x; float n) { if (n == 0) n = 3; return cos(n * acos(x)); }",
      csharp:
        "float Chebyshev(float x, float n = 3) { return MathF.Cos(n * MathF.Acos(x)); }",
      rust: "fn chebyshev(x: f64, n: f64) -> f64 { let n = if n == 0.0 { 3.0 } else { n }; (n * x.acos()).cos() }",
      hlsl: "float chebyshev(float x, float n) { n = (n == 0.0) ? 3.0 : n; return cos(n * acos(clamp(x, -1.0, 1.0))); }",
      wgsl: "fn chebyshev(x: f32, n: f32) -> f32 { let n = select(3.0, n, n != 0.0); return cos(n * acos(clamp(x, -1.0, 1.0))); }",
      python: "def chebyshev(x, n=3): return math.cos(n * math.acos(x))",
      cpp: "float chebyshev(float x, float n = 3.0f) { return std::cos(n * std::acos(x)); }",
      lua: "function chebyshev(x, n) n = n or 3 return math.cos(n * math.acos(x)) end",
      gdscript:
        "func chebyshev(x: float, n: float = 3.0) -> float: return cos(n * acos(x))",
      cuda: "__device__ float chebyshev(float x, float n) { return cosf(n * acosf(x)); }",
      c: "double chebyshev(double x, double n) { return cos(n * acos(x)); }",
      json: '{"name": "Chebyshev Waveshaping", "formula": "T_n(t) = cos(n * acos(t))", "params": {"order": 3}}',
      metal:
        "float chebyshev(float x, float n) { n = (n == 0.0) ? 3.0 : n; return cos(n * acos(clamp(x, -1.0, 1.0))); }",
      opencl: "float chebyshev(float x, float n) { return cos(n * acos(x)); }",
      unity:
        "public static float Chebyshev(float x, float n = 3) { return MathF.Cos(n * MathF.Acos(x)); }",
      shadertoy: "return cos(n * acos(clamp(x, -1.0, 1.0)));",
      matlab: "y = @(x, n) cos(n * acos(x));",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["soft-clip", "cubic-distortion", "wavefolder"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => chebyshevCurve(p as ChebyshevParams),
    },
  };
}
