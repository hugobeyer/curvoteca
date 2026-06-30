import {
  DEFAULT_SAMPLING,
  portamentoKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { speed: 0.5 } as const;
export type PortamentoParams = { speed: number };

export function portamentoCurve(
  params: PortamentoParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = portamentoKernel(params.speed);
  return {
    id: "portamento",
    name: "Portamento / Glide",
    family: "easing",
    summary: "Exponential pitch glide",
    formula: "y = 1 - e^(-t/s)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["easing", "portamento", "glide", "audio", "slide"],
    useCases: [
      "pitch-glide",
      "portamento-effect",
      "monosynth-slide",
      "smooth-transitions",
    ],
    snippets: {
      equation: "y = 1 - e^(-t/s)",
      js: "function portamento(x, s) { s = s == null ? 0.5 : s; return 1 - Math.exp(-x / s); }",
      ts: "function portamento(x: number, s: number = 0.5): number { return 1 - Math.exp(-x / s); }",
      glsl: "float portamento(float x, float s) { s = (s == 0.0) ? 0.5 : s; return 1.0 - exp(-x / s); }",
      vex: "float portamento(float x; float s) { if (s == 0) s = 0.5; return 1 - exp(-x / s); }",
      csharp:
        "float Portamento(float x, float s = 0.5f) { return 1 - MathF.Exp(-x / s); }",
      rust: "fn portamento(x: f64, s: f64) -> f64 { let s = if s == 0.0 { 0.5 } else { s }; 1.0 - (-x / s).exp() }",
      hlsl: "float portamento(float x, float s) { s = (s == 0.0) ? 0.5 : s; return 1.0 - exp(-x / s); }",
      wgsl: "fn portamento(x: f32, s: f32) -> f32 { let s = select(0.5, s, s != 0.0); return 1.0 - exp(-x / s); }",
      python: "def portamento(x, s=0.5): return 1 - math.exp(-x / s)",
      cpp: "float portamento(float x, float s = 0.5f) { return 1.0f - std::exp(-x / s); }",
      lua: "function portamento(x, s) s = s or 0.5; return 1 - math.exp(-x / s) end",
      gdscript:
        "func portamento(x: float, s: float = 0.5) -> float: return 1 - exp(-x / s)",
      cuda: "__device__ float portamento(float x, float s) { return 1.0f - expf(-x / s); }",
      c: "#include <math.h>\ndouble portamento(double x, double s) { return 1.0 - exp(-x / s); }",
      metal:
        "float portamento(float x, float s) { s = (s == 0.0) ? 0.5 : s; return 1.0 - exp(-x / s); }",
      opencl:
        "float portamento(float x, float s) { s = (s == 0.0f) ? 0.5f : s; return 1.0f - exp(-x / s); }",
      unity:
        "public static float Portamento(float x, float s) { return 1.0f - Mathf.Exp(-x / s); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["friction", "spring", "exp-falloff"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => portamentoCurve(p as PortamentoParams),
    },
  };
}
