import {
  bounceInKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { n: 4, k: 2 } as const;
export type BounceInParams = { n: number; k: number };

export function bounceInCurve(
  params: BounceInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = bounceInKernel(params.n, params.k);
  return {
    id: "bounce-in",
    name: "Bounce In",
    aliases: ["easeInBounce", "bounce in", "anticipation bounce"],
    family: "trigonometric",
    summary: "Bouncing ease-in",
    formula: "y = 1 - bounce_out(1 - x, n, k)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "bounce", "ease-in", "physics"],
    useCases: [
      "ui-animation",
      "bounce-buildup",
      "physics-style",
      "playful-ease",
    ],
    snippets: {
      equation: "y = 1 - bounce_out(1 - x, n, k)",
      js: "function bounceIn(x, n, k) { n = n == null ? 4 : n; k = k == null ? 2 : k; if (x <= 0) return 0; if (x >= 1) return 1; return 1 - bounceOut(1 - x, n, k); }",
      ts: "function bounceIn(x: number, n: number = 4, k: number = 2): number { if (x <= 0) return 0; if (x >= 1) return 1; return 1 - bounceOut(1 - x, n, k); }",
      glsl: "float bounceIn(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - bounceOut(1.0 - x, n, k); }",
      vex: "float bounceIn(float x; float n; float k) { if (n < 1) n = 4; if (k == 0) k = 2; if (x <= 0) return 0; if (x >= 1) return 1; return 1 - bounceOut(1 - x, n, k); }",
      csharp: "float BounceIn(float x, float n = 4, float k = 2) { if (x <= 0) return 0; if (x >= 1) return 1; return 1 - BounceOut(1 - x, n, k); }",
      rust: "fn bounce_in(x: f64, n: f64, k: f64) -> f64 { let n = if n < 1.0 { 4.0 } else { n }; let k = if k == 0.0 { 2.0 } else { k }; if x <= 0.0 { return 0.0; } if x >= 1.0 { return 1.0; } 1.0 - bounce_out(1.0 - x, n, k) }",
      hlsl: "float bounceIn(float x, float n, float k) { n = (n < 1.0) ? 4.0 : n; k = (k == 0.0) ? 2.0 : k; if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - bounceOut(1.0 - x, n, k); }",
      wgsl: "fn bounce_in(x: f32, n: f32, k: f32) -> f32 { let n = select(4.0, n, n >= 1.0); let k = select(2.0, k, k != 0.0); if (x <= 0.0) { return 0.0; } if (x >= 1.0) { return 1.0; } return 1.0 - bounce_out(1.0 - x, n, k); }",
      python: "def bounce_in(x, n=4, k=2): if x <= 0: return 0; if x >= 1: return 1; return 1 - bounce_out(1 - x, n, k)",
      css: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
      cpp: "float bounceIn(float x, float n = 4.0f, float k = 2.0f) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; return 1.0f - bounceOut(1.0f - x, n, k); }",
      lua: "function bounceIn(x, n, k) n = n or 4 k = k or 2 if x <= 0 then return 0 end if x >= 1 then return 1 end return 1 - bounceOut(1 - x, n, k) end",
      gdscript: "func bounceIn(x: float, n: float = 4.0, k: float = 2.0) -> float: if x <= 0: return 0; if x >= 1: return 1; return 1 - bounceOut(1 - x, n, k)",
      cuda: "__device__ float bounceIn(float x, float n, float k) { if (x <= 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; return 1.0f - bounceOut(1.0f - x, n, k); }",
      c: "double bounceIn(double x, double n, double k) { if (x <= 0.0) return 0.0; if (x >= 1.0) return 1.0; return 1.0 - bounceOut(1.0 - x, n, k); }",
      json: '{"name": "Bounce In", "formula": "y = 1 - bounceOut(1 - x, n, k)", "params": {"n": 4, "k": 2}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["bounce-out", "bounce-in-out", "back-in", "elastic-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => bounceInCurve(p as BounceInParams),
    },
  };
}
