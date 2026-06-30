import {
  DEFAULT_SAMPLING,
  stepsEasingKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { steps: 4, smoothness: 0 } as const;
export type StepsEasingParams = { steps: number; smoothness: number };

export function stepsEasingCurve(
  params: StepsEasingParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = stepsEasingKernel(
    params.steps,
    params.smoothness,
  );
  return {
    id: "steps-easing",
    name: "Steps Easing",
    aliases: ["step easing", "discrete steps", "stepped"],
    family: "utility",
    summary: "Discrete step function with optional smoothing",
    formula: "y = floor(t * steps) / steps",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "utility", "steps", "discrete", "timing"],
    useCases: [
      "stop-motion",
      "frame-by-frame",
      "discrete-animation",
      "stepped-transitions",
    ],
    snippets: {
      equation: "y = floor(t * steps) / steps",
      js: "function stepsEasing(x, n, s) { n = n == null ? 4 : n; s = s == null ? 0 : s; var t = Math.floor(x * n) / n; if (s > 0) { var f = (x * n) % 1; var u = f / (s / n); t += (1 / n) * (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u)); } return t; }",
      ts: "function stepsEasing(x: number, n: number = 4, s: number = 0): number { let t = Math.floor(x * n) / n; if (s > 0) { const f = (x * n) % 1; const u = f / (s / n); t += (1 / n) * (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u)); } return t; }",
      glsl: "float stepsEasing(float x, float n, float s) { n = (n < 1.0) ? 4.0 : n; s = (s < 0.0) ? 0.0 : s; float t = floor(x * n) / n; if (s > 0.0) { float f = mod(x * n, 1.0); float u = f / (s / n); u = clamp(u, 0.0, 1.0); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      vex: "float stepsEasing(float x; float n; float s) { if (n < 1) n = 4; if (s < 0) s = 0; float t = floor(x * n) / n; if (s > 0) { float f = (x * n) % 1; float u = f / (s / n); u = clamp(u, 0.0, 1.0); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      csharp:
        "float StepsEasing(float x, float n = 4, float s = 0) { n = Math.Max(1, n); s = Math.Max(0, s); float t = MathF.Floor(x * n) / n; if (s > 0) { float f = (x * n) % 1; float u = f / (s / n); u = Math.Clamp(u, 0, 1); t += (1.0f / n) * (u * u * (3 - 2 * u)); } return t; }",
      rust: "fn steps_easing(x: f64, n: f64, s: f64) -> f64 { let n = n.max(1.0); let s = s.max(0.0); let t = (x * n).floor() / n; if s > 0.0 { let f = (x * n) % 1.0; let clamp = |v: f64| v.max(0.0).min(1.0); let u = clamp(f / (s / n)); t + (1.0 / n) * (u * u * (3.0 - 2.0 * u)) } else { t } }",
      hlsl: "float stepsEasing(float x, float n, float s) { n = max(1.0, n); s = max(0.0, s); float t = floor(x * n) / n; if (s > 0.0) { float f = (x * n) % 1.0; float u = saturate(f / (s / n)); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      wgsl: "fn steps_easing(x: f32, n: f32, s: f32) -> f32 { let n = max(1.0, n); let s = max(0.0, s); var t = floor(x * n) / n; if (s > 0.0) { let f = (x * n) % 1.0; let u = saturate(f / (s / n)); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      python:
        "def steps_easing(x, n=4, s=0): n = max(1, n); s = max(0, s); t = math.floor(x * n) / n; if s > 0: f = (x * n) % 1; u = max(0, min(1, f / (s / n))); t += (1 / n) * (u * u * (3 - 2 * u)); return t",
      css: "steps(n)",
      cpp: "float stepsEasing(float x, float n = 4.0f, float s = 0.0f) { n = std::max(1.0f, n); s = std::max(0.0f, s); float t = std::floor(x * n) / n; if (s > 0.0f) { float f = std::fmod(x * n, 1.0f); float u = std::max(0.0f, std::min(1.0f, f / (s / n))); t += (1.0f / n) * (u * u * (3.0f - 2.0f * u)); } return t; }",
      lua: "function stepsEasing(x, n, s) n = n or 4 s = s or 0 if n < 1 then n = 4 end if s < 0 then s = 0 end local t = math.floor(x * n) / n if s > 0 then local f = (x * n) % 1 local u = f / (s / n) if u < 0 then u = 0 end if u > 1 then u = 1 end t = t + (1 / n) * (u * u * (3 - 2 * u)) end return t end",
      gdscript:
        "func stepsEasing(x: float, n: float = 4.0, s: float = 0.0) -> float: n = max(1.0, n); s = max(0.0, s); var t = floor(x * n) / n; if s > 0: var f = fmod(x * n, 1.0); var u = clamp(f / (s / n), 0.0, 1.0); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); return t",
      cuda: "__device__ float stepsEasing(float x, float n, float s) { if (n < 1.0f) n = 4.0f; if (s < 0.0f) s = 0.0f; float t = floorf(x * n) / n; if (s > 0.0f) { float f = fmodf(x * n, 1.0f); float u = f / (s / n); u = fminf(1.0f, fmaxf(0.0f, u)); t += (1.0f / n) * (u * u * (3.0f - 2.0f * u)); } return t; }",
      c: "double stepsEasing(double x, double n, double s) { if (n < 1.0) n = 4.0; if (s < 0.0) s = 0.0; double t = floor(x * n) / n; if (s > 0.0) { double f = fmod(x * n, 1.0); double u = f / (s / n); u = fmax(0.0, fmin(1.0, u)); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      json: '{"name": "Steps Easing", "formula": "y = floor(t * steps) / steps", "params": {"steps": 4, "smoothness": 0}}',
      metal:
        "float stepsEasing(float x, float n, float s) { n = (n < 1.0) ? 4.0 : n; s = (s < 0.0) ? 0.0 : s; float t = floor(x * n) / n; if (s > 0.0) { float f = mod(x * n, 1.0); float u = f / (s / n); u = clamp(u, 0.0, 1.0); t += (1.0 / n) * (u * u * (3.0 - 2.0 * u)); } return t; }",
      opencl:
        "float stepsEasing(float x, float n, float s) { if (n < 1.0f) n = 4.0f; if (s < 0.0f) s = 0.0f; float t = floor(x * n) / n; if (s > 0.0f) { float f = fmod(x * n, 1.0f); float u = f / (s / n); u = fmin(1.0f, fmax(0.0f, u)); t += (1.0f / n) * (u * u * (3.0f - 2.0f * u)); } return t; }",
      unity:
        "public static float StepsEasing(float x, float n = 4, float s = 0) { n = Mathf.Max(1, n); s = Mathf.Max(0, s); float t = Mathf.Floor(x * n) / n; if (s > 0) { float f = (x * n) % 1; float u = Mathf.Clamp(f / (s / n), 0, 1); t += (1.0f / n) * (u * u * (3 - 2 * u)); } return t; }",
      matlab: "y = @(x, n, s) floor(x * n) / n;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["step", "smoothstep", "linear"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => stepsEasingCurve(p as StepsEasingParams),
    },
  };
}
