import { DEFAULT_SAMPLING, exponentialInOutKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type ExponentialInOutParams = typeof defaultParams;

export function exponentialInOutCurve(
  _params: ExponentialInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = exponentialInOutKernel;
  return {
    id: "exponential-in-out",
    name: "Exponential In Out",
    aliases: ["easeInOutExpo", "ease-in-out-expo", "expo in out"],
    family: "easing",
    summary: "Exponential ease-in-out",
    formula: "y = 0 if x=0; (2^(20x-10))/2 if x<0.5; 1 if x=1; (2 - 2^(-20x+10))/2 else",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-in-out", "exponential", "css"],
    useCases: ["ui-animation", "ease-in-out", "symmetric-motion"],

    snippets: {
      equation: "y = 0 if x=0; 2^(20x-10)/2 if x<0.5; 1 if x=1; (2 - 2^(-20x+10))/2 else",
      js: "function exponentialInOut(x) { if (x === 0) return 0; if (x === 1) return 1; return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; }",
      glsl: "float exponentialInOut(float x) { if (x == 0.0) return 0.0; if (x == 1.0) return 1.0; return x < 0.5 ? pow(2.0, 20.0 * x - 10.0) / 2.0 : (2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0; }",
      vex: "float exponentialInOut(float x) { if (x == 0) return 0; if (x == 1) return 1; return x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2; }",
      ts: "function exponentialInOut(x: number): number { if (x === 0) return 0; if (x === 1) return 1; return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2; }",
      csharp: "float ExponentialInOut(float x) { if (x == 0.0f) return 0.0f; if (x == 1.0f) return 1.0f; return x < 0.5f ? MathF.Pow(2.0f, 20.0f * x - 10.0f) / 2.0f : (2.0f - MathF.Pow(2.0f, -20.0f * x + 10.0f)) / 2.0f; }",
      rust: "fn exponential_in_out(x: f64) -> f64 { if x == 0.0 { return 0.0; } if x == 1.0 { return 1.0; } if x < 0.5 { (2.0_f64).powf(20.0 * x - 10.0) / 2.0 } else { (2.0 - (2.0_f64).powf(-20.0 * x + 10.0)) / 2.0 } }",
      hlsl: "float exponentialInOut(float x) { if (x == 0.0) return 0.0; if (x == 1.0) return 1.0; return x < 0.5 ? pow(2.0, 20.0 * x - 10.0) / 2.0 : (2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0; }",
      wgsl: "fn exponentialInOut(x: f32) -> f32 { if (x == 0.0) { return 0.0; } if (x == 1.0) { return 1.0; } return select((2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0, pow(2.0, 20.0 * x - 10.0) / 2.0, x < 0.5); }",
      python: "def exponential_in_out(x): if x == 0: return 0; if x == 1: return 1; return math.pow(2, 20 * x - 10) / 2 if x < 0.5 else (2 - math.pow(2, -20 * x + 10)) / 2",
      cpp: "#include <cmath>\nfloat exponentialInOut(float x) { if (x == 0.0f) return 0.0f; if (x == 1.0f) return 1.0f; return x < 0.5f ? std::pow(2.0f, 20.0f * x - 10.0f) / 2.0f : (2.0f - std::pow(2.0f, -20.0f * x + 10.0f)) / 2.0f; }",
      lua: "function exponentialInOut(x) if x == 0 then return 0 end; if x == 1 then return 1 end; return x < 0.5 and math.pow(2, 20 * x - 10) / 2 or (2 - math.pow(2, -20 * x + 10)) / 2 end",
      gdscript: "func exponential_in_out(x: float) -> float: if x == 0.0: return 0.0; if x == 1.0: return 1.0; return pow(2.0, 20.0 * x - 10.0) / 2.0 if x < 0.5 else (2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0",
      cuda: "__device__ float exponentialInOut(float x) { if (x == 0.0f) return 0.0f; if (x == 1.0f) return 1.0f; return x < 0.5f ? powf(2.0f, 20.0f * x - 10.0f) / 2.0f : (2.0f - powf(2.0f, -20.0f * x + 10.0f)) / 2.0f; }",
      c: "#include <math.h>\ndouble exponentialInOut(double x) { if (x == 0.0) return 0.0; if (x == 1.0) return 1.0; return x < 0.5 ? pow(2.0, 20.0 * x - 10.0) / 2.0 : (2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0; }",
      json: '{"name": "Exponential In Out", "formula": "y = 0 if x=0; 2^(20x-10)/2 if x<0.5; 1 if x=1; (2 - 2^(-20x+10))/2 else", "params": {}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["exponential-in", "exponential-out", "quintic-in-out", "sine-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => exponentialInOutCurve(params as ExponentialInOutParams),
    },
  };
}
