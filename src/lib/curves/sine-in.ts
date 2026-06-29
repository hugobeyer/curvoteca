import { DEFAULT_SAMPLING, sineInKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SineInParams = typeof defaultParams;

export function sineInCurve(
  _params: SineInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sineInKernel;
  return {
    id: "sine-in",
    name: "Sine In",
    aliases: ["easeInSine", "sin in", "quarter sine in"],
    family: "trigonometric",
    summary: "Sinusoidal ease-in",
    formula: "y = 1 - cos(x * pi / 2)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "sinusoidal", "ease-in"],
    useCases: ["ui-animation", "ease-in", "accelerate-from-rest"],

    snippets: {
      equation: "y = 1 - cos(x * pi / 2)",
      js: "function sineIn(x) { return 1 - Math.cos(x * Math.PI / 2); }",
      glsl: "float sineIn(float x) { return 1.0 - cos(x * 1.57079633); }",
      vex: "float sineIn(float x) { return 1 - cos(x * M_PI / 2); }",
      ts: "function sineIn(x: number): number { return 1 - Math.cos(x * Math.PI / 2); }",
      csharp: "float SineIn(float x) { return 1.0f - MathF.Cos(x * 1.57079633f); }",
      rust: "fn sine_in(x: f64) -> f64 { 1.0 - (x * std::f64::consts::PI / 2.0).cos() }",
      hlsl: "float sineIn(float x) { return 1.0 - cos(x * 1.57079633); }",
      wgsl: "fn sineIn(x: f32) -> f32 { return 1.0 - cos(x * 1.57079633); }",
      python: "def sine_in(x): return 1 - math.cos(x * math.pi / 2)",
      css: "cubic-bezier(0.5, 0, 1, 1)",
      cpp: "float sineIn(float x) { return 1.0f - std::cos(x * M_PI / 2.0f); }",
      lua: "function sineIn(x) return 1 - math.cos(x * math.pi / 2) end",
      gdscript: "func sineIn(x: float) -> float: return 1.0 - cos(x * PI / 2.0)",
      cuda: "__device__ float sineIn(float x) { return 1.0f - cosf(x * 1.57079633f); }",
      c: "double sineIn(double x) { return 1.0 - cos(x * M_PI / 2.0); }",
      json: "{\"name\": \"Sine In\", \"formula\": \"y = 1 - cos(x * pi / 2)\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-ease", "sine-in-out", "cosine-in", "circular-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => sineInCurve(params as SineInParams),
    },
  };
}
