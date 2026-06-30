import {
  circularInOutKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type CircularInOutParams = typeof defaultParams;

export function circularInOutCurve(
  _params: CircularInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = circularInOutKernel;
  return {
    id: "circular-in-out",
    name: "Circular In Out",
    aliases: ["easeInOutCirc", "circ in out", "symmetric circular"],
    family: "trigonometric",
    summary: "Circular ease in-out",
    formula: "y = (1 - cos(pi * x)) / 2",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "trig", "circular", "ease-in-out", "symmetric"],
    useCases: [
      "ui-animation",
      "ease-in-out",
      "symmetric-blend",
      "motion-blend",
    ],
    snippets: {
      equation: "y = (1 - cos(pi * x)) / 2",
      js: "function circularInOut(x) { return (1 - Math.cos(x * Math.PI)) / 2; }",
      ts: "function circularInOut(x: number): number { return (1 - Math.cos(x * Math.PI)) / 2; }",
      glsl: "float circularInOut(float x) { return (1.0 - cos(x * 3.14159265)) / 2.0; }",
      vex: "float circularInOut(float x) { return (1 - cos(x * M_PI)) / 2; }",
      csharp:
        "float CircularInOut(float x) { return (1 - MathF.Cos(x * MathF.PI)) / 2; }",
      rust: "fn circular_in_out(x: f64) -> f64 { (1.0 - (x * std::f64::consts::PI).cos()) / 2.0 }",
      hlsl: "float circularInOut(float x) { return (1.0 - cos(x * 3.14159265)) / 2.0; }",
      wgsl: "fn circular_in_out(x: f32) -> f32 { return (1.0 - cos(x * 3.14159265)) / 2.0; }",
      python: "def circular_in_out(x): return (1 - math.cos(x * math.pi)) / 2",
      cpp: "float circularInOut(float x) { return (1.0f - std::cos(x * std::numbers::pi)) / 2.0f; }",
      lua: "function circularInOut(x) return (1 - math.cos(x * math.pi)) / 2 end",
      gdscript:
        "func circularInOut(x: float) -> float: return (1 - cos(x * PI)) / 2",
      cuda: "__device__ float circularInOut(float x) { return (1.0f - cosf(x * 3.14159265f)) / 2.0f; }",
      c: "double circularInOut(double x) { return (1.0 - cos(x * M_PI)) / 2.0; }",
      json: '{"name": "Circular In Out", "formula": "y = (1 - cos(pi * x)) / 2", "params": {}}',
      metal:
        "float circularInOut(float x) { return (1.0 - cos(x * 3.14159265)) / 2.0; }",
      opencl:
        "float circularInOut(float x) { return (1.0f - cosf(x * 3.14159265f)) / 2.0f; }",
      unity:
        "public static float CircularInOut(float x) { return (1 - MathF.Cos(x * MathF.PI)) / 2; }",
      shadertoy: "return (1.0 - cos(x * 3.14159265)) / 2.0;",
      svelte:
        "export const circularInOut = (x) => (1 - Math.cos(x * Math.PI)) / 2;",
      matlab: "y = @(x) (1 - cos(x * pi)) / 2;",
      excel: "=(1-COS(A1*PI()))/2",
      desmos: "y = (1 - \\cos(x \\pi)) / 2",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["circular-in", "circular-out", "sine-in-out", "cosine-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => circularInOutCurve(params as CircularInOutParams),
    },
  };
}
