import {
  DEFAULT_SAMPLING,
  sdfUnionKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  radius1: 0.3,
  cx1: 0.3,
  radius2: 0.3,
  cx2: 0.7,
} as const;
export type SdfUnionParams = {
  radius1: number;
  cx1: number;
  radius2: number;
  cx2: number;
};

export function sdfUnionCurve(
  params: SdfUnionParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sdfUnionKernel(
    params.radius1,
    params.cx1,
    params.radius2,
    params.cx2,
  );
  return {
    id: "sdf-union",
    name: "SDF Union",
    family: "sdf",
    summary: "Boolean union of two SDF circles",
    formula: "y = min(sdf1(t), sdf2(t))",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 0.5],
    tags: ["sdf", "boolean", "union", "csg", "geometry"],
    useCases: [
      "csg-operations",
      "sdf-combination",
      "geometry-composition",
      "raymarching",
    ],
    snippets: {
      equation: "y = min(sdf1(t), sdf2(t))",
      js: "function sdfUnion(x, r1, c1, r2, c2) { r1 = r1 == null ? 0.3 : r1; c1 = c1 == null ? 0.3 : c1; r2 = r2 == null ? 0.3 : r2; c2 = c2 == null ? 0.7 : c2; var d1 = Math.abs(x - c1) - r1; var d2 = Math.abs(x - c2) - r2; return Math.min(d1, d2); }",
      ts: "function sdfUnion(x: number, r1: number = 0.3, c1: number = 0.3, r2: number = 0.3, c2: number = 0.7): number { const d1 = Math.abs(x - c1) - r1; const d2 = Math.abs(x - c2) - r2; return Math.min(d1, d2); }",
      glsl: "float sdfUnion(float x, float r1, float c1, float r2, float c2) { r1 = (r1 == 0.0) ? 0.3 : r1; c1 = (c1 == 0.0) ? 0.3 : c1; r2 = (r2 == 0.0) ? 0.3 : r2; c2 = (c2 == 0.0) ? 0.7 : c2; float d1 = abs(x - c1) - r1; float d2 = abs(x - c2) - r2; return min(d1, d2); }",
      vex: "float sdfUnion(float x; float r1; float c1; float r2; float c2) { if (r1 == 0) r1 = 0.3; if (c1 == 0) c1 = 0.3; if (r2 == 0) r2 = 0.3; if (c2 == 0) c2 = 0.7; float d1 = abs(x - c1) - r1; float d2 = abs(x - c2) - r2; return min(d1, d2); }",
      csharp: "float SdfUnion(float x, float r1 = 0.3f, float c1 = 0.3f, float r2 = 0.3f, float c2 = 0.7f) { float d1 = MathF.Abs(x - c1) - r1; float d2 = MathF.Abs(x - c2) - r2; return MathF.Min(d1, d2); }",
      rust: "fn sdf_union(x: f64, r1: f64, c1: f64, r2: f64, c2: f64) -> f64 { let r1 = if r1 == 0.0 { 0.3 } else { r1 }; let c1 = if c1 == 0.0 { 0.3 } else { c1 }; let r2 = if r2 == 0.0 { 0.3 } else { r2 }; let c2 = if c2 == 0.0 { 0.7 } else { c2 }; let d1 = (x - c1).abs() - r1; let d2 = (x - c2).abs() - r2; d1.min(d2) }",
      hlsl: "float sdfUnion(float x, float r1, float c1, float r2, float c2) { r1 = (r1 == 0.0) ? 0.3 : r1; c1 = (c1 == 0.0) ? 0.3 : c1; r2 = (r2 == 0.0) ? 0.3 : r2; c2 = (c2 == 0.0) ? 0.7 : c2; float d1 = abs(x - c1) - r1; float d2 = abs(x - c2) - r2; return min(d1, d2); }",
      wgsl: "fn sdf_union(x: f32, r1: f32, c1: f32, r2: f32, c2: f32) -> f32 { let r1 = select(0.3, r1, r1 != 0.0); let c1 = select(0.3, c1, c1 != 0.0); let r2 = select(0.3, r2, r2 != 0.0); let c2 = select(0.7, c2, c2 != 0.0); let d1 = abs(x - c1) - r1; let d2 = abs(x - c2) - r2; return min(d1, d2); }",
      python: "def sdf_union(x, r1=0.3, c1=0.3, r2=0.3, c2=0.7): d1 = abs(x - c1) - r1; d2 = abs(x - c2) - r2; return min(d1, d2)",
      cpp: "float sdfUnion(float x, float r1 = 0.3f, float c1 = 0.3f, float r2 = 0.3f, float c2 = 0.7f) { float d1 = std::abs(x - c1) - r1; float d2 = std::abs(x - c2) - r2; return std::min(d1, d2); }",
      lua: "function sdfUnion(x, r1, c1, r2, c2) r1 = r1 or 0.3; c1 = c1 or 0.3; r2 = r2 or 0.3; c2 = c2 or 0.7; local d1 = math.abs(x - c1) - r1; local d2 = math.abs(x - c2) - r2; return math.min(d1, d2) end",
      gdscript: "func sdfUnion(x: float, r1: float = 0.3, c1: float = 0.3, r2: float = 0.3, c2: float = 0.7) -> float: var d1 = abs(x - c1) - r1; var d2 = abs(x - c2) - r2; return min(d1, d2)",
      cuda: "__device__ float sdfUnion(float x, float r1, float c1, float r2, float c2) { float d1 = fabsf(x - c1) - r1; float d2 = fabsf(x - c2) - r2; return fminf(d1, d2); }",
      c: "double sdfUnion(double x, double r1, double c1, double r2, double c2) { double d1 = fabs(x - c1) - r1; double d2 = fabs(x - c2) - r2; return fmin(d1, d2); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sdf-intersect", "sdf-subtract", "sdf-sphere", "sdf-box"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sdfUnionCurve(p as SdfUnionParams),
    },
  };
}
