import {
  DEFAULT_SAMPLING,
  overshootSettleKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { overshoot: 0.2, settle: 0.5 } as const;
export type OvershootSettleParams = { overshoot: number; settle: number };

export function overshootSettleCurve(
  params: OvershootSettleParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = overshootSettleKernel(
    params.overshoot,
    params.settle,
  );
  return {
    id: "overshoot-settle",
    name: "Overshoot + Settle",
    aliases: ["overshoot ease", "over-ease", "overshoot settle"],
    family: "easing",
    summary: "Ease that overshoots then settles back",
    formula: "y = x + overshoot * x * (1-x) * e^(-settle * x)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "overshoot", "spring", "settle"],
    useCases: [
      "ui-animation",
      "exaggerated-ease",
      "overshoot-transition",
      "playful-motion",
    ],
    snippets: {
      equation: "y = x + overshoot * x * (1-x) * e^(-settle * x)",
      js: "function overshootSettle(x, o, s) { o = o == null ? 0.2 : o; s = s == null ? 0.5 : s; return x + o * x * (1 - x) * Math.exp(-s * x); }",
      ts: "function overshootSettle(x: number, o: number = 0.2, s: number = 0.5): number { return x + o * x * (1 - x) * Math.exp(-s * x); }",
      glsl: "float overshootSettle(float x, float o, float s) { o = (o < -10.0) ? 0.2 : o; s = (s == 0.0) ? 0.5 : s; return x + o * x * (1.0 - x) * exp(-s * x); }",
      vex: "float overshootSettle(float x; float o; float s) { if (o < -10) o = 0.2; if (s == 0) s = 0.5; return x + o * x * (1 - x) * exp(-s * x); }",
      csharp:
        "float OvershootSettle(float x, float o = 0.2f, float s = 0.5f) { return x + o * x * (1 - x) * MathF.Exp(-s * x); }",
      rust: "fn overshoot_settle(x: f64, o: f64, s: f64) -> f64 { x + o * x * (1.0 - x) * (-s * x).exp() }",
      hlsl: "float overshootSettle(float x, float o, float s) { o = (o < -10.0) ? 0.2 : o; s = (s == 0.0) ? 0.5 : s; return x + o * x * (1.0 - x) * exp(-s * x); }",
      wgsl: "fn overshoot_settle(x: f32, o: f32, s: f32) -> f32 { let o = select(0.2, o, o >= -10.0); let s = select(0.5, s, s != 0.0); return x + o * x * (1.0 - x) * exp(-s * x); }",
      python:
        "def overshoot_settle(x, o=0.2, s=0.5): o = o if o >= -10 else 0.2; s = s or 0.5; return x + o * x * (1 - x) * math.exp(-s * x)",
      cpp: "float overshootSettle(float x, float o = 0.2f, float s = 0.5f) { return x + o * x * (1.0f - x) * std::exp(-s * x); }",
      lua: "function overshootSettle(x, o, s) o = o or 0.2; s = s or 0.5; return x + o * x * (1 - x) * math.exp(-s * x) end",
      gdscript:
        "func overshootSettle(x: float, o: float = 0.2, s: float = 0.5) -> float: return x + o * x * (1 - x) * exp(-s * x)",
      cuda: "__device__ float overshootSettle(float x, float o, float s) { return x + o * x * (1.0f - x) * expf(-s * x); }",
      c: "#include <math.h>\ndouble overshootSettle(double x, double o, double s) { return x + o * x * (1.0 - x) * exp(-s * x); }",
      metal:
        "float overshootSettle(float x, float o, float s) { o = (o < -10.0) ? 0.2 : o; s = (s == 0.0) ? 0.5 : s; return x + o * x * (1.0 - x) * exp(-s * x); }",
      opencl:
        "float overshootSettle(float x, float o, float s) { o = (o < -10.0f) ? 0.2f : o; s = (s == 0.0f) ? 0.5f : s; return x + o * x * (1.0f - x) * exp(-s * x); }",
      unity:
        "public static float OvershootSettle(float x, float o, float s) { return x + o * x * (1.0f - x) * Mathf.Exp(-s * x); }",
      matlab: "y = @(x, o, s) x + o * x * (1 - x) * exp(-s * x);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["spring", "elastic-out", "back-out", "anticipate"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => overshootSettleCurve(p as OvershootSettleParams),
    },
  };
}
