import {
  backInOutKernel,
  DEFAULT_SAMPLING,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { s: 1.70158 } as const;
export type BackInOutParams = { s: number };

export function backInOutCurve(
  params: BackInOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = backInOutKernel(params.s);
  return {
    id: "back-in-out",
    name: "Back In Out",
    aliases: ["easeInOutBack", "symmetric back", "anticipation in-out"],
    family: "trigonometric",
    summary: "Symmetric back ease",
    formula:
      "y = 0.5 * (2x)^2 * ((2s+1)*2x - 2s) for x<0.5, else 0.5 * (2x-2)^2 * ((2s+1)*(2x-2) + 2s) + 1",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: [
      "ease",
      "ui",
      "anticipation",
      "overshoot",
      "ease-in-out",
      "symmetric",
    ],
    useCases: [
      "ui-animation",
      "anticipation",
      "symmetric-blend",
      "dramatic-ease",
    ],
    snippets: {
      equation:
        "y = 0.5 * (2x)^2 * ((2s+1)*2x - 2s) for x<0.5, else 0.5 * (2x-2)^2 * ((2s+1)*(2x-2) + 2s) + 1",
      js: "function backInOut(x, s) { s = s == null ? 1.70158 : s; var sOut = 2 * s; if (x < 0.5) { var u = 2 * x; return 0.5 * u * u * ((sOut + 1) * u - sOut); } var u = 2 * x - 2; return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2); }",
      ts: "function backInOut(x: number, s: number = 1.70158): number { const sOut = 2 * s; if (x < 0.5) { const u = 2 * x; return 0.5 * u * u * ((sOut + 1) * u - sOut); } const u = 2 * x - 2; return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2); }",
      glsl: "float backInOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float sOut = 2.0 * s; if (x < 0.5) { float u = 2.0 * x; return 0.5 * u * u * ((sOut + 1.0) * u - sOut); } float u = 2.0 * x - 2.0; return 0.5 * (u * u * ((sOut + 1.0) * u + sOut) + 2.0); }",
      vex: "float backInOut(float x; float s) { if (s == 0) s = 1.70158; float sOut = 2 * s; if (x < 0.5) { float u = 2 * x; return 0.5 * u * u * ((sOut + 1) * u - sOut); } float u = 2 * x - 2; return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2); }",
      csharp:
        "float BackInOut(float x, float s = 1.70158f) { float sOut = 2 * s; if (x < 0.5) { float u = 2 * x; return 0.5f * u * u * ((sOut + 1) * u - sOut); } float u = 2 * x - 2; return 0.5f * (u * u * ((sOut + 1) * u + sOut) + 2); }",
      rust: "fn back_in_out(x: f64, s: f64) -> f64 { let s = if s == 0.0 { 1.70158 } else { s }; let s_out = 2.0 * s; if x < 0.5 { let u = 2.0 * x; 0.5 * u * u * ((s_out + 1.0) * u - s_out) } else { let u = 2.0 * x - 2.0; 0.5 * (u * u * ((s_out + 1.0) * u + s_out) + 2.0) } }",
      hlsl: "float backInOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float sOut = 2.0 * s; if (x < 0.5) { float u = 2.0 * x; return 0.5 * u * u * ((sOut + 1.0) * u - sOut); } float u = 2.0 * x - 2.0; return 0.5 * (u * u * ((sOut + 1.0) * u + sOut) + 2.0); }",
      wgsl: "fn back_in_out(x: f32, s: f32) -> f32 { let s = select(1.70158, s, s != 0.0); let s_out = 2.0 * s; if (x < 0.5) { let u = 2.0 * x; return 0.5 * u * u * ((s_out + 1.0) * u - s_out); } let u = 2.0 * x - 2.0; return 0.5 * (u * u * ((s_out + 1.0) * u + s_out) + 2.0); }",
      python:
        "def back_in_out(x, s=1.70158): s_out = 2 * s; u = 2 * x if x < 0.5 else 2 * x - 2; return 0.5 * u * u * ((s_out + 1) * u - s_out) if x < 0.5 else 0.5 * (u * u * ((s_out + 1) * u + s_out) + 2)",
      css: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      cpp: "float backInOut(float x, float s = 1.70158f) { float sOut = 2.0f * s; if (x < 0.5f) { float u = 2.0f * x; return 0.5f * u * u * ((sOut + 1.0f) * u - sOut); } float u = 2.0f * x - 2.0f; return 0.5f * (u * u * ((sOut + 1.0f) * u + sOut) + 2.0f); }",
      lua: "function backInOut(x, s) s = s or 1.70158 local sOut = 2 * s if x < 0.5 then local u = 2 * x return 0.5 * u * u * ((sOut + 1) * u - sOut) end local u = 2 * x - 2 return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2) end",
      gdscript:
        "func backInOut(x: float, s: float = 1.70158) -> float: var sOut = 2 * s; if x < 0.5: var u = 2 * x; return 0.5 * u * u * ((sOut + 1) * u - sOut); var u = 2 * x - 2; return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2)",
      cuda: "__device__ float backInOut(float x, float s) { float sOut = 2.0f * s; if (x < 0.5f) { float u = 2.0f * x; return 0.5f * u * u * ((sOut + 1.0f) * u - sOut); } float u = 2.0f * x - 2.0f; return 0.5f * (u * u * ((sOut + 1.0f) * u + sOut) + 2.0f); }",
      c: "double backInOut(double x, double s) { double sOut = 2.0 * s; if (x < 0.5) { double u = 2.0 * x; return 0.5 * u * u * ((sOut + 1.0) * u - sOut); } double u = 2.0 * x - 2.0; return 0.5 * (u * u * ((sOut + 1.0) * u + sOut) + 2.0); }",
      json: '{"name": "Back In Out", "formula": "y = 0.5 * (2x)^2 * ((2s+1)*2x - 2s) for x<0.5, else 0.5 * (2x-2)^2 * ((2s+1)*(2x-2) + 2s) + 1", "params": {"s": 1.70158}}',
      metal:
        "float backInOut(float x, float s) { s = (s == 0.0) ? 1.70158 : s; float sOut = 2.0 * s; if (x < 0.5) { float u = 2.0 * x; return 0.5 * u * u * ((sOut + 1.0) * u - sOut); } float u = 2.0 * x - 2.0; return 0.5 * (u * u * ((sOut + 1.0) * u + sOut) + 2.0); }",
      opencl:
        "float backInOut(float x, float s) { float sOut = 2.0f * s; if (x < 0.5f) { float u = 2.0f * x; return 0.5f * u * u * ((sOut + 1.0f) * u - sOut); } float u = 2.0f * x - 2.0f; return 0.5f * (u * u * ((sOut + 1.0f) * u + sOut) + 2.0f); }",
      unity:
        "public static float BackInOut(float x, float s = 1.70158f) { float sOut = 2 * s; if (x < 0.5) { float u = 2 * x; return 0.5f * u * u * ((sOut + 1) * u - sOut); } float u = 2 * x - 2; return 0.5f * (u * u * ((sOut + 1) * u + sOut) + 2); }",
      shadertoy:
        "float sOut = 2.0 * s; if (x < 0.5) { float u = 2.0 * x; return 0.5 * u * u * ((sOut + 1.0) * u - sOut); } float u = 2.0 * x - 2.0; return 0.5 * (u * u * ((sOut + 1.0) * u + sOut) + 2.0);",
      svelte:
        "export const backInOut = (x, s) => { const sOut = 2 * s; if (x < 0.5) { const u = 2 * x; return 0.5 * u * u * ((sOut + 1) * u - sOut); } const u = 2 * x - 2; return 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2); };",
      matlab: "y = @(x, s) backInOutImpl(x, s);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["back-in", "back-out", "sine-in-out", "circular-in-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => backInOutCurve(p as BackInOutParams),
    },
  };
}
