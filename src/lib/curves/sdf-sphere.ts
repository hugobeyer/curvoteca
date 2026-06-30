import {
  DEFAULT_SAMPLING,
  sdfSphereKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { radius: 0.3, cx: 0.5 } as const;
export type SdfSphereParams = { radius: number; cx: number };

export function sdfSphereCurve(
  params: SdfSphereParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sdfSphereKernel(params.radius, params.cx);
  return {
    id: "sdf-sphere",
    name: "SDF Sphere",
    aliases: [],
    family: "sdf",
    summary: "1D signed distance to a sphere",
    formula: "y = |t - cx| - r",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["sdf", "signed-distance", "geometry", "primitive", "raymarching"],
    useCases: [
      "signed-distance-fields",
      "raymarching",
      "geometry-representation",
      "shader",
    ],
    snippets: {
      equation: "y = |t - cx| - r",
      js: "function sdfSphere(x, r, cx) { r = r == null ? 0.3 : r; cx = cx == null ? 0.5 : cx; return Math.abs(x - cx) - r; }",
      ts: "function sdfSphere(x: number, r: number = 0.3, cx: number = 0.5): number { return Math.abs(x - cx) - r; }",
      glsl: "float sdfSphere(float x, float r, float cx) { r = (r == 0.0) ? 0.3 : r; cx = (cx == 0.0) ? 0.5 : cx; return abs(x - cx) - r; }",
      vex: "float sdfSphere(float x; float r; float cx) { if (r == 0) r = 0.3; if (cx == 0) cx = 0.5; return abs(x - cx) - r; }",
      csharp:
        "float SdfSphere(float x, float r = 0.3f, float cx = 0.5f) { return Math.Abs(x - cx) - r; }",
      rust: "fn sdf_sphere(x: f64, r: f64, cx: f64) -> f64 { let r = if r == 0.0 { 0.3 } else { r }; let cx = if cx == 0.0 { 0.5 } else { cx }; (x - cx).abs() - r }",
      hlsl: "float sdfSphere(float x, float r, float cx) { r = (r == 0.0) ? 0.3 : r; cx = (cx == 0.0) ? 0.5 : cx; return abs(x - cx) - r; }",
      wgsl: "fn sdf_sphere(x: f32, r: f32, cx: f32) -> f32 { let r = select(0.3, r, r != 0.0); let cx = select(0.5, cx, cx != 0.0); return abs(x - cx) - r; }",
      python:
        "def sdf_sphere(x, r=0.3, cx=0.5): r = r or 0.3; cx = cx or 0.5; return abs(x - cx) - r",
      cpp: "float sdfSphere(float x, float r = 0.3f, float cx = 0.5f) { return std::abs(x - cx) - r; }",
      lua: "function sdfSphere(x, r, cx) r = r or 0.3; cx = cx or 0.5; return math.abs(x - cx) - r end",
      gdscript:
        "func sdfSphere(x: float, r: float = 0.3, cx: float = 0.5) -> float: return abs(x - cx) - r",
      cuda: "__device__ float sdfSphere(float x, float r, float cx) { return fabsf(x - cx) - r; }",
      c: "double sdfSphere(double x, double r, double cx) { return fabs(x - cx) - r; }",
      metal:
        "float sdfSphere(float x, float r, float cx) { r = (r == 0.0) ? 0.3 : r; cx = (cx == 0.0) ? 0.5 : cx; return abs(x - cx) - r; }",
      opencl:
        "float sdfSphere(float x, float r, float cx) { return fabs(x - cx) - r; }",
      unity:
        "public static float SdfSphere(float x, float r = 0.3f, float cx = 0.5f) { return Mathf.Abs(x - cx) - r; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sdf-box", "sdf-round-box", "sdf-torus"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sdfSphereCurve(p as SdfSphereParams),
    },
  };
}
