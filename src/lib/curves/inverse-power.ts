import {
  DEFAULT_SAMPLING,
  inversePowerKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { p: 2 } as const;
export type InversePowerParams = { p: number };

export function inversePowerCurve(
  params: InversePowerParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = inversePowerKernel(params.p);
  return {
    id: "inverse-power",
    name: "Inverse Power",
    aliases: [
      "inverse pow",
      "one minus power",
      "reverse gamma",
      "ease-in power",
    ],
    family: "power",
    summary: "Inverse power falloff",
    formula: "y = 1 - (1 - x)^p",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["falloff", "curve", "ease-in", "power"],
    useCases: ["falloff-curves", "distance-attenuation", "ease-in-variants"],
    snippets: {
      equation: "y = 1 - (1 - x)^p",
      js: "function inversePower(x, p) { return 1 - Math.pow(1 - x, p); }",
      glsl: "float inversePower(float x, float p) { return 1.0 - pow(1.0 - x, p); }",
      vex: "float inversePower(float x; float p) { return 1 - pow(1 - x, p); }",
      ts: "function inversePower(x: number, p: number): number { return 1 - Math.pow(1 - x, p); }",
      csharp: "float InversePower(float x, float p) { return 1.0f - MathF.Pow(1.0f - x, p); }",
      rust: "fn inverse_power(x: f64, p: f64) -> f64 { 1.0 - (1.0 - x).powf(p) }",
      hlsl: "float inversePower(float x, float p) { return 1.0 - pow(1.0 - x, p); }",
      wgsl: "fn inversePower(x: f32, p: f32) -> f32 { return 1.0 - pow(1.0 - x, p); }",
      python: "def inverse_power(x, p): return 1 - math.pow(1 - x, p)",
      css: "cubic-bezier(0, 0, 0.58, 1)",
      cpp: "float inversePower(float x, float p) { return 1.0f - std::pow(1.0f - x, p); }",
      lua: "function inversePower(x, p) return 1 - math.pow(1 - x, p) end",
      gdscript: "func inverse_power(x: float, p: float) -> float: return 1 - pow(1 - x, p)",
      cuda: "__device__ float inversePower(float x, float p) { return 1.0f - powf(1.0f - x, p); }",
      c: "double inverse_power(double x, double p) { return 1 - pow(1 - x, p); }",
      json: "{\"name\": \"Inverse Power\", \"formula\": \"y = 1 - (1 - x)^p\", \"params\": {\"p\": 2}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["power", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => inversePowerCurve(p as InversePowerParams),
    },
  };
}
