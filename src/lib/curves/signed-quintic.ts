import {
  DEFAULT_SAMPLING,
  signedQuinticKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { p: 5 } as const;
export type SignedQuinticParams = { p: number };

export function signedQuinticCurve(
  params: SignedQuinticParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = signedQuinticKernel(params.p);
  return {
    id: "signed-quintic",
    name: "Signed Quintic",
    aliases: ["quintic signed", "signed power 5", "gamepad quintic"],
    family: "signed",
    summary: "Signed slider response, p=5",
    formula: "y = sign(x) * |x|^p",
    continuity: "C0",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["slider", "tooling", "signed", "symmetric", "quintic"],
    useCases: ["slider-response", "gamepad-curves", "symmetric-remapping"],

    snippets: {
      equation: "y = sign(x) * |x|^p",
      js: "function signedQuintic(x, p) { return Math.sign(x) * Math.pow(Math.abs(x), p); }",
      glsl: "float signedQuintic(float x, float p) { return sign(x) * pow(abs(x), p); }",
      vex: "float signedQuintic(float x; float p) { return sign(x) * pow(abs(x), p); }",
      ts: "function signedQuintic(x: number, p: number): number { return Math.sign(x) * Math.pow(Math.abs(x), p); }",
      csharp: "float SignedQuintic(float x, float p) { return MathF.Sign(x) * MathF.Pow(MathF.Abs(x), p); }",
      rust: "fn signed_quintic(x: f64, p: f64) -> f64 { x.signum() * x.abs().powf(p) }",
      hlsl: "float signedQuintic(float x, float p) { return sign(x) * pow(abs(x), p); }",
      wgsl: "fn signedQuintic(x: f32, p: f32) -> f32 { return sign(x) * pow(abs(x), p); }",
      python: "def signed_quintic(x, p): return math.copysign(abs(x) ** p, x)",
      css: "cubic-bezier(0.7, 0, 1, 1)",
      cpp: "float signedQuintic(float x, float p) { return (x >= 0.0f ? 1.0f : -1.0f) * std::pow(std::abs(x), p); }",
      lua: "function signedQuintic(x, p) return (x >= 0 and 1 or -1) * math.abs(x) ^ p end",
      gdscript: "func signedQuintic(x: float, p: float) -> float: return (1.0 if x >= 0.0 else -1.0) * pow(abs(x), p)",
      cuda: "__device__ float signedQuintic(float x, float p) { return (x >= 0.0f ? 1.0f : -1.0f) * powf(fabsf(x), p); }",
      c: "double signedQuintic(double x, double p) { return (x >= 0.0 ? 1.0 : -1.0) * pow(fabs(x), p); }",
      json: "{\"name\": \"Signed Quintic\", \"formula\": \"y = sign(x) * |x|^p\", \"params\": {\"p\": 5}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["signed-scale", "signed-logistic", "power", "dead-zone"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => signedQuinticCurve(p as SignedQuinticParams),
    },
  };
}
