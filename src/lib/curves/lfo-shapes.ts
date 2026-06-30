import {
  DEFAULT_SAMPLING,
  lfoShapesKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { shape: 0, freq: 4 } as const;
export type LfoShapesParams = { shape: number; freq: number };

export function lfoShapesCurve(
  params: LfoShapesParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = lfoShapesKernel(params.shape, params.freq);
  return {
    id: "lfo-shapes",
    name: "LFO Shapes",
    aliases: [],
    family: "oscillator",
    summary: "Blended LFO waveforms",
    formula: "y = blended sine/triangle/saw/square based on shape",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["oscillator", "lfo", "waveform", "modulation", "audio"],
    useCases: [
      "audio-modulation",
      "lfo-waveforms",
      "synth-modulation",
      "parameter-modulation",
    ],
    snippets: {
      equation: "y = blended sine/triangle/saw/square based on shape",
      js: "function lfoShapes(x, s, f) { s = s == null ? 0 : s; f = f == null ? 4 : f; var p = (x * f) % 1; var sine = Math.sin(2 * Math.PI * p); var tri = 4 * Math.abs(p - 0.5) - 1; var saw = 2 * p - 1; var sq = p < 0.5 ? 1 : -1; var t = (s % 1 + 1) % 1; return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      ts: "function lfoShapes(x: number, s: number = 0, f: number = 4): number { const p = (x * f) % 1; const sine = Math.sin(2 * Math.PI * p); const tri = 4 * Math.abs(p - 0.5) - 1; const saw = 2 * p - 1; const sq = p < 0.5 ? 1 : -1; const t = ((s % 1) + 1) % 1; return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      glsl: "float lfoShapes(float x, float s, float f) { s = (s == 0.0) ? 0.0 : s; f = (f == 0.0) ? 4.0 : f; float p = fract(x * f); float sine = sin(2.0 * 3.14159265 * p); float tri = 4.0 * abs(p - 0.5) - 1.0; float saw = 2.0 * p - 1.0; float sq = p < 0.5 ? 1.0 : -1.0; float t = mod(mod(s, 1.0) + 1.0, 1.0); return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      vex: "float lfoShapes(float x; float s; float f) { if (f == 0) f = 4; float p = (x * f) % 1; float sine = sin(2 * M_PI * p); float tri = 4 * abs(p - 0.5) - 1; float saw = 2 * p - 1; float sq = p < 0.5 ? 1 : -1; float t = (s % 1 + 1) % 1; return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      csharp:
        "float LfoShapes(float x, float s = 0, float f = 4) { float p = (x * f) % 1; float sine = MathF.Sin(2 * MathF.PI * p); float tri = 4 * Math.Abs(p - 0.5f) - 1; float saw = 2 * p - 1; float sq = p < 0.5f ? 1 : -1; float t = ((s % 1) + 1) % 1; return t < 0.25f ? sine : t < 0.5f ? tri : t < 0.75f ? saw : sq; }",
      rust: "fn lfo_shapes(x: f64, s: f64, f: f64) -> f64 { let f = if f == 0.0 { 4.0 } else { f }; let p = (x * f) % 1.0; let sine = (2.0 * std::f64::consts::PI * p).sin(); let tri = 4.0 * (p - 0.5).abs() - 1.0; let saw = 2.0 * p - 1.0; let sq = if p < 0.5 { 1.0 } else { -1.0 }; let t = ((s % 1.0) + 1.0) % 1.0; if t < 0.25 { sine } else if t < 0.5 { tri } else if t < 0.75 { saw } else { sq } }",
      hlsl: "float lfoShapes(float x, float s, float f) { s = (s == 0.0) ? 0.0 : s; f = (f == 0.0) ? 4.0 : f; float p = frac(x * f); float sine = sin(2.0 * 3.14159265 * p); float tri = 4.0 * abs(p - 0.5) - 1.0; float saw = 2.0 * p - 1.0; float sq = p < 0.5 ? 1.0 : -1.0; float t = fmod(fmod(s, 1.0) + 1.0, 1.0); return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      wgsl: "fn lfo_shapes(x: f32, s: f32, f: f32) -> f32 { let f = select(4.0, f, f != 0.0); let p = (x * f) % 1.0; let sine = sin(2.0 * 3.14159265 * p); let tri = 4.0 * abs(p - 0.5) - 1.0; let saw = 2.0 * p - 1.0; let sq = select(-1.0, 1.0, p < 0.5); let t = ((s % 1.0) + 1.0) % 1.0; if (t < 0.25) { return sine; } else if (t < 0.5) { return tri; } else if (t < 0.75) { return saw; } else { return sq; } }",
      python:
        "def lfo_shapes(x, s=0, f=4): f = f or 4; p = (x * f) % 1; sine = math.sin(2 * math.pi * p); tri = 4 * abs(p - 0.5) - 1; saw = 2 * p - 1; sq = 1 if p < 0.5 else -1; t = (s % 1 + 1) % 1; return sine if t < 0.25 else tri if t < 0.5 else saw if t < 0.75 else sq",
      cpp: "float lfoShapes(float x, float s = 0.0f, float f = 4.0f) { float p = std::fmod(x * f, 1.0f); float sine = std::sin(2 * M_PI * p); float tri = 4 * std::abs(p - 0.5f) - 1.0f; float saw = 2.0f * p - 1.0f; float sq = p < 0.5f ? 1.0f : -1.0f; float t = std::fmod(std::fmod(s, 1.0f) + 1.0f, 1.0f); if (t < 0.25f) return sine; if (t < 0.5f) return tri; if (t < 0.75f) return saw; return sq; }",
      lua: "function lfoShapes(x, s, f) s = s or 0; f = f or 4; local p = (x * f) % 1; local sine = math.sin(2 * math.pi * p); local tri = 4 * math.abs(p - 0.5) - 1; local saw = 2 * p - 1; local sq = p < 0.5 and 1 or -1; local t = (s % 1 + 1) % 1; if t < 0.25 then return sine elseif t < 0.5 then return tri elseif t < 0.75 then return saw else return sq end end",
      gdscript:
        "func lfo_shapes(x: float, s: float = 0.0, f: float = 4.0) -> float: var p = fmod(x * f, 1.0); var sine = sin(2 * PI * p); var tri = 4 * abs(p - 0.5) - 1; var saw = 2 * p - 1; var sq = 1 if p < 0.5 else -1; var t = fmod(fmod(s, 1.0) + 1.0, 1.0); if t < 0.25: return sine; if t < 0.5: return tri; if t < 0.75: return saw; return sq",
      cuda: "__device__ float lfoShapes(float x, float s, float f) { float p = fmodf(x * f, 1.0f); float sine = sinf(2.0f * 3.14159265f * p); float tri = 4.0f * fabsf(p - 0.5f) - 1.0f; float saw = 2.0f * p - 1.0f; float sq = p < 0.5f ? 1.0f : -1.0f; float t = fmodf(fmodf(s, 1.0f) + 1.0f, 1.0f); if (t < 0.25f) return sine; if (t < 0.5f) return tri; if (t < 0.75f) return saw; return sq; }",
      c: "double lfo_shapes(double x, double s, double f) { double p = fmod(x * f, 1.0); double sine = sin(2 * M_PI * p); double tri = 4 * fabs(p - 0.5) - 1; double saw = 2 * p - 1; double sq = p < 0.5 ? 1 : -1; double t = fmod(fmod(s, 1.0) + 1.0, 1.0); if (t < 0.25) return sine; if (t < 0.5) return tri; if (t < 0.75) return saw; return sq; }",
      metal:
        "float lfoShapes(float x, float s, float f) { s = (s == 0.0) ? 0.0 : s; f = (f == 0.0) ? 4.0 : f; float p = fract(x * f); float sine = sin(2.0 * 1.57079633 * p); float tri = 4.0 * abs(p - 0.5) - 1.0; float saw = 2.0 * p - 1.0; float sq = p < 0.5 ? 1.0 : -1.0; float t = fmod(fmod(s, 1.0) + 1.0, 1.0); return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq; }",
      opencl:
        "float lfoShapes(float x, float s, float f) { s = (s == 0.0f) ? 0.0f : s; f = (f == 0.0f) ? 4.0f : f; float p = fmod(x * f, 1.0f); float sine = sin(2.0f * 1.57079633f * p); float tri = 4.0f * fabs(p - 0.5f) - 1.0f; float saw = 2.0f * p - 1.0f; float sq = p < 0.5f ? 1.0f : -1.0f; float t = fmod(fmod(s, 1.0f) + 1.0f, 1.0f); if (t < 0.25f) return sine; if (t < 0.5f) return tri; if (t < 0.75f) return saw; return sq; }",
      unity:
        "public static float LfoShapes(float x, float s, float f) { float p = Mathf.Repeat(x * f, 1.0f); float sine = Mathf.Sin(2.0f * Mathf.PI * p); float tri = 4.0f * Mathf.Abs(p - 0.5f) - 1.0f; float saw = 2.0f * p - 1.0f; float sq = p < 0.5f ? 1.0f : -1.0f; float t = Mathf.Repeat(Mathf.Repeat(s, 1.0f) + 1.0f, 1.0f); if (t < 0.25f) return sine; if (t < 0.5f) return tri; if (t < 0.75f) return saw; return sq; }",
      shadertoy:
        "float p = fract(x * f); float sine = sin(2.0 * 1.57079633 * p); float tri = 4.0 * abs(p - 0.5) - 1.0; float saw = 2.0 * p - 1.0; float sq = p < 0.5 ? 1.0 : -1.0; float t = fmod(fmod(s, 1.0) + 1.0, 1.0); return t < 0.25 ? sine : t < 0.5 ? tri : t < 0.75 ? saw : sq;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sine-ease", "triangle-wave", "sawtooth-wave", "square-wave"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => lfoShapesCurve(p as LfoShapesParams),
    },
  };
}
