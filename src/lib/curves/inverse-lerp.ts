import {
  DEFAULT_SAMPLING,
  inverseLerpKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { lo: 0.2, hi: 0.8 } as const;
export type InverseLerpParams = { lo: number; hi: number };

export function inverseLerpCurve(
  params: InverseLerpParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = inverseLerpKernel(params.lo, params.hi);
  return {
    id: "inverse-lerp",
    name: "Inverse Lerp",
    aliases: ["inverse linear interpolation", "normalize range", "unlerp"],
    family: "utility",
    summary: "Inverse linear interpolation",
    formula: "y = (t - lo) / (hi - lo)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["utility", "interpolation", "mapping", "normalization"],
    useCases: ["range-normalization", "parameter-unmapping", "value-scaling"],
    snippets: {
      equation: "y = (t - lo) / (hi - lo)",
      js: "function inverseLerp(x, lo, hi) { lo = lo == null ? 0.2 : lo; hi = hi == null ? 0.8 : hi; return (x - lo) / (hi - lo); }",
      ts: "function inverseLerp(x: number, lo: number = 0.2, hi: number = 0.8): number { return (x - lo) / (hi - lo); }",
      glsl: "float inverseLerp(float x, float lo, float hi) { lo = (lo >= hi) ? 0.2 : lo; hi = (hi <= lo) ? 0.8 : hi; return (x - lo) / (hi - lo); }",
      vex: "float inverseLerp(float x; float lo; float hi) { if (lo >= hi) lo = 0.2; if (hi <= lo) hi = 0.8; return (x - lo) / (hi - lo); }",
      csharp:
        "float InverseLerp(float x, float lo = 0.2f, float hi = 0.8f) { return (x - lo) / (hi - lo); }",
      rust: "fn inverse_lerp(x: f64, lo: f64, hi: f64) -> f64 { (x - lo) / (hi - lo) }",
      hlsl: "float inverseLerp(float x, float lo, float hi) { return (x - lo) / (hi - lo); }",
      wgsl: "fn inverse_lerp(x: f32, lo: f32, hi: f32) -> f32 { return (x - lo) / (hi - lo); }",
      python:
        "def inverse_lerp(x, lo=0.2, hi=0.8): return (x - lo) / (hi - lo)",
      cpp: "float inverseLerp(float x, float lo = 0.2f, float hi = 0.8f) { return (x - lo) / (hi - lo); }",
      lua: "function inverseLerp(x, lo, hi) lo = lo or 0.2; hi = hi or 0.8; return (x - lo) / (hi - lo) end",
      gdscript:
        "func inverse_lerp(x: float, lo: float = 0.2, hi: float = 0.8) -> float: return (x - lo) / (hi - lo)",
      cuda: "__device__ float inverseLerp(float x, float lo, float hi) { return (x - lo) / (hi - lo); }",
      c: "double inverse_lerp(double x, double lo, double hi) { return (x - lo) / (hi - lo); }",
      json: '{"name": "Inverse Lerp", "formula": "y = (t - lo) / (hi - lo)", "params": {"lo": 0.2, "hi": 0.8}}',
      metal:
        "float inverseLerp(float x, float lo, float hi) { lo = (lo >= hi) ? 0.2 : lo; hi = (hi <= lo) ? 0.8 : hi; return (x - lo) / (hi - lo); }",
      opencl:
        "float inverseLerp(float x, float lo, float hi) { lo = (lo >= hi) ? 0.2f : lo; hi = (hi <= lo) ? 0.8f : hi; return (x - lo) / (hi - lo); }",
      unity:
        "public static float InverseLerp(float x, float lo, float hi) { return (x - lo) / (hi - lo); }",
      matlab: "y = @(x, lo, hi) (x - lo) / (hi - lo);",
      excel: "=(A1-A2)/(A3-A2)",
      desmos: "y=\\frac{x-lo}{hi-lo}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["remap", "linear", "lerp"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => inverseLerpCurve(p as InverseLerpParams),
    },
  };
}
