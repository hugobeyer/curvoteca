import {
  DEFAULT_SAMPLING,
  sCurveContrastKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { contrast: 1 } as const;
export type SCurveContrastParams = { contrast: number };

export function sCurveContrastCurve(
  params: SCurveContrastParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sCurveContrastKernel(params.contrast);
  return {
    id: "s-curve-contrast",
    name: "S-Curve Contrast",
    aliases: [],
    family: "adjustment",
    summary: "S-curve contrast adjustment",
    formula: "y = (t > 0.5) ? 1 - (1-t)^(2*c) : t^(2*c)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["adjustment", "contrast", "image", "s-curve", "tone"],
    useCases: [
      "image-processing",
      "contrast-adjustment",
      "tone-curve",
      "color-grading",
    ],
    snippets: {
      equation: "y = (t > 0.5) ? 1 - (1-t)^(2*c) : t^(2*c)",
      js: "function sCurveContrast(x, c) { c = c == null ? 1 : c; return x > 0.5 ? 1 - Math.pow(1 - x, 2 * c) : Math.pow(x, 2 * c); }",
      ts: "function sCurveContrast(x: number, c: number = 1): number { return x > 0.5 ? 1 - Math.pow(1 - x, 2 * c) : Math.pow(x, 2 * c); }",
      glsl: "float sCurveContrast(float x, float c) { c = (c == 0.0) ? 1.0 : c; return x > 0.5 ? 1.0 - pow(1.0 - x, 2.0 * c) : pow(x, 2.0 * c); }",
      vex: "float sCurveContrast(float x; float c) { if (c == 0) c = 1; return x > 0.5 ? 1 - pow(1 - x, 2 * c) : pow(x, 2 * c); }",
      csharp: "float SCurveContrast(float x, float c = 1) { return x > 0.5f ? 1 - MathF.Pow(1 - x, 2 * c) : MathF.Pow(x, 2 * c); }",
      rust: "fn s_curve_contrast(x: f64, c: f64) -> f64 { let c = if c == 0.0 { 1.0 } else { c }; if x > 0.5 { 1.0 - (1.0 - x).powf(2.0 * c) } else { x.powf(2.0 * c) } }",
      hlsl: "float sCurveContrast(float x, float c) { c = (c == 0.0) ? 1.0 : c; return x > 0.5 ? 1.0 - pow(1.0 - x, 2.0 * c) : pow(x, 2.0 * c); }",
      wgsl: "fn s_curve_contrast(x: f32, c: f32) -> f32 { let c = select(1.0, c, c != 0.0); return select(pow(x, 2.0 * c), 1.0 - pow(1.0 - x, 2.0 * c), x > 0.5); }",
      python: "def s_curve_contrast(x, c=1): c = c or 1; return 1 - math.pow(1 - x, 2 * c) if x > 0.5 else math.pow(x, 2 * c)",
      css: "cubic-bezier(0.5, 0, 0.5, 1)",
      cpp: "float sCurveContrast(float x, float c = 1.0f) { return x > 0.5f ? 1.0f - std::pow(1.0f - x, 2.0f * c) : std::pow(x, 2.0f * c); }",
      lua: "function sCurveContrast(x, c) c = c or 1; return x > 0.5 and 1 - (1 - x) ^ (2 * c) or x ^ (2 * c) end",
      gdscript: "func sCurveContrast(x: float, c: float = 1.0) -> float: return 1.0 - pow(1.0 - x, 2.0 * c) if x > 0.5 else pow(x, 2.0 * c)",
      cuda: "__device__ float sCurveContrast(float x, float c) { return x > 0.5f ? 1.0f - powf(1.0f - x, 2.0f * c) : powf(x, 2.0f * c); }",
      c: "double sCurveContrast(double x, double c) { return x > 0.5 ? 1.0 - pow(1.0 - x, 2.0 * c) : pow(x, 2.0 * c); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["gain", "bias", "logistic", "signed-logistic"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sCurveContrastCurve(p as SCurveContrastParams),
    },
  };
}
