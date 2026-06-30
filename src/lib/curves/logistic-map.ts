import {
  DEFAULT_SAMPLING,
  logisticMapKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { r: 3.8, iterations: 100 } as const;
export type LogisticMapParams = { r: number; iterations: number };

export function logisticMapCurve(
  params: LogisticMapParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = logisticMapKernel(params.r, params.iterations);
  return {
    id: "logistic-map",
    name: "Logistic Map",
    family: "chaos",
    summary: "Iterated logistic map function",
    formula: "x_{n+1} = r * x_n * (1 - x_n)",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [0, 1],
    tags: ["chaos", "fractal", "iteration", "logistic-map", "nonlinear"],
    useCases: [
      "chaos-theory",
      "fractal-visualization",
      "nonlinear-dynamics",
      "population-model",
    ],
    snippets: {
      equation: "x_{n+1} = r * x_n * (1 - x_n)",
      js: "function logisticMap(x, r, it) { r = r == null ? 3.8 : r; it = it == null ? 100 : it; var v = x; for (var i = 0; i < it; i++) { v = r * v * (1 - v); } return v; }",
      ts: "function logisticMap(x: number, r: number = 3.8, it: number = 100): number { let v = x; for (let i = 0; i < it; i++) { v = r * v * (1 - v); } return v; }",
      glsl: "float logisticMap(float x, float r, int it) { r = (r < 0.01) ? 3.8 : r; float v = x; for (int i = 0; i < 100; i++) { if (i >= it) break; v = r * v * (1.0 - v); } return v; }",
      vex: "float logisticMap(float x; float r; int it) { if (r < 0.01) r = 3.8; float v = x; for (int i = 0; i < it; i++) { v = r * v * (1 - v); } return v; }",
      csharp:
        "float LogisticMap(float x, float r = 3.8f, int it = 100) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1 - v); } return v; }",
      rust: "fn logistic_map(x: f64, r: f64, it: i32) -> f64 { let r = if r < 0.01 { 3.8 } else { r }; let mut v = x; for _ in 0..it { v = r * v * (1.0 - v); } v }",
      hlsl: "float logisticMap(float x, float r, int it) { r = (r < 0.01) ? 3.8 : r; float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0 - v); } return v; }",
      wgsl: "fn logistic_map(x: f32, r: f32, it: i32) -> f32 { let r = max(r, 0.01); var v = x; for (var i: i32 = 0; i < it; i++) { v = r * v * (1.0 - v); } return v; }",
      python:
        "def logistic_map(x, r=3.8, it=100): v = x; for _ in range(it): v = r * v * (1 - v); return v",
      cpp: "float logisticMap(float x, float r = 3.8f, int it = 100) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0f - v); } return v; }",
      lua: "function logisticMap(x, r, it) r = r or 3.8; it = it or 100; local v = x; for i = 1, it do v = r * v * (1 - v) end; return v end",
      gdscript:
        "func logistic_map(x: float, r: float = 3.8, it: int = 100) -> float: var v = x; for i in range(it): v = r * v * (1 - v); return v",
      cuda: "__device__ float logisticMap(float x, float r, int it) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0f - v); } return v; }",
      c: "double logistic_map(double x, double r, int it) { double v = x; for (int i = 0; i < it; i++) { v = r * v * (1 - v); } return v; }",
      metal:
        "float logisticMap(float x, float r, int it) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0 - v); } return v; }",
      opencl:
        "float logisticMap(float x, float r, int it) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0f - v); } return v; }",
      unity:
        "public static float LogisticMap(float x, float r, int it) { float v = x; for (int i = 0; i < it; i++) { v = r * v * (1.0f - v); } return v; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["logistic", "white-noise-1d", "fbm-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => logisticMapCurve(p as LogisticMapParams),
    },
  };
}
