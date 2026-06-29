import {
  DEFAULT_SAMPLING,
  signedScaleKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { p: 2 } as const;
export type SignedScaleParams = { p: number };

export function signedScaleCurve(
  params: SignedScaleParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = signedScaleKernel(params.p);
  return {
    id: "signed-scale",
    name: "Signed Scale",
    aliases: [
      "signed power",
      "symmetric power",
      "signed gamma",
      "gamepad curve",
    ],
    family: "signed",
    summary: "Signed slider response",
    formula: "y = sign(x) * |x|^p",
    continuity: "C0",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["slider", "tooling", "signed", "symmetric"],
    useCases: ["slider-response", "gamepad-curves", "symmetric-remapping"],

    snippets: {
      equation: "y = sign(x) * |x|^p",
      js: "function signedScale(x, p) { return Math.sign(x) * Math.pow(Math.abs(x), p); }",
      glsl: "float signedScale(float x, float p) { return sign(x) * pow(abs(x), p); }",
      vex: "float signedScale(float x; float p) { return sign(x) * pow(abs(x), p); }",
      ts: "function signedScale(x: number, p: number): number { return Math.sign(x) * Math.pow(Math.abs(x), p); }",
      csharp: "float SignedScale(float x, float p) { return MathF.Sign(x) * MathF.Pow(MathF.Abs(x), p); }",
      rust: "fn signed_scale(x: f64, p: f64) -> f64 { x.signum() * x.abs().powf(p) }",
      hlsl: "float signedScale(float x, float p) { return sign(x) * pow(abs(x), p); }",
      wgsl: "fn signedScale(x: f32, p: f32) -> f32 { return sign(x) * pow(abs(x), p); }",
      python: "def signed_scale(x, p): return math.copysign(abs(x) ** p, x)",
      cpp: "float signedScale(float x, float p) { return (x >= 0.0f ? 1.0f : -1.0f) * std::pow(std::abs(x), p); }",
      lua: "function signedScale(x, p) return (x >= 0 and 1 or -1) * math.abs(x) ^ p end",
      gdscript: "func signedScale(x: float, p: float) -> float: return (1.0 if x >= 0.0 else -1.0) * pow(abs(x), p)",
      cuda: "__device__ float signedScale(float x, float p) { return (x >= 0.0f ? 1.0f : -1.0f) * powf(fabsf(x), p); }",
      c: "double signedScale(double x, double p) { return (x >= 0.0 ? 1.0 : -1.0) * pow(fabs(x), p); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["power", "linear", "dead-zone"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => signedScaleCurve(p as SignedScaleParams),
    },
  };
}
