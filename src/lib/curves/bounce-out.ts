import {
  bounceOutKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { n: 4, k: 2 } as const;
export type BounceOutParams = { n: number; k: number };

export function bounceOutCurve(
  params: BounceOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = bounceOutKernel(params.n, params.k);
  return {
    id: "bounce-out",
    name: "Bounce Out",
    aliases: ["easeOutBounce", "settle bounce", "decaying bounce"],
    family: "trigonometric",
    summary: "Decaying bounce settle",
    formula: "y = 1 - (1-x)^k * (1 + cos(2*pi*n*x)) / 2",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "bounce", "ease-out", "physics"],
    useCases: [
      "ui-animation",
      "bounce-settle",
      "physics-style",
      "playful-ease",
    ],
    snippets: {
      equation: "y = 1 - (1-x)^k * (1 + cos(2*pi*n*x)) / 2",
      js: "function bounceOut(x, n, k) { n = n == null ? 4 : n; k = k == null ? 2 : k; if (x <= 0) return 0; if (x >= 1) return 1; return 1 - Math.pow(1 - x, k) * (1 + Math.cos(2 * Math.PI * n * x)) / 2; }",
      ts: "function bounceOut(x: number, n: number = 4, k: number = 2): number { if (x <= 0) return 0; if (x >= 1) return 1; return 1 - Math.pow(1 - x, k) * (1 + Math.cos(2 * Math.PI * n * x)) / 2; }",
      glsl: "float bounceOut(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - pow(1.0 - x, k) * (1.0 + cos(2.0 * 3.14159265 * n * x)) / 2.0; }",
      vex: "float bounceOut(float x; float n; float k) { if (n < 1) n = 4; if (k == 0) k = 2; if (x <= 0) return 0; if (x >= 1) return 1; return 1 - pow(1 - x, k) * (1 + cos(2 * M_PI * n * x)) / 2; }",
      csharp: "float BounceOut(float x, float n = 4, float k = 2) { if (x <= 0) return 0; if (x >= 1) return 1; return 1 - MathF.Pow(1 - x, k) * (1 + MathF.Cos(2 * MathF.PI * n * x)) / 2; }",
      rust: "fn bounce_out(x: f64, n: f64, k: f64) -> f64 { let n = if n < 1.0 { 4.0 } else { n }; let k = if k == 0.0 { 2.0 } else { k }; if x <= 0.0 { return 0.0; } if x >= 1.0 { return 1.0; } 1.0 - (1.0 - x).powf(k) * (1.0 + (2.0 * std::f64::consts::PI * n * x).cos()) / 2.0 }",
      hlsl: "float bounceOut(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - pow(1.0 - x, k) * (1.0 + cos(2.0 * 3.14159265 * n * x)) / 2.0; }",
      wgsl: "fn bounce_out(x: f32, n: f32, k: f32) -> f32 { let n = select(4.0, n, n >= 1.0); let k = select(2.0, k, k != 0.0); if (x <= 0.0) { return 0.0; } if (x >= 1.0) { return 1.0; } return 1.0 - pow(1.0 - x, k) * (1.0 + cos(2.0 * 3.14159265 * n * x)) / 2.0; }",
      python: "def bounce_out(x, n=4, k=2): if x <= 0: return 0; if x >= 1: return 1; return 1 - (1 - x) ** k * (1 + math.cos(2 * math.pi * n * x)) / 2",
      css: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      cpp: "float bounceOut(float x, float n = 4.0f, float k = 2.0f) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; return 1.0f - std::pow(1.0f - x, k) * (1.0f + std::cos(2.0f * std::numbers::pi * n * x)) / 2.0f; }",
      lua: "function bounceOut(x, n, k) n = n or 4 k = k or 2 if x <= 0 then return 0 end if x >= 1 then return 1 end return 1 - (1 - x) ^ k * (1 + math.cos(2 * math.pi * n * x)) / 2 end",
      gdscript: "func bounceOut(x: float, n: float = 4.0, k: float = 2.0) -> float: if x <= 0: return 0; if x >= 1: return 1; return 1 - pow(1 - x, k) * (1 + cos(2 * PI * n * x)) / 2",
      cuda: "__device__ float bounceOut(float x, float n, float k) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; return 1.0f - powf(1.0f - x, k) * (1.0f + cosf(2.0f * 3.14159265f * n * x)) / 2.0f; }",
      c: "double bounceOut(double x, double n, double k) { if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - pow(1.0 - x, k) * (1.0 + cos(2.0 * M_PI * n * x)) / 2.0; }",
      json: '{"name": "Bounce Out", "formula": "y = 1 - (1-x)^k * (1 + cos(2*pi*n*x)) / 2", "params": {"n": 4, "k": 2}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["bounce-in", "bounce-in-out", "back-out", "elastic-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => bounceOutCurve(p as BounceOutParams),
    },
  };
}
