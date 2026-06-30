import {
  DEFAULT_SAMPLING,
  deadZoneKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { d: 0.2 } as const;
export type DeadZoneParams = { d: number };

export function deadZoneCurve(
  params: DeadZoneParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = deadZoneKernel(params.d);
  return {
    id: "dead-zone",
    name: "Dead Zone",
    aliases: ["deadzone", "input deadband", "dead band", "input calibration"],
    family: "utility",
    summary: "Input dead zone",
    formula: "y = 0 if |x| < d, else sign(x) * (|x| - d) / (1 - d)",
    continuity: "C0",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["tooling", "dead-zone", "input", "controller"],
    useCases: ["input-calibration", "controller-deadzone", "noise-gating"],
    snippets: {
      equation: "y = 0 if |x| < d, else sign(x) * (|x| - d) / (1 - d)",
      js: "function deadZone(x, d) { return Math.abs(x) < d ? 0 : Math.sign(x) * (Math.abs(x) - d) / (1 - d); }",
      glsl: "float deadZone(float x, float d) { return abs(x) < d ? 0.0 : sign(x) * (abs(x) - d) / (1.0 - d); }",
      vex: "float deadZone(float x; float d) { return abs(x) < d ? 0 : sign(x) * (abs(x) - d) / (1 - d); }",
      ts: "function deadZone(x: number, d: number = 0.2): number { return Math.abs(x) < d ? 0 : Math.sign(x) * (Math.abs(x) - d) / (1 - d); }",
      csharp:
        "float DeadZone(float x, float d = 0.2f) { return MathF.Abs(x) < d ? 0.0f : MathF.Sign(x) * (MathF.Abs(x) - d) / (1.0f - d); }",
      rust: "fn deadZone(x: f64, d: f64) -> f64 { if x.abs() < d { 0.0 } else { x.signum() * (x.abs() - d) / (1.0 - d) } }",
      hlsl: "float deadZone(float x, float d) { return abs(x) < d ? 0.0 : sign(x) * (abs(x) - d) / (1.0 - d); }",
      wgsl: "fn deadZone(x: f32, d: f32) -> f32 { return select(sign(x) * (abs(x) - d) / (1.0 - d), 0.0, abs(x) < d); }",
      python:
        "def deadZone(x, d=0.2): return 0 if abs(x) < d else math.copysign(1, x) * (abs(x) - d) / (1 - d)",
      cpp: "#include <cmath>\nfloat deadZone(float x, float d = 0.2f) { return std::abs(x) < d ? 0.0f : std::copysign((std::abs(x) - d) / (1.0f - d), x); }",
      lua: "function deadZone(x, d) d = d or 0.2; return math.abs(x) < d and 0 or (x > 0 and 1 or -1) * (math.abs(x) - d) / (1 - d) end",
      gdscript:
        "func dead_zone(x: float, d: float = 0.2) -> float: return 0.0 if abs(x) < d else sign(x) * (abs(x) - d) / (1.0 - d)",
      cuda: "__device__ float deadZone(float x, float d) { return fabsf(x) < d ? 0.0f : (x > 0.0f ? 1.0f : -1.0f) * (fabsf(x) - d) / (1.0f - d); }",
      c: "#include <math.h>\ndouble deadZone(double x, double d) { return fabs(x) < d ? 0.0 : (x > 0 ? 1.0 : -1.0) * (fabs(x) - d) / (1.0 - d); }",
      json: '{"name": "Dead Zone", "formula": "y = 0 if |x| < d, else sign(x) * (|x| - d) / (1 - d)", "params": {"d": 0.2}}',
      metal:
        "float deadZone(float x, float d) { return abs(x) < d ? 0.0 : sign(x) * (abs(x) - d) / (1.0 - d); }",
      opencl:
        "float deadZone(float x, float d) { return fabs(x) < d ? 0.0f : (x > 0.0f ? 1.0f : -1.0f) * (fabs(x) - d) / (1.0f - d); }",
      unity:
        "public static float DeadZone(float x, float d = 0.2f) { return MathF.Abs(x) < d ? 0.0f : MathF.Sign(x) * (MathF.Abs(x) - d) / (1.0f - d); }",
      shadertoy:
        "return abs(x) < d ? 0.0 : sign(x) * (abs(x) - d) / (1.0 - d);",
      matlab:
        "y = @(x, d) (abs(x) < d) * 0 + (abs(x) >= d) * (sign(x) * (abs(x) - d) / (1 - d));",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["linear", "signed-scale", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => deadZoneCurve(p as DeadZoneParams),
    },
  };
}
