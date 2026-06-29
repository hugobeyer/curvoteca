import {
  DEFAULT_SAMPLING,
  springKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { damping: 0.5, mass: 1, stiffness: 4 } as const;
export type SpringParams = { damping: number; mass: number; stiffness: number };

export function springCurve(
  params: SpringParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = springKernel(
    params.damping,
    params.mass,
    params.stiffness,
  );
  return {
    id: "spring",
    name: "Spring",
    aliases: ["damped harmonic oscillator", "spring physics", "mass-spring"],
    family: "oscillator",
    summary: "Damped harmonic oscillator",
    formula:
      "y = 1 - e^(-ζωt) * (cos(ω_d*t) + (ζω/ω_d)*sin(ω_d*t))",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["oscillator", "physics", "spring", "damping", "ease-out"],
    useCases: [
      "physics-simulation",
      "spring-animation",
      "elastic-physics",
      "ui-animation",
    ],
    snippets: {
      equation:
        "y = 1 - e^(-ζωt) * (cos(ω_d*t) + (ζω/ω_d)*sin(ω_d*t))",
      js: "function spring(x, d, m, s) { d = d == null ? 0.5 : d; m = m == null ? 1 : m; s = s == null ? 4 : s; if (x === 0) return 0; if (x >= 1) return 1; var omega = Math.sqrt(s / m); var zeta = d / (2 * Math.sqrt(s * m)); var wd = omega * Math.sqrt(1 - zeta * zeta); var e = Math.exp(-zeta * omega * x); return 1 - e * (Math.cos(wd * x) + (zeta * omega / wd) * Math.sin(wd * x)); }",
      ts: "function spring(x: number, d: number = 0.5, m: number = 1, s: number = 4): number { if (x === 0) return 0; if (x >= 1) return 1; const omega = Math.sqrt(s / m); const zeta = d / (2 * Math.sqrt(s * m)); const wd = omega * Math.sqrt(1 - zeta * zeta); const e = Math.exp(-zeta * omega * x); return 1 - e * (Math.cos(wd * x) + (zeta * omega / wd) * Math.sin(wd * x)); }",
      glsl: "float spring(float x, float d, float m, float s) { d = (d < 0.01) ? 0.5 : d; m = (m == 0.0) ? 1.0 : m; s = (s == 0.0) ? 4.0 : s; if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; float omega = sqrt(s / m); float zeta = d / (2.0 * sqrt(s * m)); float wd = omega * sqrt(1.0 - zeta * zeta); float e = exp(-zeta * omega * x); return 1.0 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x)); }",
      vex: "float spring(float x; float d; float m; float s) { if (d < 0.01) d = 0.5; if (m == 0) m = 1; if (s == 0) s = 4; if (x == 0) return 0; if (x >= 1) return 1; float omega = sqrt(s / m); float zeta = d / (2 * sqrt(s * m)); float wd = omega * sqrt(1 - zeta * zeta); float e = exp(-zeta * omega * x); return 1 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x)); }",
      csharp: "float Spring(float x, float d = 0.5f, float m = 1, float s = 4) { if (x == 0) return 0; if (x >= 1) return 1; float omega = MathF.Sqrt(s / m); float zeta = d / (2 * MathF.Sqrt(s * m)); float wd = omega * MathF.Sqrt(1 - zeta * zeta); float e = MathF.Exp(-zeta * omega * x); return 1 - e * (MathF.Cos(wd * x) + (zeta * omega / wd) * MathF.Sin(wd * x)); }",
      rust: "fn spring(x: f64, d: f64, m: f64, s: f64) -> f64 { let d = if d < 0.01 { 0.5 } else { d }; let m = if m == 0.0 { 1.0 } else { m }; let s = if s == 0.0 { 4.0 } else { s }; if x == 0.0 { return 0.0; } if x >= 1.0 { return 1.0; } let omega = (s / m).sqrt(); let zeta = d / (2.0 * (s * m).sqrt()); let wd = omega * (1.0 - zeta * zeta).sqrt(); let e = (-zeta * omega * x).exp(); 1.0 - e * (wd * x).cos() + (zeta * omega / wd) * (wd * x).sin() }",
      hlsl: "float spring(float x, float d, float m, float s) { d = (d < 0.01) ? 0.5 : d; m = (m == 0.0) ? 1.0 : m; s = (s == 0.0) ? 4.0 : s; if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; float omega = sqrt(s / m); float zeta = d / (2.0 * sqrt(s * m)); float wd = omega * sqrt(1.0 - zeta * zeta); float e = exp(-zeta * omega * x); return 1.0 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x)); }",
      wgsl: "fn spring(x: f32, d: f32, m: f32, s: f32) -> f32 { let d = select(0.5, d, d >= 0.01); let m = select(1.0, m, m != 0.0); let s = select(4.0, s, s != 0.0); if (x == 0.0) { return 0.0; } if (x >= 1.0) { return 1.0; } let omega = sqrt(s / m); let zeta = d / (2.0 * sqrt(s * m)); let wd = omega * sqrt(1.0 - zeta * zeta); let e = exp(-zeta * omega * x); return 1.0 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x)); }",
      python: "def spring(x, d=0.5, m=1, s=4): d = d if d >= 0.01 else 0.5; m = m or 1; s = s or 4; if x == 0: return 0; if x >= 1: return 1; omega = math.sqrt(s / m); zeta = d / (2 * math.sqrt(s * m)); wd = omega * math.sqrt(1 - zeta * zeta); e = math.exp(-zeta * omega * x); return 1 - e * (math.cos(wd * x) + (zeta * omega / wd) * math.sin(wd * x))",
      cpp: "float spring(float x, float d = 0.5f, float m = 1.0f, float s = 4.0f) { if (d < 0.01f) d = 0.5f; if (m == 0.0f) m = 1.0f; if (s == 0.0f) s = 4.0f; if (x == 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; float omega = std::sqrt(s / m); float zeta = d / (2.0f * std::sqrt(s * m)); float wd = omega * std::sqrt(1.0f - zeta * zeta); float e = std::exp(-zeta * omega * x); return 1.0f - e * (std::cos(wd * x) + (zeta * omega / wd) * std::sin(wd * x)); }",
      lua: "function spring(x, d, m, s) d = d or 0.5 m = m or 1 s = s or 4 if x == 0 then return 0 end if x >= 1 then return 1 end local omega = math.sqrt(s / m) local zeta = d / (2 * math.sqrt(s * m)) local wd = omega * math.sqrt(1 - zeta * zeta) local e = math.exp(-zeta * omega * x) return 1 - e * (math.cos(wd * x) + (zeta * omega / wd) * math.sin(wd * x)) end",
      gdscript: "func spring(x: float, d: float = 0.5, m: float = 1.0, s: float = 4.0) -> float: if x == 0: return 0.0; if x >= 1: return 1.0; var omega = sqrt(s / m); var zeta = d / (2 * sqrt(s * m)); var wd = omega * sqrt(1 - zeta * zeta); var e = exp(-zeta * omega * x); return 1 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x))",
      cuda: "__device__ float spring(float x, float d, float m, float s) { if (d < 0.01f) d = 0.5f; if (m == 0.0f) m = 1.0f; if (s == 0.0f) s = 4.0f; if (x == 0.0f) return 0.0f; if (x >= 1.0f) return 1.0f; float omega = sqrtf(s / m); float zeta = d / (2.0f * sqrtf(s * m)); float wd = omega * sqrtf(1.0f - zeta * zeta); float e = expf(-zeta * omega * x); return 1.0f - e * (cosf(wd * x) + (zeta * omega / wd) * sinf(wd * x)); }",
      c: "double spring(double x, double d, double m, double s) { if (d < 0.01) d = 0.5; if (m == 0.0) m = 1.0; if (s == 0.0) s = 4.0; if (x == 0.0) return 0.0; if (x >= 1.0) return 1.0; double omega = sqrt(s / m); double zeta = d / (2.0 * sqrt(s * m)); double wd = omega * sqrt(1.0 - zeta * zeta); double e = exp(-zeta * omega * x); return 1.0 - e * (cos(wd * x) + (zeta * omega / wd) * sin(wd * x)); }",
      json: "{\"name\": \"Spring\", \"formula\": \"y = 1 - e^(-ζωt) * (cos(ω_d*t) + (ζω/ω_d)*sin(ω_d*t))\", \"params\": {\"damping\": 0.5, \"mass\": 1, \"stiffness\": 4}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["elastic-out", "overshoot-settle", "friction"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => springCurve(p as SpringParams),
    },
  };
}
