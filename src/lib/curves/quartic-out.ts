import {
  DEFAULT_SAMPLING,
  quarticOutKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type QuarticOutParams = typeof defaultParams;

export function quarticOutCurve(
  _params: QuarticOutParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = quarticOutKernel;
  return {
    id: "quartic-out",
    name: "Quartic Out",
    aliases: ["easeOutQuart", "ease-out-quart", "quartic ease out"],
    family: "easing",
    summary: "Quartic ease-out",
    formula: "y = 1 - (1 - x)^4",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["ease", "ui", "ease-out", "quartic", "css"],
    useCases: ["ui-animation", "ease-out", "decelerate-to-rest"],

    snippets: {
      equation: "y = 1 - (1 - x)^4",
      js: "function quarticOut(x) { var u = 1 - x; return 1 - u * u * u * u; }",
      glsl: "float quarticOut(float x) { float u = 1.0 - x; float u2 = u * u; return 1.0 - u2 * u2; }",
      vex: "float quarticOut(float x) { float u = 1 - x; float u2 = u * u; return 1 - u2 * u2; }",
      ts: "function quarticOut(x: number): number { const u = 1 - x; const u2 = u * u; return 1 - u2 * u2; }",
      csharp: "float QuarticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2; }",
      rust: "fn quartic_out(x: f64) -> f64 { let u = 1.0 - x; let u2 = u * u; 1.0 - u2 * u2 }",
      hlsl: "float quarticOut(float x) { float u = 1.0 - x; float u2 = u * u; return 1.0 - u2 * u2; }",
      wgsl: "fn quarticOut(x: f32) -> f32 { let u = 1.0 - x; let u2 = u * u; return 1.0 - u2 * u2; }",
      python: "def quartic_out(x): u = 1 - x; u2 = u * u; return 1 - u2 * u2",
      css: "cubic-bezier(0, 0, 0.58, 1)",
      cpp: "float quarticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2; }",
      lua: "function quarticOut(x) local u = 1 - x; local u2 = u * u; return 1 - u2 * u2 end",
      gdscript: "func quarticOut(x: float) -> float: var u = 1 - x; var u2 = u * u; return 1 - u2 * u2",
      cuda: "__device__ float quarticOut(float x) { float u = 1.0f - x; float u2 = u * u; return 1.0f - u2 * u2; }",
      c: "double quarticOut(double x) { double u = 1.0 - x; double u2 = u * u; return 1.0 - u2 * u2; }",
      json: "{\"name\": \"Quartic Out\", \"formula\": \"y = 1 - (1 - x)^4\", \"params\": {}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["quartic-in", "quartic-in-out", "cubic-out", "quintic-out"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => quarticOutCurve(params as QuarticOutParams),
    },
  };
}
