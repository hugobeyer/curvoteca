import { DEFAULT_SAMPLING, sdfBoxKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { width: 0.3, cx: 0.5 } as const;
export type SdfBoxParams = { width: number; cx: number };

export function sdfBoxCurve(
  params: SdfBoxParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sdfBoxKernel(params.width, params.cx);
  return {
    id: "sdf-box",
    name: "SDF Box",
    aliases: [],
    family: "sdf",
    summary: "1D signed distance to a box",
    formula: "y = |t - cx| - w/2",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 0.5],
    tags: ["sdf", "signed-distance", "geometry", "primitive", "raymarching"],
    useCases: [
      "signed-distance-fields",
      "raymarching",
      "geometry-representation",
      "shader",
    ],
    snippets: {
      equation: "y = |t - cx| - w/2",
      js: "function sdfBox(x, w, cx) { w = w == null ? 0.3 : w; cx = cx == null ? 0.5 : cx; return Math.abs(x - cx) - w / 2; }",
      ts: "function sdfBox(x: number, w: number = 0.3, cx: number = 0.5): number { return Math.abs(x - cx) - w / 2; }",
      glsl: "float sdfBox(float x, float w, float cx) { w = (w == 0.0) ? 0.3 : w; cx = (cx == 0.0) ? 0.5 : cx; return abs(x - cx) - w / 2.0; }",
      vex: "float sdfBox(float x; float w; float cx) { if (w == 0) w = 0.3; if (cx == 0) cx = 0.5; return abs(x - cx) - w / 2; }",
      csharp: "float SdfBox(float x, float w = 0.3f, float cx = 0.5f) { return Math.Abs(x - cx) - w / 2; }",
      rust: "fn sdf_box(x: f64, w: f64, cx: f64) -> f64 { let w = if w == 0.0 { 0.3 } else { w }; let cx = if cx == 0.0 { 0.5 } else { cx }; (x - cx).abs() - w / 2.0 }",
      hlsl: "float sdfBox(float x, float w, float cx) { w = (w == 0.0) ? 0.3 : w; cx = (cx == 0.0) ? 0.5 : cx; return abs(x - cx) - w / 2.0; }",
      wgsl: "fn sdf_box(x: f32, w: f32, cx: f32) -> f32 { let w = select(0.3, w, w != 0.0); let cx = select(0.5, cx, cx != 0.0); return abs(x - cx) - w / 2.0; }",
      python: "def sdf_box(x, w=0.3, cx=0.5): w = w or 0.3; cx = cx or 0.5; return abs(x - cx) - w / 2",
      cpp: "float sdfBox(float x, float w = 0.3f, float cx = 0.5f) { return std::abs(x - cx) - w / 2.0f; }",
      lua: "function sdfBox(x, w, cx) w = w or 0.3; cx = cx or 0.5; return math.abs(x - cx) - w / 2 end",
      gdscript: "func sdfBox(x: float, w: float = 0.3, cx: float = 0.5) -> float: return abs(x - cx) - w / 2.0",
      cuda: "__device__ float sdfBox(float x, float w, float cx) { return fabsf(x - cx) - w / 2.0f; }",
      c: "double sdfBox(double x, double w, double cx) { return fabs(x - cx) - w / 2.0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sdf-sphere", "sdf-round-box", "sdf-torus"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sdfBoxCurve(p as SdfBoxParams),
    },
  };
}
