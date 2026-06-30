import {
  DEFAULT_SAMPLING,
  sdfTorusKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { majorR: 0.3, minorR: 0.1, cx: 0.5 } as const;
export type SdfTorusParams = { majorR: number; minorR: number; cx: number };

export function sdfTorusCurve(
  params: SdfTorusParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sdfTorusKernel(
    params.majorR,
    params.minorR,
    params.cx,
  );
  return {
    id: "sdf-torus",
    name: "SDF Torus",
    aliases: [],
    family: "sdf",
    summary: "1D signed distance to a torus",
    formula: "y = |sqrt((|t-cx|-R)^2) - r| (simplified 1D)",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 0.5],
    tags: [
      "sdf",
      "signed-distance",
      "geometry",
      "primitive",
      "raymarching",
      "torus",
    ],
    useCases: [
      "signed-distance-fields",
      "raymarching",
      "torus-geometry",
      "shader",
    ],
    snippets: {
      equation: "y = |sqrt((|t-cx|-R)^2) - r| (simplified 1D)",
      js: "function sdfTorus(x, R, r, cx) { R = R == null ? 0.3 : R; r = r == null ? 0.1 : r; cx = cx == null ? 0.5 : cx; var d = Math.abs(x - cx); return Math.abs(Math.sqrt(Math.pow(d - R, 2)) - r); }",
      ts: "function sdfTorus(x: number, R: number = 0.3, r: number = 0.1, cx: number = 0.5): number { const d = Math.abs(x - cx); return Math.abs(Math.sqrt(Math.pow(d - R, 2)) - r); }",
      glsl: "float sdfTorus(float x, float R, float r, float cx) { R = (R == 0.0) ? 0.3 : R; r = (r == 0.0) ? 0.1 : r; cx = (cx == 0.0) ? 0.5 : cx; float d = abs(x - cx); return abs(sqrt(pow(d - R, 2.0)) - r); }",
      vex: "float sdfTorus(float x; float R; float r; float cx) { if (R == 0) R = 0.3; if (r == 0) r = 0.1; if (cx == 0) cx = 0.5; float d = abs(x - cx); return abs(sqrt(pow(d - R, 2)) - r); }",
      csharp:
        "float SdfTorus(float x, float R = 0.3f, float r = 0.1f, float cx = 0.5f) { float d = Math.Abs(x - cx); return Math.Abs(MathF.Sqrt(MathF.Pow(d - R, 2)) - r); }",
      rust: "fn sdf_torus(x: f64, R: f64, r: f64, cx: f64) -> f64 { let R = if R == 0.0 { 0.3 } else { R }; let r = if r == 0.0 { 0.1 } else { r }; let cx = if cx == 0.0 { 0.5 } else { cx }; let d = (x - cx).abs(); ((d - R).powi(2)).sqrt().abs() - r }",
      hlsl: "float sdfTorus(float x, float R, float r, float cx) { R = (R == 0.0) ? 0.3 : R; r = (r == 0.0) ? 0.1 : r; cx = (cx == 0.0) ? 0.5 : cx; float d = abs(x - cx); return abs(sqrt(pow(d - R, 2.0)) - r); }",
      wgsl: "fn sdf_torus(x: f32, R: f32, r: f32, cx: f32) -> f32 { let R = select(0.3, R, R != 0.0); let r = select(0.1, r, r != 0.0); let cx = select(0.5, cx, cx != 0.0); let d = abs(x - cx); return abs(sqrt(pow(d - R, 2.0)) - r); }",
      python:
        "def sdf_torus(x, R=0.3, r=0.1, cx=0.5): R = R or 0.3; r = r or 0.1; cx = cx or 0.5; d = abs(x - cx); return abs(math.sqrt((d - R) ** 2) - r)",
      cpp: "float sdfTorus(float x, float R = 0.3f, float r = 0.1f, float cx = 0.5f) { float d = std::abs(x - cx); return std::abs(std::sqrt(std::pow(d - R, 2.0f)) - r); }",
      lua: "function sdfTorus(x, R, r, cx) R = R or 0.3; r = r or 0.1; cx = cx or 0.5; local d = math.abs(x - cx); return math.abs(math.sqrt((d - R) ^ 2) - r) end",
      gdscript:
        "func sdfTorus(x: float, R: float = 0.3, r: float = 0.1, cx: float = 0.5) -> float: var d = abs(x - cx); return abs(sqrt(pow(d - R, 2.0)) - r)",
      cuda: "__device__ float sdfTorus(float x, float R, float r, float cx) { float d = fabsf(x - cx); return fabsf(sqrtf(powf(d - R, 2.0f)) - r); }",
      c: "double sdfTorus(double x, double R, double r, double cx) { double d = fabs(x - cx); return fabs(sqrt(pow(d - R, 2.0)) - r); }",
      metal:
        "float sdfTorus(float x, float R, float r, float cx) { R = (R == 0.0) ? 0.3 : R; r = (r == 0.0) ? 0.1 : r; cx = (cx == 0.0) ? 0.5 : cx; float d = abs(x - cx); return abs(sqrt(pow(d - R, 2.0)) - r); }",
      opencl:
        "float sdfTorus(float x, float R, float r, float cx) { float d = fabs(x - cx); return fabs(sqrt(pow(d - R, 2.0)) - r); }",
      unity:
        "public static float SdfTorus(float x, float R = 0.3f, float r = 0.1f, float cx = 0.5f) { float d = Mathf.Abs(x - cx); return Mathf.Abs(Mathf.Sqrt(Mathf.Pow(d - R, 2)) - r); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sdf-sphere", "sdf-box", "sdf-round-box"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sdfTorusCurve(p as SdfTorusParams),
    },
  };
}
