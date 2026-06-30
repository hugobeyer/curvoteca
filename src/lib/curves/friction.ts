import {
  DEFAULT_SAMPLING,
  frictionKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { mass: 1, friction: 2 } as const;
export type FrictionParams = { mass: number; friction: number };

export function frictionCurve(
  params: FrictionParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = frictionKernel(params.mass, params.friction);
  return {
    id: "friction",
    name: "Friction Deceleration",
    aliases: ["friction damping", "deceleration", "fling", "kinetic friction"],
    family: "physics",
    summary: "Friction-based deceleration for natural motion",
    formula: "y = 1 - (1 - t) / (1 + friction * t)",
    continuity: "C2",
    domain: [0, 1],
    range: [0, 1],
    tags: ["physics", "friction", "deceleration", "motion", "iOS-spring"],
    useCases: [
      "physics-simulation",
      "friction-damping",
      "deceleration-curve",
      "momentum-stop",
    ],
    snippets: {
      equation: "y = 1 - (1 - t) / (1 + friction * t)",
      js: "function friction(x, m, f) { m = m == null ? 1 : m; f = f == null ? 2 : f; return 1 - (1 - x) / (1 + f * x); }",
      ts: "function friction(x: number, m: number = 1, f: number = 2): number { return 1 - (1 - x) / (1 + f * x); }",
      glsl: "float friction(float x, float m, float f) { m = (m == 0.0) ? 1.0 : m; f = (f == 0.0) ? 2.0 : f; return 1.0 - (1.0 - x) / (1.0 + f * x); }",
      vex: "float friction(float x; float m; float f) { if (m == 0) m = 1; if (f == 0) f = 2; return 1 - (1 - x) / (1 + f * x); }",
      csharp:
        "float Friction(float x, float m = 1, float f = 2) { return 1 - (1 - x) / (1 + f * x); }",
      rust: "fn friction(x: f64, m: f64, f: f64) -> f64 { 1.0 - (1.0 - x) / (1.0 + f * x) }",
      hlsl: "float friction(float x, float m, float f) { m = (m == 0.0) ? 1.0 : m; f = (f == 0.0) ? 2.0 : f; return 1.0 - (1.0 - x) / (1.0 + f * x); }",
      wgsl: "fn friction(x: f32, m: f32, f: f32) -> f32 { let m = select(1.0, m, m != 0.0); let f = select(2.0, f, f != 0.0); return 1.0 - (1.0 - x) / (1.0 + f * x); }",
      python:
        "def friction(x, m=1, f=2): m = m or 1; f = f or 2; return 1 - (1 - x) / (1 + f * x)",
      cpp: "float friction(float x, float m = 1.0f, float f = 2.0f) { return 1.0f - (1.0f - x) / (1.0f + f * x); }",
      lua: "function friction(x, m, f) m = m or 1; f = f or 2; return 1 - (1 - x) / (1 + f * x) end",
      gdscript:
        "func friction(x: float, m: float = 1.0, f: float = 2.0) -> float: return 1 - (1 - x) / (1 + f * x)",
      cuda: "__device__ float friction(float x, float m, float f) { return 1.0f - (1.0f - x) / (1.0f + f * x); }",
      c: "double friction(double x, double m, double f) { return 1 - (1 - x) / (1 + f * x); }",
      json: '{"name": "Friction Deceleration", "formula": "y = 1 - (1 - t) / (1 + friction * t)", "params": {"m": 1, "f": 2}}',
      metal:
        "float friction(float x, float m, float f) { m = (m == 0.0) ? 1.0 : m; f = (f == 0.0) ? 2.0 : f; return 1.0 - (1.0 - x) / (1.0 + f * x); }",
      opencl:
        "float friction(float x, float m, float f) { m = (m == 0.0f) ? 1.0f : m; f = (f == 0.0f) ? 2.0f : f; return 1.0f - (1.0f - x) / (1.0f + f * x); }",
      unity:
        "public static float Friction(float x, float m, float f) { return 1.0f - (1.0f - x) / (1.0f + f * x); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["spring", "overshoot-settle", "linear"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => frictionCurve(p as FrictionParams),
    },
  };
}
