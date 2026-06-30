import {
  DEFAULT_SAMPLING,
  bounceInOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { n: 4, k: 2 } as const;
export type BounceInOutParams = { n: number; k: number };

export function bounceInOutCurve(
  params: BounceInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = bounceInOutKernel(params.n, params.k);
  return {
    id: "bounce-in-out",
    name: "Bounce In-Out",
    aliases: ["easeInOutBounce", "bounce in-out", "bounce symmetric"],
    family: "trigonometric",
    summary: "Symmetric bouncing ease-in-out",
    formula:
      "y = (x < 0.5) ? 0.5 * (1 - bounce_out(1 - 2x)) : 0.5 * (1 + bounce_out(2x - 1))",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "bounce", "ease-in-out", "physics"],
    useCases: [
      "ui-animation",
      "bounce-transitions",
      "physics-style",
      "playful-ease",
    ],
    snippets: {
      equation:
        "y = (x < 0.5) ? 0.5 * (1 - bounce_out(1 - 2x)) : 0.5 * (1 + bounce_out(2x - 1))",
      js: "function bounceInOut(x, n, k) { n = n == null ? 4 : n; k = k == null ? 2 : k; if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5) return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)); return 0.5 * (1 + bounceOut(2 * x - 1, n, k)); function bounceOut(t, n, k) { if (t <= 0) return 0; if (t >= 1) return 1; var env = Math.pow(1 - t, k); var osc = (1 + Math.cos(2 * Math.PI * n * t)) / 2; return 1 - env * osc; } }",
      ts: "function bounceInOut(x: number, n: number = 4, k: number = 2): number { if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5) return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)); return 0.5 * (1 + bounceOut(2 * x - 1, n, k)); function bounceOut(t: number, n: number, k: number): number { if (t <= 0) return 0; if (t >= 1) return 1; const env = Math.pow(1 - t, k); const osc = (1 + Math.cos(2 * Math.PI * n * t)) / 2; return 1 - env * osc; } }",
      glsl: "float bounceInOut(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; if (x < 0.5) return 0.5 * (1.0 - bounceOut(1.0 - 2.0 * x, n, k)); return 0.5 * (1.0 + bounceOut(2.0 * x - 1.0, n, k)); } float bounceOut(float t, float n, float k) { if (t <= 0.0) return 0.0; if (t >= 1.0) return 1.0; float env = pow(1.0 - t, k); float osc = (1.0 + cos(2.0 * 3.14159265 * n * t)) * 0.5; return 1.0 - env * osc; }",
      vex: "float bounceInOut(float x; float n; float k) { if (n < 1) n = 4; if (k == 0) k = 2; if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5) return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)); return 0.5 * (1 + bounceOut(2 * x - 1, n, k)); } float bounceOut(float t; float n; float k) { if (t <= 0) return 0; if (t >= 1) return 1; float env = pow(1 - t, k); float osc = (1 + cos(2 * M_PI * n * t)) * 0.5; return 1 - env * osc; }",
      csharp:
        "float BounceInOut(float x, float n = 4, float k = 2) { n = Math.Max(1, n); k = k == 0 ? 2 : k; if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5f) return 0.5f * (1 - BounceOut(1 - 2 * x, n, k)); return 0.5f * (1 + BounceOut(2 * x - 1, n, k)); } float BounceOut(float t, float n, float k) { if (t <= 0) return 0; if (t >= 1) return 1; float env = MathF.Pow(1 - t, k); float osc = (1 + MathF.Cos(2 * MathF.PI * n * t)) * 0.5f; return 1 - env * osc; }",
      rust: "fn bounce_in_out(x: f64, n: f64, k: f64) -> f64 { let n = n.max(1.0); let k = if k == 0.0 { 2.0 } else { k }; if x <= 0.0 { return 0.0; } if x >= 1.0 { return 1.0; } if x < 0.5 { 0.5 * (1.0 - bounce_out(1.0 - 2.0 * x, n, k)) } else { 0.5 * (1.0 + bounce_out(2.0 * x - 1.0, n, k)) } } fn bounce_out(t: f64, n: f64, k: f64) -> f64 { if t <= 0.0 { return 0.0; } if t >= 1.0 { return 1.0; } let env = (1.0 - t).powf(k); let osc = (1.0 + (2.0 * std::f64::consts::PI * n * t).cos()) * 0.5; 1.0 - env * osc }",
      hlsl: "float bounceInOut(float x, float n, float k) { n = max(1.0, n); k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; if (x < 0.5) return 0.5 * (1.0 - bounceOut(1.0 - 2.0 * x, n, k)); return 0.5 * (1.0 + bounceOut(2.0 * x - 1.0, n, k)); } float bounceOut(float t, float n, float k) { if (t <= 0.0) return 0.0; if (t >= 1.0) return 1.0; float env = pow(1.0 - t, k); float osc = (1.0 + cos(2.0 * 3.14159265 * n * t)) * 0.5; return 1.0 - env * osc; }",
      wgsl: "fn bounce_in_out(x: f32, n: f32, k: f32) -> f32 { let n = max(1.0, n); let k = select(2.0, k, k != 0.0); if (x <= 0.0) { return 0.0; } if (x >= 1.0) { return 1.0; } if (x < 0.5) { return 0.5 * (1.0 - bounce_out(1.0 - 2.0 * x, n, k)); } return 0.5 * (1.0 + bounce_out(2.0 * x - 1.0, n, k)); } fn bounce_out(t: f32, n: f32, k: f32) -> f32 { if (t <= 0.0) { return 0.0; } if (t >= 1.0) { return 1.0; } let env = pow(1.0 - t, k); let osc = (1.0 + cos(2.0 * 3.14159265 * n * t)) * 0.5; return 1.0 - env * osc; }",
      python:
        "def bounce_in_out(x, n=4, k=2): n = max(1, n); k = k or 2; if x <= 0: return 0; if x >= 1: return 1; if x < 0.5: return 0.5 * (1 - bounce_out(1 - 2 * x, n, k)); return 0.5 * (1 + bounce_out(2 * x - 1, n, k)); def bounce_out(t, n, k): if t <= 0: return 0; if t >= 1: return 1; env = math.pow(1 - t, k); osc = (1 + math.cos(2 * math.pi * n * t)) * 0.5; return 1 - env * osc",
      cpp: "float bounceInOut(float x, float n = 4.0f, float k = 2.0f) { n = std::max(1.0f, n); if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; if (x < 0.5f) return 0.5f * (1.0f - bounceOut(1.0f - 2.0f * x, n, k)); return 0.5f * (1.0f + bounceOut(2.0f * x - 1.0f, n, k)); } float bounceOut(float t, float n, float k) { if (t <= 0.0f) return 0.0f; if (t >= 1.0f) return 1.0f; float env = std::pow(1.0f - t, k); float osc = (1.0f + std::cos(2.0f * std::numbers::pi * n * t)) * 0.5f; return 1.0f - env * osc; }",
      lua: "function bounceInOut(x, n, k) n = n or 4 k = k or 2 if x <= 0 then return 0 end if x >= 1 then return 1 end if x < 0.5 then return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)) end return 0.5 * (1 + bounceOut(2 * x - 1, n, k)) end function bounceOut(t, n, k) if t <= 0 then return 0 end if t >= 1 then return 1 end local env = (1 - t) ^ k local osc = (1 + math.cos(2 * math.pi * n * t)) * 0.5 return 1 - env * osc end",
      gdscript:
        "func bounceInOut(x: float, n: float = 4.0, k: float = 2.0) -> float: n = max(n, 1.0); if x <= 0: return 0; if x >= 1: return 1; if x < 0.5: return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)); return 0.5 * (1 + bounceOut(2 * x - 1, n, k)); func bounceOut(t: float, n: float, k: float) -> float: if t <= 0: return 0; if t >= 1: return 1; var env = pow(1 - t, k); var osc = (1 + cos(2 * PI * n * t)) * 0.5; return 1 - env * osc",
      cuda: "__device__ float bounceInOut(float x, float n, float k) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; if (x < 0.5f) return 0.5f * (1.0f - bounceOut(1.0f - 2.0f * x, n, k)); return 0.5f * (1.0f + bounceOut(2.0f * x - 1.0f, n, k)); } __device__ float bounceOut(float t, float n, float k) { if (t <= 0.0f) return 0.0f; if (t >= 1.0f) return 1.0f; float env = powf(1.0f - t, k); float osc = (1.0f + cosf(2.0f * 3.14159265f * n * t)) * 0.5f; return 1.0f - env * osc; }",
      c: "double bounceInOut(double x, double n, double k) { if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; if (x < 0.5) return 0.5 * (1.0 - bounceOut(1.0 - 2.0 * x, n, k)); return 0.5 * (1.0 + bounceOut(2.0 * x - 1.0, n, k)); } double bounceOut(double t, double n, double k) { if (t <= 0.0) return 0.0; if (t >= 1.0) return 1.0; double env = pow(1.0 - t, k); double osc = (1.0 + cos(2.0 * M_PI * n * t)) * 0.5; return 1.0 - env * osc; }",
      json: '{"name": "Bounce In-Out", "formula": "y = (x < 0.5) ? 0.5 * (1 - bounceOut(1 - 2x)) : 0.5 * (1 + bounceOut(2x - 1))", "params": {"n": 4, "k": 2}}',
      metal:
        "float bounceInOut(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; if (x < 0.5) return 0.5 * (1.0 - bounceOut(1.0 - 2.0 * x, n, k)); return 0.5 * (1.0 + bounceOut(2.0 * x - 1.0, n, k)); } float bounceOut(float t, float n, float k) { if (t <= 0.0) return 0.0; if (t >= 1.0) return 1.0; float env = pow(1.0 - t, k); float osc = (1.0 + cos(2.0 * 3.14159265 * n * t)) * 0.5; return 1.0 - env * osc; }",
      opencl:
        "float bounceInOut(float x, float n, float k) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; if (x < 0.5f) return 0.5f * (1.0f - bounceOut(1.0f - 2.0f * x, n, k)); return 0.5f * (1.0f + bounceOut(2.0f * x - 1.0f, n, k)); } float bounceOut(float t, float n, float k) { if (t <= 0.0f) return 0.0f; if (t >= 1.0f) return 1.0f; float env = pow(1.0f - t, k); float osc = (1.0f + cos(2.0f * 3.14159265f * n * t)) * 0.5f; return 1.0f - env * osc; }",
      unity:
        "public static float BounceInOut(float x, float n = 4, float k = 2) { n = Math.Max(1, n); k = k == 0 ? 2 : k; if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5f) return 0.5f * (1 - BounceOut(1 - 2 * x, n, k)); return 0.5f * (1 + BounceOut(2 * x - 1, n, k)); } public static float BounceOut(float t, float n, float k) { if (t <= 0) return 0; if (t >= 1) return 1; float env = MathF.Pow(1 - t, k); float osc = (1 + MathF.Cos(2 * MathF.PI * n * t)) * 0.5f; return 1 - env * osc; }",
      shadertoy:
        "if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; if (x < 0.5) return 0.5 * (1.0 - bounceOut(1.0 - 2.0 * x, n, k)); return 0.5 * (1.0 + bounceOut(2.0 * x - 1.0, n, k));",
      svelte:
        "export const bounceInOut = (x, n, k) => { if (x <= 0) return 0; if (x >= 1) return 1; if (x < 0.5) return 0.5 * (1 - bounceOut(1 - 2 * x, n, k)); return 0.5 * (1 + bounceOut(2 * x - 1, n, k)); };",
      matlab: "y = @(x, n, k) bounceInOutImpl(x, n, k);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["bounce-in", "bounce-out", "elastic-in-out", "back-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => bounceInOutCurve(p as BounceInOutParams),
    },
  };
}
