import {
  DEFAULT_SAMPLING,
  sineOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SineOutParams = typeof defaultParams;

export function sineOutCurve(
  _params: SineOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sineOutKernel;
  return {
    id: "sine-out",
    name: "Sine Out",
    aliases: ["easeOutSine", "ease-out-sine", "sin out", "quarter sine out"],
    family: "trigonometric",
    summary: "Sinusoidal ease-out",
    formula: "y = sin((1 - x) * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "sinusoidal", "ease-out"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = sin((1 - x) * pi / 2)",
      js: "function sineOut(x) { return Math.sin((1 - x) * Math.PI / 2); }",
      glsl: "float sineOut(float x) { return sin((1.0 - x) * 1.57079633); }",
      vex: "float sineOut(float x) { return sin((1 - x) * M_PI / 2); }",
      ts: "function sineOut(x: number): number { return Math.sin((1 - x) * Math.PI / 2); }",
      csharp:
        "float SineOut(float x) { return MathF.Sin((1.0f - x) * 1.57079633f); }",
      rust: "fn sine_out(x: f64) -> f64 { ((1.0 - x) * std::f64::consts::PI / 2.0).sin() }",
      hlsl: "float sineOut(float x) { return sin((1.0 - x) * 1.57079633); }",
      wgsl: "fn sineOut(x: f32) -> f32 { return sin((1.0 - x) * 1.57079633); }",
      python: "def sine_out(x): return math.sin((1 - x) * math.pi / 2)",
      css: "cubic-bezier(0, 0, 0.75, 0.25)",
      cpp: "float sineOut(float x) { return std::sin((1.0f - x) * M_PI / 2.0f); }",
      lua: "function sineOut(x) return math.sin((1 - x) * math.pi / 2) end",
      gdscript:
        "func sineOut(x: float) -> float: return sin((1.0 - x) * PI / 2.0)",
      cuda: "__device__ float sineOut(float x) { return sinf((1.0f - x) * 1.57079633f); }",
      c: "double sineOut(double x) { return sin((1.0 - x) * M_PI / 2.0); }",
      json: '{"name": "Sine Out", "formula": "y = sin((1 - x) * pi / 2)", "params": {}}',
      metal: "float sineOut(float x) { return sin((1.0 - x) * 1.57079633); }",
      opencl:
        "float sineOut(float x) { return sin((1.0f - x) * 1.57079633f); }",
      unity:
        "public static float SineOut(float x) { return Mathf.Sin((1.0f - x) * 1.57079633f); }",
      shadertoy: "return sin((1.0 - x) * 1.57079633);",
      svelte: "export const sineOut = (x) => Math.sin((1 - x) * Math.PI / 2);",
      matlab: "y = @(x) sin((1 - x) * pi / 2);",
      excel: "=SIN((1-A1)*PI()/2)",
      desmos: "y = \\sin\\left(\\left(1 - x\\right) \\pi / 2\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-in", "sine-in-out", "cosine-out", "circular-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => sineOutCurve(params as SineOutParams),
    },
  };
}
