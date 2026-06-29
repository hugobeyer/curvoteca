import {
  DEFAULT_SAMPLING,
  hermiteKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { p0: 0, p1: 1, m0: 0, m1: 0 } as const;
export type HermiteParams = {
  p0: number;
  p1: number;
  m0: number;
  m1: number;
};

export function hermiteCurve(
  params: HermiteParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = hermiteKernel(
    params.p0,
    params.p1,
    params.m0,
    params.m1,
  );
  return {
    id: "hermite",
    name: "Hermite Interpolation",
    aliases: ["cubic hermite", "hermite spline", "tangent interpolation"],
    family: "interpolation",
    summary: "Cubic Hermite interpolation between two values",
    formula:
      "y = (2t^3 - 3t^2 + 1)*p0 + (t^3 - 2t^2 + t)*m0 + (-2t^3 + 3t^2)*p1 + (t^3 - t^2)*m1",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["interpolation", "spline", "hermite", "smooth", "cubic"],
    useCases: [
      "keyframe-interpolation",
      "smooth-transitions",
      "animation-curves",
      "spline-fitting",
    ],
    snippets: {
      equation:
        "y = (2t^3 - 3t^2 + 1)*p0 + (t^3 - 2t^2 + t)*m0 + (-2t^3 + 3t^2)*p1 + (t^3 - t^2)*m1",
      js: "function hermite(x, p0, p1, m0, m1) { p0 = p0 == null ? 0 : p0; p1 = p1 == null ? 1 : p1; m0 = m0 == null ? 0 : m0; m1 = m1 == null ? 0 : m1; var t2 = x * x; var t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1; }",
      ts: "function hermite(x: number, p0: number = 0, p1: number = 1, m0: number = 0, m1: number = 0): number { const t2 = x * x; const t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1; }",
      glsl: "float hermite(float x, float p0, float p1, float m0, float m1) { float t2 = x * x; float t3 = t2 * x; return (2.0 * t3 - 3.0 * t2 + 1.0) * p0 + (t3 - 2.0 * t2 + x) * m0 + (-2.0 * t3 + 3.0 * t2) * p1 + (t3 - t2) * m1; }",
      vex: "float hermite(float x; float p0; float p1; float m0; float m1) { float t2 = x * x; float t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1; }",
      csharp: "float Hermite(float x, float p0 = 0, float p1 = 1, float m0 = 0, float m1 = 0) { float t2 = x * x; float t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1; }",
      rust: "fn hermite(x: f64, p0: f64, p1: f64, m0: f64, m1: f64) -> f64 { let t2 = x * x; let t3 = t2 * x; (2.0 * t3 - 3.0 * t2 + 1.0) * p0 + (t3 - 2.0 * t2 + x) * m0 + (-2.0 * t3 + 3.0 * t2) * p1 + (t3 - t2) * m1 }",
      hlsl: "float hermite(float x, float p0, float p1, float m0, float m1) { float t2 = x * x; float t3 = t2 * x; return (2.0 * t3 - 3.0 * t2 + 1.0) * p0 + (t3 - 2.0 * t2 + x) * m0 + (-2.0 * t3 + 3.0 * t2) * p1 + (t3 - t2) * m1; }",
      wgsl: "fn hermite(x: f32, p0: f32, p1: f32, m0: f32, m1: f32) -> f32 { let t2 = x * x; let t3 = t2 * x; return (2.0 * t3 - 3.0 * t2 + 1.0) * p0 + (t3 - 2.0 * t2 + x) * m0 + (-2.0 * t3 + 3.0 * t2) * p1 + (t3 - t2) * m1; }",
      python: "def hermite(x, p0=0, p1=1, m0=0, m1=0): t2 = x * x; t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1",
      cpp: "float hermite(float x, float p0 = 0.0f, float p1 = 1.0f, float m0 = 0.0f, float m1 = 0.0f) { float t2 = x * x; float t3 = t2 * x; return (2.0f * t3 - 3.0f * t2 + 1.0f) * p0 + (t3 - 2.0f * t2 + x) * m0 + (-2.0f * t3 + 3.0f * t2) * p1 + (t3 - t2) * m1; }",
      lua: "function hermite(x, p0, p1, m0, m1) p0 = p0 or 0; p1 = p1 or 1; m0 = m0 or 0; m1 = m1 or 0; local t2 = x * x; local t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1 end",
      gdscript: "func hermite(x: float, p0: float = 0.0, p1: float = 1.0, m0: float = 0.0, m1: float = 0.0) -> float: var t2 = x * x; var t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1",
      cuda: "__device__ float hermite(float x, float p0, float p1, float m0, float m1) { float t2 = x * x; float t3 = t2 * x; return (2.0f * t3 - 3.0f * t2 + 1.0f) * p0 + (t3 - 2.0f * t2 + x) * m0 + (-2.0f * t3 + 3.0f * t2) * p1 + (t3 - t2) * m1; }",
      c: "double hermite(double x, double p0, double p1, double m0, double m1) { double t2 = x * x; double t3 = t2 * x; return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + x) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1; }",
      json: "{\"name\": \"Hermite Interpolation\", \"formula\": \"y = (2t^3 - 3t^2 + 1)*p0 + (t^3 - 2t^2 + t)*m0 + (-2t^3 + 3t^2)*p1 + (t^3 - t^2)*m1\", \"params\": {\"p0\": 0, \"p1\": 1, \"m0\": 0, \"m1\": 0}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "smootherstep", "cubic-bezier", "catmull-rom"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => hermiteCurve(p as HermiteParams),
    },
  };
}
