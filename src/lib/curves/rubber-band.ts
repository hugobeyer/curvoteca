import {
  DEFAULT_SAMPLING,
  rubberBandKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { stiffness: 3, damping: 0.5 } as const;
export type RubberBandParams = { stiffness: number; damping: number };

export function rubberBandCurve(
  params: RubberBandParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = rubberBandKernel(
    params.stiffness,
    params.damping,
  );
  return {
    id: "rubber-band",
    name: "Rubber Band",
    aliases: ["stretch", "elastic stretch", "rubber band ease"],
    family: "physics",
    summary: "Elastic stretch with overshoot",
    formula: "y = x + o * e^(-d*x) * sin(s*x)",
    continuity: "C0",
    domain: [0, 1],
    range: [-0.5, 1.5],
    tags: ["physics", "rubber", "stretch", "elastic", "overshoot"],
    useCases: [
      "physics-stretch",
      "rubber-band-animation",
      "elastic-ui",
      "playful-motion",
    ],
    snippets: {
      equation: "y = x + o * e^(-d*x) * sin(s*x)",
      js: "function rubberBand(x, s, d) { s = s == null ? 3 : s; d = d == null ? 0.5 : d; if (x === 0) return 0; if (x >= 1) return 1; var o = s > 0 ? 1 : -1; return x + o * Math.exp(-d * x) * Math.sin(s * x); }",
      ts: "function rubberBand(x: number, s: number = 3, d: number = 0.5): number { if (x === 0) return 0; if (x >= 1) return 1; const o = s > 0 ? 1 : -1; return x + o * Math.exp(-d * x) * Math.sin(s * x); }",
      glsl: "float rubberBand(float x, float s, float d) { s = (s == 0.0) ? 3.0 : s; d = (d == 0.0) ? 0.5 : d; if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; float o = s > 0.0 ? 1.0 : -1.0; return x + o * exp(-d * x) * sin(s * x); }",
      vex: "float rubberBand(float x; float s; float d) { if (s == 0) s = 3; if (d == 0) d = 0.5; if (x == 0) return 0; if (x >= 1) return 1; float o = s > 0 ? 1 : -1; return x + o * exp(-d * x) * sin(s * x); }",
      csharp: "float RubberBand(float x, float s = 3, float d = 0.5f) { if (x == 0) return 0; if (x >= 1) return 1; float o = s > 0 ? 1 : -1; return x + o * MathF.Exp(-d * x) * MathF.Sin(s * x); }",
      rust: "fn rubber_band(x: f64, s: f64, d: f64) -> f64 { let s = if s == 0.0 { 3.0 } else { s }; let d = if d == 0.0 { 0.5 } else { d }; if x == 0.0 { return 0.0; } if x >= 1.0 { return 1.0; } let o = if s > 0.0 { 1.0 } else { -1.0 }; x + o * (-d * x).exp() * (s * x).sin() }",
      hlsl: "float rubberBand(float x, float s, float d) { s = (s == 0.0) ? 3.0 : s; d = (d == 0.0) ? 0.5 : d; if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; float o = s > 0.0 ? 1.0 : -1.0; return x + o * exp(-d * x) * sin(s * x); }",
      wgsl: "fn rubber_band(x: f32, s: f32, d: f32) -> f32 { let s = select(3.0, s, s != 0.0); let d = select(0.5, d, d != 0.0); if (x == 0.0) { return 0.0; } if (x >= 1.0) { return 1.0; } let o = select(-1.0, 1.0, s > 0.0); return x + o * exp(-d * x) * sin(s * x); }",
      python: "def rubber_band(x, s=3, d=0.5): s = s or 3; d = d or 0.5; if x == 0: return 0; if x >= 1: return 1; o = 1 if s > 0 else -1; return x + o * math.exp(-d * x) * math.sin(s * x)",
      css: "cubic-bezier(0.25, 1.5, 0.75, 0.5)",
      cpp: "float rubberBand(float x, float s = 3.0f, float d = 0.5f) { if (x == 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; float o = s > 0.0f ? 1.0f : -1.0f; return x + o * std::exp(-d * x) * std::sin(s * x); }",
      lua: "function rubberBand(x, s, d) s = s or 3; d = d or 0.5; if x == 0 then return 0 end; if x >= 1 then return 1 end; local o = s > 0 and 1 or -1; return x + o * math.exp(-d * x) * math.sin(s * x) end",
      gdscript: "func rubberBand(x: float, s: float = 3.0, d: float = 0.5) -> float: if x == 0.0: return 0.0; if x >= 1.0: return 1.0; var o = 1.0 if s > 0.0 else -1.0; return x + o * exp(-d * x) * sin(s * x)",
      cuda: "__device__ float rubberBand(float x, float s, float d) { if (x == 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; float o = s > 0.0f ? 1.0f : -1.0f; return x + o * expf(-d * x) * sinf(s * x); }",
      c: "double rubberBand(double x, double s, double d) { if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; double o = s > 0.0 ? 1.0 : -1.0; return x + o * exp(-d * x) * sin(s * x); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["spring", "overshoot-settle", "elastic-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => rubberBandCurve(p as RubberBandParams),
    },
  };
}
