import { clampKernel, DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { lo: 0, hi: 1 } as const;
export type ClampParams = { lo: number; hi: number };

export function clampCurve(
  params: ClampParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = clampKernel(params.lo, params.hi);
  return {
    id: "clamp",
    name: "Clamp Fit",
    aliases: ["clamp remap", "clipped linear", "linear with flat ends"],
    family: "utility",
    summary: "Linear fit with clamped ends",
    formula: "y = lo if x <= lo, x if lo < x < hi, hi if x >= hi",
    continuity: "C0",
    domain: [0, 1],
    range: [params.lo, params.hi],
    tags: ["remap", "ui", "clamp", "fit", "tooling"],
    useCases: [
      "range-remapping",
      "ui-clamping",
      "control-input",
      "output-shaping",
    ],
    snippets: {
      equation: "y = lo if x <= lo, x if lo < x < hi, hi if x >= hi",
      js: "function clampFit(x, lo, hi) { return x <= lo ? lo : x >= hi ? hi : x; }",
      glsl: "float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      vex: "float clampFit(float x; float lo; float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      ts: "function clampFit(x: number, lo: number, hi: number): number { return x <= lo ? lo : x >= hi ? hi : x; }",
      csharp:
        "float ClampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      rust: "fn clamp_fit(x: f64, lo: f64, hi: f64) -> f64 { if x <= lo { lo } else if x >= hi { hi } else { x } }",
      hlsl: "float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      wgsl: "fn clampFit(x: f32, lo: f32, hi: f32) -> f32 { return select(select(x, hi, x >= hi), lo, x <= lo); }",
      python:
        "def clamp_fit(x, lo, hi): return lo if x <= lo else (hi if x >= hi else x)",
      cpp: "float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      lua: "function clampFit(x, lo, hi) return x <= lo and lo or (x >= hi and hi or x) end",
      gdscript:
        "func clamp_fit(x: float, lo: float, hi: float) -> float: return lo if x <= lo else (hi if x >= hi else x)",
      cuda: "__device__ float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      c: "double clampFit(double x, double lo, double hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      json: '{"name": "Clamp Fit", "formula": "y = lo if x <= lo, x if lo < x < hi, hi if x >= hi", "params": {"lo": 0, "hi": 1}}',
      metal:
        "float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      opencl:
        "float clampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      unity:
        "public static float ClampFit(float x, float lo, float hi) { return x <= lo ? lo : (x >= hi ? hi : x); }",
      shadertoy: "return x <= lo ? lo : (x >= hi ? hi : x);",
      matlab: "y = @(x, lo, hi) min(max(x, lo), hi);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["linear", "soft-dead-zone", "dead-zone"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => clampCurve(p as ClampParams),
    },
  };
}
