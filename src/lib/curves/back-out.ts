import {
  backOutKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { s: 1.70158 } as const;
export type BackOutParams = { s: number };

export function backOutCurve(
  params: BackOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = backOutKernel(params.s);
  return {
    id: "back-out",
    name: "Back Out",
    aliases: ["easeOutBack", "overshoot out", "snap out"],
    family: "trigonometric",
    summary: "Overshoot ease-out",
    formula: "y = 1 - (1-x)^2 * ((s+1)*(1-x) - s)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "anticipation", "overshoot", "ease-out"],
    useCases: [
      "ui-animation",
      "overshoot",
      "snap-to-rest",
      "dramatic-ease-out",
    ],
    snippets: {
      equation: "y = 1 - (1-x)^2 * ((s+1)*(1-x) - s)",
      js: "function backOut(x, s) { s = s == null ? 1.70158 : s; var u = 1 - x; return 1 - u * u * ((s + 1) * u - s); }",
      ts: "function backOut(x: number, s: number = 1.70158): number { const u = 1 - x; return 1 - u * u * ((s + 1) * u - s); }",
      glsl: "float backOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s); }",
      vex: "float backOut(float x; float s) { if (s == 0) s = 1.70158; float u = 1 - x; return 1 - u * u * ((s + 1) * u - s); }",
      csharp:
        "float BackOut(float x, float s = 1.70158f) { float u = 1 - x; return 1 - u * u * ((s + 1) * u - s); }",
      rust: "fn back_out(x: f64, s: f64) -> f64 { let s = if s == 0.0 { 1.70158 } else { s }; let u = 1.0 - x; 1.0 - u * u * ((s + 1.0) * u - s) }",
      hlsl: "float backOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s); }",
      wgsl: "fn back_out(x: f32, s: f32) -> f32 { let s = select(1.70158, s, s != 0.0); let u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s); }",
      python:
        "def back_out(x, s=1.70158): u = 1 - x; return 1 - u * u * ((s + 1) * u - s)",
      css: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      cpp: "float backOut(float x, float s = 1.70158f) { float u = 1.0f - x; return 1.0f - u * u * ((s + 1.0f) * u - s); }",
      lua: "function backOut(x, s) s = s or 1.70158 local u = 1 - x return 1 - u * u * ((s + 1) * u - s) end",
      gdscript:
        "func backOut(x: float, s: float = 1.70158) -> float: var u = 1 - x; return 1 - u * u * ((s + 1) * u - s)",
      cuda: "__device__ float backOut(float x, float s) { float u = 1.0f - x; return 1.0f - u * u * ((s + 1.0f) * u - s); }",
      c: "double backOut(double x, double s) { double u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s); }",
      json: '{"name": "Back Out", "formula": "y = 1 - (1-x)^2 * ((s+1)*(1-x) - s)", "params": {"s": 1.70158}}',
      metal:
        "float backOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s); }",
      opencl:
        "float backOut(float x, float s) { float u = 1.0f - x; return 1.0f - u * u * ((s + 1.0f) * u - s); }",
      unity:
        "public static float BackOut(float x, float s = 1.70158f) { float u = 1 - x; return 1 - u * u * ((s + 1) * u - s); }",
      shadertoy: "float u = 1.0 - x; return 1.0 - u * u * ((s + 1.0) * u - s);",
      svelte:
        "export const backOut = (x, s) => { const u = 1 - x; return 1 - u * u * ((s + 1) * u - s); };",
      matlab: "y = @(x, s) 1 - (1-x) * (1-x) * ((s+1) * (1-x) - s);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["back-in", "back-in-out", "elastic-out", "bounce-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => backOutCurve(p as BackOutParams),
    },
  };
}
