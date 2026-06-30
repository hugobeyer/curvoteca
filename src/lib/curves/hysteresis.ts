import {
  DEFAULT_SAMPLING,
  hysteresisKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { threshold: 0.3, width: 0.1 } as const;
export type HysteresisParams = { threshold: number; width: number };

export function hysteresisCurve(
  params: HysteresisParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = hysteresisKernel(params.threshold, params.width);
  return {
    id: "hysteresis",
    name: "Hysteresis / Schmitt Trigger",
    family: "utility",
    summary: "Schmitt trigger with two switching thresholds",
    formula: "y = hysteresis threshold with two switching points",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [0, 1],
    tags: ["utility", "hysteresis", "schmitt-trigger", "threshold", "debouce"],
    useCases: [
      "threshold-detection",
      "signal-debounce",
      "noise-gating",
      "control-systems",
    ],
    snippets: {
      equation: "y = hysteresis threshold with two switching points",
      js: "function hysteresis(x, t, w) { t = t == null ? 0.3 : t; w = w == null ? 0.1 : w; if (x < t - w) return 0; if (x > t + w) return 1; return (x - (t - w)) / (2 * w); }",
      ts: "function hysteresis(x: number, t: number = 0.3, w: number = 0.1): number { if (x < t - w) return 0; if (x > t + w) return 1; return (x - (t - w)) / (2 * w); }",
      glsl: "float hysteresis(float x, float t, float w) { t = (t < 0.01) ? 0.3 : t; w = (w < 0.001) ? 0.1 : w; if (x < t - w) return 0.0; if (x > t + w) return 1.0; return (x - (t - w)) / (2.0 * w); }",
      vex: "float hysteresis(float x; float t; float w) { if (t < 0.01) t = 0.3; if (w < 0.001) w = 0.1; if (x < t - w) return 0; if (x > t + w) return 1; return (x - (t - w)) / (2 * w); }",
      csharp:
        "float Hysteresis(float x, float t = 0.3f, float w = 0.1f) { if (x < t - w) return 0; if (x > t + w) return 1; return (x - (t - w)) / (2 * w); }",
      rust: "fn hysteresis(x: f64, t: f64, w: f64) -> f64 { let t = if t < 0.01 { 0.3 } else { t }; let w = if w < 0.001 { 0.1 } else { w }; if x < t - w { return 0.0; } if x > t + w { return 1.0; } (x - (t - w)) / (2.0 * w) }",
      hlsl: "float hysteresis(float x, float t, float w) { t = (t < 0.01) ? 0.3 : t; w = (w < 0.001) ? 0.1 : w; if (x < t - w) return 0.0; if (x > t + w) return 1.0; return (x - (t - w)) / (2.0 * w); }",
      wgsl: "fn hysteresis(x: f32, t: f32, w: f32) -> f32 { let t = max(t, 0.01); let w = max(w, 0.001); if (x < t - w) { return 0.0; } if (x > t + w) { return 1.0; } return (x - (t - w)) / (2.0 * w); }",
      python:
        "def hysteresis(x, t=0.3, w=0.1): if x < t - w: return 0; if x > t + w: return 1; return (x - (t - w)) / (2 * w)",
      cpp: "float hysteresis(float x, float t = 0.3f, float w = 0.1f) { if (x < t - w) return 0.0f; if (x > t + w) return 1.0f; return (x - (t - w)) / (2.0f * w); }",
      lua: "function hysteresis(x, t, w) t = t or 0.3; w = w or 0.1; if x < t - w then return 0 end; if x > t + w then return 1 end; return (x - (t - w)) / (2 * w) end",
      gdscript:
        "func hysteresis(x: float, t: float = 0.3, w: float = 0.1) -> float: if x < t - w: return 0; if x > t + w: return 1; return (x - (t - w)) / (2 * w)",
      cuda: "__device__ float hysteresis(float x, float t, float w) { if (x < t - w) return 0.0f; if (x > t + w) return 1.0f; return (x - (t - w)) / (2.0f * w); }",
      c: "double hysteresis(double x, double t, double w) { if (x < t - w) return 0; if (x > t + w) return 1; return (x - (t - w)) / (2 * w); }",
      metal:
        "float hysteresis(float x, float t, float w) { t = (t < 0.01) ? 0.3 : t; w = (w < 0.001) ? 0.1 : w; if (x < t - w) return 0.0; if (x > t + w) return 1.0; return (x - (t - w)) / (2.0 * w); }",
      opencl:
        "float hysteresis(float x, float t, float w) { t = (t < 0.01f) ? 0.3f : t; w = (w < 0.001f) ? 0.1f : w; if (x < t - w) return 0.0f; if (x > t + w) return 1.0f; return (x - (t - w)) / (2.0f * w); }",
      unity:
        "public static float Hysteresis(float x, float t, float w) { if (x < t - w) return 0.0f; if (x > t + w) return 1.0f; return (x - (t - w)) / (2.0f * w); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["step", "dead-zone", "clamp"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => hysteresisCurve(p as HysteresisParams),
    },
  };
}
