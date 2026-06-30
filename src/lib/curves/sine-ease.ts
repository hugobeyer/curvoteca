import {
  DEFAULT_SAMPLING,
  sineEaseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SineEaseParams = typeof defaultParams;

export function sineEaseCurve(
  _params: SineEaseParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sineEaseKernel;
  return {
    id: "sine-ease",
    name: "Sine Ease",
    aliases: ["sinusoidal ease", "sine ease out", "sin ease", "quarter sine"],
    family: "trigonometric",
    summary: "Sinusoidal ease",
    formula: "y = sin(x * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "sinusoidal"],
    useCases: ["ui-animation", "ease-out", "oscillators"],

    snippets: {
      equation: "y = sin(x * pi / 2)",
      js: "function sineEase(x) { return Math.sin(x * Math.PI / 2); }",
      glsl: "float sineEase(float x) { return sin(x * 1.57079633); }",
      vex: "float sineEase(float x) { return sin(x * M_PI / 2); }",
      ts: "function sineEase(x: number): number { return Math.sin(x * Math.PI / 2); }",
      csharp: "float SineEase(float x) { return MathF.Sin(x * 1.57079633f); }",
      rust: "fn sine_ease(x: f64) -> f64 { (x * std::f64::consts::PI / 2.0).sin() }",
      hlsl: "float sineEase(float x) { return sin(x * 1.57079633); }",
      wgsl: "fn sineEase(x: f32) -> f32 { return sin(x * 1.57079633); }",
      python: "def sine_ease(x): return math.sin(x * math.pi / 2)",
      css: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      cpp: "float sineEase(float x) { return std::sin(x * M_PI / 2.0f); }",
      lua: "function sineEase(x) return math.sin(x * math.pi / 2) end",
      gdscript: "func sineEase(x: float) -> float: return sin(x * PI / 2.0)",
      cuda: "__device__ float sineEase(float x) { return sinf(x * 1.57079633f); }",
      c: "double sineEase(double x) { return sin(x * M_PI / 2.0); }",
      json: '{"name": "Sine Ease", "formula": "y = sin(x * pi / 2)", "params": {}}',
      metal: "float sineEase(float x) { return sin(x * 1.57079633); }",
      opencl: "float sineEase(float x) { return sin(x * 1.57079633f); }",
      unity:
        "public static float SineEase(float x) { return Mathf.Sin(x * 1.57079633f); }",
      shadertoy: "return sin(x * 1.57079633);",
      svelte: "export const sineEase = (x) => Math.sin(x * Math.PI / 2);",
      matlab: "y = @(x) sin(x * pi / 2);",
      excel: "=SIN(A1*PI()/2)",
      desmos: "y = \\sin\\left(x \\pi / 2\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "smootherstep", "linear", "inverse-power"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => sineEaseCurve(params as SineEaseParams),
    },
  };
}
