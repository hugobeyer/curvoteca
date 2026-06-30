import {
  DEFAULT_SAMPLING,
  softDeadZoneKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { d: 0.2 } as const;
export type SoftDeadZoneParams = { d: number };

export function softDeadZoneCurve(
  params: SoftDeadZoneParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = softDeadZoneKernel(params.d);
  return {
    id: "soft-dead-zone",
    name: "Soft Dead Zone",
    aliases: ["smooth deadband", "soft deadband", "smooth input calibration"],
    family: "utility",
    summary: "Smoothed input dead zone",
    formula: "y = 0 if |x| < d, else sign(x) * smoothstep(0,1, (|x|-d)/(1-d))",
    continuity: "C1",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["tooling", "dead-zone", "input", "controller", "smooth"],
    useCases: [
      "input-calibration",
      "controller-deadzone",
      "noise-gating",
      "analog-input",
    ],

    snippets: {
      equation:
        "y = 0 if |x| < d, else sign(x) * smoothstep(0,1, (|x|-d)/(1-d))",
      js: "function softDeadZone(x, d) { const a = Math.abs(x); if (a < d) return 0; const u = (a - d) / (1 - d); const y = u*u*(3 - 2*u); return x < 0 ? -y : y; }",
      glsl: "float softDeadZone(float x, float d) { float a = abs(x); if (a < d) return 0.0; float u = (a - d) / (1.0 - d); float y = u*u*(3.0 - 2.0*u); return x < 0.0 ? -y : y; }",
      vex: "float softDeadZone(float x; float d) { float a = abs(x); if (a < d) return 0; float u = (a - d) / (1 - d); float y = u*u*(3 - 2*u); return x < 0 ? -y : y; }",
      ts: "function softDeadZone(x: number, d: number = 0.2): number { const a = Math.abs(x); if (a < d) return 0; const u = (a - d) / (1 - d); const y = u * u * (3 - 2 * u); return x < 0 ? -y : y; }",
      csharp:
        "float SoftDeadZone(float x, float d = 0.2f) { float a = MathF.Abs(x); if (a < d) return 0.0f; float u = (a - d) / (1.0f - d); float y = u * u * (3.0f - 2.0f * u); return x < 0 ? -y : y; }",
      rust: "fn softDeadZone(x: f64, d: f64) -> f64 { let a = x.abs(); if a < d { return 0.0; } let u = (a - d) / (1.0 - d); let y = u * u * (3.0 - 2.0 * u); if x < 0.0 { -y } else { y } }",
      hlsl: "float softDeadZone(float x, float d) { float a = abs(x); if (a < d) return 0.0; float u = (a - d) / (1.0 - d); float y = u * u * (3.0 - 2.0 * u); return x < 0.0 ? -y : y; }",
      wgsl: "fn softDeadZone(x: f32, d: f32) -> f32 { let a = abs(x); if (a < d) { return 0.0; } let u = (a - d) / (1.0 - d); let y = u * u * (3.0 - 2.0 * u); return select(y, -y, x < 0.0); }",
      python:
        "def softDeadZone(x, d=0.2): a = abs(x); return 0 if a < d else (lambda u: u * u * (3 - 2 * u))((a - d) / (1 - d)) * (-1 if x < 0 else 1)",
      cpp: "float softDeadZone(float x, float d = 0.2f) { float a = std::abs(x); if (a < d) return 0.0f; float u = (a - d) / (1.0f - d); float y = u * u * (3.0f - 2.0f * u); return x < 0.0f ? -y : y; }",
      lua: "function softDeadZone(x, d) d = d or 0.2 local a = math.abs(x) if a < d then return 0 end local u = (a - d) / (1 - d) local y = u * u * (3 - 2 * u) return x < 0 and -y or y end",
      gdscript:
        "func softDeadZone(x: float, d: float = 0.2) -> float: var a = abs(x); if a < d: return 0.0; var u = (a - d) / (1.0 - d); var y = u * u * (3.0 - 2.0 * u); return -y if x < 0 else y",
      cuda: "__device__ float softDeadZone(float x, float d) { float a = fabsf(x); if (a < d) return 0.0f; float u = (a - d) / (1.0f - d); float y = u * u * (3.0f - 2.0f * u); return x < 0.0f ? -y : y; }",
      c: "double softDeadZone(double x, double d) { double a = fabs(x); if (a < d) return 0.0; double u = (a - d) / (1.0 - d); double y = u * u * (3.0 - 2.0 * u); return x < 0.0 ? -y : y; }",
      json: '{"name": "Soft Dead Zone", "formula": "y = 0 if |x| < d, else sign(x) * smoothstep(0,1, (|x|-d)/(1-d))", "params": {"d": 0.2}}',
      metal:
        "float softDeadZone(float x, float d) { float a = abs(x); if (a < d) return 0.0; float u = (a - d) / (1.0 - d); float y = u*u*(3.0 - 2.0*u); return x < 0.0 ? -y : y; }",
      opencl:
        "float softDeadZone(float x, float d) { float a = fabs(x); if (a < d) return 0.0f; float u = (a - d) / (1.0f - d); float y = u*u*(3.0f - 2.0f*u); return x < 0.0f ? -y : y; }",
      unity:
        "public static float SoftDeadZone(float x, float d = 0.2f) { float a = Mathf.Abs(x); if (a < d) return 0.0f; float u = (a - d) / (1.0f - d); float y = u * u * (3.0f - 2.0f * u); return x < 0 ? -y : y; }",
      matlab:
        "y = @(x, d) (abs(x) < d) * 0 + sign(x) * max(0, (abs(x) - d) / (1 - d))^2 * (3 - 2*max(0, (abs(x) - d) / (1 - d)));",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["dead-zone", "linear", "signed-scale", "smootherstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => softDeadZoneCurve(p as SoftDeadZoneParams),
    },
  };
}
