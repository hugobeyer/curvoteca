import { backInKernel, DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { s: 1.70158 } as const;
export type BackInParams = { s: number };

export function backInCurve(
  params: BackInParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = backInKernel(params.s);
  return {
    id: "back-in",
    name: "Back In",
    aliases: ["easeInBack", "anticipation", "overshoot in"],
    family: "trigonometric",
    summary: "Anticipation ease-in",
    formula: "y = x^2 * ((s+1)*x - s)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "anticipation", "overshoot", "ease-in"],
    useCases: ["ui-animation", "anticipation", "dramatic-ease-in"],
    snippets: {
      equation: "y = x^2 * ((s+1)*x - s)",
      js: "function backIn(x, s) { s = s == null ? 1.70158 : s; return x * x * ((s + 1) * x - s); }",
      ts: "function backIn(x: number, s: number = 1.70158): number { return x * x * ((s + 1) * x - s); }",
      glsl: "float backIn(float x, float s) { s = (s == 0.0) ? 1.70158 : s; return x * x * ((s + 1.0) * x - s); }",
      vex: "float backIn(float x; float s) { if (s == 0) s = 1.70158; return x * x * ((s + 1) * x - s); }",
      csharp: "float BackIn(float x, float s = 1.70158f) { return x * x * ((s + 1) * x - s); }",
      rust: "fn back_in(x: f64, s: f64) -> f64 { let s = if s == 0.0 { 1.70158 } else { s }; x * x * ((s + 1.0) * x - s) }",
      hlsl: "float backIn(float x, float s) { s = (s == 0.0) ? 1.70158 : s; return x * x * ((s + 1.0) * x - s); }",
      wgsl: "fn back_in(x: f32, s: f32) -> f32 { let s = select(1.70158, s, s != 0.0); return x * x * ((s + 1.0) * x - s); }",
      python: "def back_in(x, s=1.70158): return x * x * ((s + 1) * x - s)",
      css: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
      cpp: "float backIn(float x, float s = 1.70158f) { return x * x * ((s + 1.0f) * x - s); }",
      lua: "function backIn(x, s) s = s or 1.70158 return x * x * ((s + 1) * x - s) end",
      gdscript: "func backIn(x: float, s: float = 1.70158) -> float: return x * x * ((s + 1) * x - s)",
      cuda: "__device__ float backIn(float x, float s) { return x * x * ((s + 1.0f) * x - s); }",
      c: "double backIn(double x, double s) { return x * x * ((s + 1.0) * x - s); }",
      json: '{"name": "Back In", "formula": "y = x^2 * ((s+1)*x - s)", "params": {"s": 1.70158}}',
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["back-out", "back-in-out", "elastic-in", "bounce-in"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => backInCurve(p as BackInParams),
    },
  };
}
