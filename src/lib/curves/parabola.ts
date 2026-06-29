import {
  DEFAULT_SAMPLING,
  parabolaKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type ParabolaParams = typeof defaultParams;

export function parabolaCurve(
  _params: ParabolaParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = parabolaKernel;
  return {
    id: "parabola",
    name: "Parabola",
    aliases: ["quadratic", "x squared", "square curve"],
    family: "power",
    summary: "Quadratic curve",
    formula: "y = x^2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["parabola", "quadratic", "power", "polynomial"],
    useCases: ["easing", "physics-falloff", "shape-blending", "quadratic-curves"],
    snippets: {
      equation: "y = x^2",
      js: "function parabola(x) { return x * x; }",
      glsl: "float parabola(float x) { return x * x; }",
      vex: "float parabola(float x) { return x * x; }",
      ts: "function parabola(x: number): number { return x * x; }",
      csharp: "float Parabola(float x) { return x * x; }",
      rust: "fn parabola(x: f64) -> f64 { x * x }",
      hlsl: "float parabola(float x) { return x * x; }",
      wgsl: "fn parabola(x: f32) -> f32 { return x * x; }",
      python: "def parabola(x): return x * x",
      css: "cubic-bezier(0.42, 0, 1, 1)",
      cpp: "float parabola(float x) { return x * x; }",
      lua: "function parabola(x) return x * x end",
      gdscript: "func parabola(x: float) -> float: return x * x",
      cuda: "__device__ float parabola(float x) { return x * x; }",
      c: "double parabola(double x) { return x * x; }",
      json: "{\"name\": \"Parabola\", \"formula\": \"y = x^2\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quadratic-ease", "power", "sine-ease", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => parabolaCurve(params as ParabolaParams),
    },
  };
}
