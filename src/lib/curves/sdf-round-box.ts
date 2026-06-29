import {
  DEFAULT_SAMPLING,
  sdfRoundBoxKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { width: 0.3, cx: 0.5, r: 0.05 } as const;
export type SdfRoundBoxParams = { width: number; cx: number; r: number };

export function sdfRoundBoxCurve(
  params: SdfRoundBoxParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sdfRoundBoxKernel(params.width, params.cx, params.r);
  return {
    id: "sdf-round-box",
    name: "SDF Round Box",
    aliases: [],
    family: "sdf",
    summary: "1D signed distance to a rounded box",
    formula: "y = max(|t-cx| - w/2 + r, 0) - r",
    continuity: "C1",
    domain: [0, 1],
    range: [-1, 0.5],
    tags: ["sdf", "signed-distance", "geometry", "primitive", "raymarching", "rounded"],
    useCases: [
      "signed-distance-fields",
      "raymarching",
      "rounded-geometry",
      "shader",
    ],
    snippets: {
      equation: "y = max(|t-cx| - w/2 + r, 0) - r",
      js: "function sdfRoundBox(x, w, cx, r) { w = w == null ? 0.3 : w; cx = cx == null ? 0.5 : cx; r = r == null ? 0.05 : r; return Math.max(Math.abs(x - cx) - w / 2 + r, 0) - r; }",
      ts: "function sdfRoundBox(x: number, w: number = 0.3, cx: number = 0.5, r: number = 0.05): number { return Math.max(Math.abs(x - cx) - w / 2 + r, 0) - r; }",
      glsl: "float sdfRoundBox(float x, float w, float cx, float r) { w = (w == 0.0) ? 0.3 : w; cx = (cx == 0.0) ? 0.5 : cx; r = (r == 0.0) ? 0.05 : r; return max(abs(x - cx) - w / 2.0 + r, 0.0) - r; }",
      vex: "float sdfRoundBox(float x; float w; float cx; float r) { if (w == 0) w = 0.3; if (cx == 0) cx = 0.5; if (r == 0) r = 0.05; return max(abs(x - cx) - w / 2 + r, 0) - r; }",
      csharp: "float SdfRoundBox(float x, float w = 0.3f, float cx = 0.5f, float r = 0.05f) { return Math.Max(Math.Abs(x - cx) - w / 2 + r, 0) - r; }",
      rust: "fn sdf_round_box(x: f64, w: f64, cx: f64, r: f64) -> f64 { let w = if w == 0.0 { 0.3 } else { w }; let cx = if cx == 0.0 { 0.5 } else { cx }; let r = if r == 0.0 { 0.05 } else { r }; ((x - cx).abs() - w / 2.0 + r).max(0.0) - r }",
      hlsl: "float sdfRoundBox(float x, float w, float cx, float r) { w = (w == 0.0) ? 0.3 : w; cx = (cx == 0.0) ? 0.5 : cx; r = (r == 0.0) ? 0.05 : r; return max(abs(x - cx) - w / 2.0 + r, 0.0) - r; }",
      wgsl: "fn sdf_round_box(x: f32, w: f32, cx: f32, r: f32) -> f32 { let w = select(0.3, w, w != 0.0); let cx = select(0.5, cx, cx != 0.0); let r = select(0.05, r, r != 0.0); return max(abs(x - cx) - w / 2.0 + r, 0.0) - r; }",
      python: "def sdf_round_box(x, w=0.3, cx=0.5, r=0.05): w = w or 0.3; cx = cx or 0.5; r = r or 0.05; return max(abs(x - cx) - w / 2 + r, 0) - r",
      cpp: "float sdfRoundBox(float x, float w = 0.3f, float cx = 0.5f, float r = 0.05f) { return std::max(std::abs(x - cx) - w / 2.0f + r, 0.0f) - r; }",
      lua: "function sdfRoundBox(x, w, cx, r) w = w or 0.3; cx = cx or 0.5; r = r or 0.05; return math.max(math.abs(x - cx) - w / 2 + r, 0) - r end",
      gdscript: "func sdfRoundBox(x: float, w: float = 0.3, cx: float = 0.5, r: float = 0.05) -> float: return max(abs(x - cx) - w / 2.0 + r, 0.0) - r",
      cuda: "__device__ float sdfRoundBox(float x, float w, float cx, float r) { return fmaxf(fabsf(x - cx) - w / 2.0f + r, 0.0f) - r; }",
      c: "double sdfRoundBox(double x, double w, double cx, double r) { return fmax(fabs(x - cx) - w / 2.0 + r, 0.0) - r; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["sdf-box", "sdf-sphere", "sdf-torus"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sdfRoundBoxCurve(p as SdfRoundBoxParams),
    },
  };
}
