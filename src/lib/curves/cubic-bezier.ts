import {
  DEFAULT_SAMPLING,
  cubicBezierKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  x1: 0.25,
  y1: 0.1,
  x2: 0.25,
  y2: 1,
} as const;
export type CubicBezierParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function cubicBezierCurve(
  params: CubicBezierParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = cubicBezierKernel(
    params.x1,
    params.y1,
    params.x2,
    params.y2,
  );
  return {
    id: "cubic-bezier",
    name: "Cubic Bezier",
    aliases: ["css ease", "bezier ease", "css cubic bezier"],
    family: "bezier",
    summary: "CSS cubic-bezier ease",
    formula: "y = bezier(x1, y1, x2, y2)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["bezier", "css", "ease", "ui"],
    useCases: ["css-animation", "ui-transitions", "easing-curves", "web-motion"],
    snippets: {
      equation: "y = cubicBezier(x1, y1, x2, y2)",
      js: "function cubicBezier(x, x1, y1, x2, y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      glsl: "float cubicBezier(float x, float x1, float y1, float x2, float y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      vex: "float cubicBezier(float x; float x1; float y1; float x2; float y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      ts: "function cubicBezier(x: number, x1: number, y1: number, x2: number, y2: number): number { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      csharp: "float CubicBezier(float x, float x1, float y1, float x2, float y2) { /* Newton-Raphson solve */ return CubicBezierImpl(x, x1, y1, x2, y2); }",
      rust: "fn cubicBezier(x: f64, x1: f64, y1: f64, x2: f64, y2: f64) -> f64 { /* Newton-Raphson solve */ cubic_bezier_impl(x, x1, y1, x2, y2) }",
      hlsl: "float cubicBezier(float x, float x1, float y1, float x2, float y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      wgsl: "fn cubicBezier(x: f32, x1: f32, y1: f32, x2: f32, y2: f32) -> f32 { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      python: "def cubicBezier(x, x1, y1, x2, y2): /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2)",
      css: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      cpp: "float cubicBezier(float x, float x1, float y1, float x2, float y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      lua: "function cubicBezier(x, x1, y1, x2, y2) -- Newton-Raphson solve; return cubicBezierImpl(x, x1, y1, x2, y2) end",
      gdscript: "func cubic_bezier(x: float, x1: float, y1: float, x2: float, y2: float) -> float: # Newton-Raphson solve; return cubicBezierImpl(x, x1, y1, x2, y2)",
      cuda: "__device__ float cubicBezier(float x, float x1, float y1, float x2, float y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      c: "double cubicBezier(double x, double x1, double y1, double x2, double y2) { /* Newton-Raphson solve */ return cubicBezierImpl(x, x1, y1, x2, y2); }",
      json: '{"name": "Cubic Bezier", "formula": "y = bezier(x1, y1, x2, y2)", "params": {"x1": 0.25, "y1": 0.1, "x2": 0.25, "y2": 1}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "sine-ease", "quadratic-ease", "back-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => cubicBezierCurve(p as CubicBezierParams),
    },
  };
}
