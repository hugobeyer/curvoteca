import {
  DEFAULT_SAMPLING,
  sineInOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SineInOutParams = typeof defaultParams;

export function sineInOutCurve(
  _params: SineInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sineInOutKernel;
  return {
    id: "sine-in-out",
    name: "Sine In Out",
    aliases: ["easeInOutSine", "full hermite sine", "sym sine"],
    family: "trigonometric",
    summary: "Sinusoidal ease in-out",
    formula: "y = 0.5 - 0.5 * cos(pi * x)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "sinusoidal", "ease-in-out", "symmetric"],
    useCases: ["ui-animation", "ease-in-out", "oscillators", "symmetric-blend"],

    snippets: {
      equation: "y = 0.5 - 0.5 * cos(pi * x)",
      js: "function sineInOut(x) { return 0.5 - 0.5 * Math.cos(x * Math.PI); }",
      glsl: "float sineInOut(float x) { return 0.5 - 0.5 * cos(x * 3.14159265); }",
      vex: "float sineInOut(float x) { return 0.5 - 0.5 * cos(x * M_PI); }",
      ts: "function sineInOut(x: number): number { return 0.5 - 0.5 * Math.cos(x * Math.PI); }",
      csharp:
        "float SineInOut(float x) { return 0.5f - 0.5f * MathF.Cos(x * 3.14159265f); }",
      rust: "fn sine_in_out(x: f64) -> f64 { 0.5 - 0.5 * (x * std::f64::consts::PI).cos() }",
      hlsl: "float sineInOut(float x) { return 0.5 - 0.5 * cos(x * 3.14159265); }",
      wgsl: "fn sineInOut(x: f32) -> f32 { return 0.5 - 0.5 * cos(x * 3.14159265); }",
      python: "def sine_in_out(x): return 0.5 - 0.5 * math.cos(x * math.pi)",
      css: "cubic-bezier(0.5, 0, 0.5, 1)",
      cpp: "float sineInOut(float x) { return 0.5f - 0.5f * std::cos(x * M_PI); }",
      lua: "function sineInOut(x) return 0.5 - 0.5 * math.cos(x * math.pi) end",
      gdscript:
        "func sineInOut(x: float) -> float: return 0.5 - 0.5 * cos(x * PI)",
      cuda: "__device__ float sineInOut(float x) { return 0.5f - 0.5f * cosf(x * 3.14159265f); }",
      c: "double sineInOut(double x) { return 0.5 - 0.5 * cos(x * M_PI); }",
      json: '{"name": "Sine In Out", "formula": "y = 0.5 - 0.5 * cos(pi * x)", "params": {}}',
      metal:
        "float sineInOut(float x) { return 0.5 - 0.5 * cos(x * 3.14159265); }",
      opencl:
        "float sineInOut(float x) { return 0.5f - 0.5f * cos(x * 3.14159265f); }",
      unity:
        "public static float SineInOut(float x) { return 0.5f - 0.5f * Mathf.Cos(x * 3.14159265f); }",
      shadertoy: "return 0.5 - 0.5 * cos(x * 3.14159265);",
      svelte:
        "export const sineInOut = (x) => 0.5 - 0.5 * Math.cos(x * Math.PI);",
      matlab: "y = @(x) 0.5 - 0.5 * cos(pi * x);",
      excel: "=0.5-0.5*COS(A1*PI())",
      desmos: "y = 0.5 - 0.5 \\cos\\left(\\pi x\\right)",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-in", "sine-ease", "cosine-in-out", "circular-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => sineInOutCurve(params as SineInOutParams),
    },
  };
}
