import {
  DEFAULT_SAMPLING,
  snapGridKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { snap: 0.1 } as const;
export type SnapGridParams = { snap: number };

export function snapGridCurve(
  params: SnapGridParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = snapGridKernel(params.snap);
  return {
    id: "snap-grid",
    name: "Snap-to-Grid",
    aliases: ["snap", "grid snap", "quantize"],
    family: "utility",
    summary: "Quantize values to grid steps",
    formula: "y = round(t / s) * s",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [0, 1],
    tags: ["utility", "snap", "grid", "quantize", "precision"],
    useCases: [
      "snap-to-grid",
      "quantization",
      "value-snapping",
      "precision-tools",
    ],
    snippets: {
      equation: "y = round(t / s) * s",
      js: "function snapGrid(x, s) { s = s == null ? 0.1 : s; return Math.round(x / s) * s; }",
      ts: "function snapGrid(x: number, s: number = 0.1): number { return Math.round(x / s) * s; }",
      glsl: "float snapGrid(float x, float s) { s = (s == 0.0) ? 0.1 : s; return round(x / s) * s; }",
      vex: "float snapGrid(float x; float s) { if (s == 0) s = 0.1; return round(x / s) * s; }",
      csharp:
        "float SnapGrid(float x, float s = 0.1f) { s = s == 0 ? 0.1f : s; return MathF.Round(x / s) * s; }",
      rust: "fn snap_grid(x: f64, s: f64) -> f64 { let s = if s == 0.0 { 0.1 } else { s }; (x / s).round() * s }",
      hlsl: "float snapGrid(float x, float s) { s = (s == 0.0) ? 0.1 : s; return round(x / s) * s; }",
      wgsl: "fn snap_grid(x: f32, s: f32) -> f32 { let s = select(0.1, s, s != 0.0); return round(x / s) * s; }",
      python: "def snap_grid(x, s=0.1): s = s or 0.1; return round(x / s) * s",
      cpp: "float snapGrid(float x, float s = 0.1f) { if (s == 0.0f) s = 0.1f; return std::round(x / s) * s; }",
      lua: "function snapGrid(x, s) s = s or 0.1 if s == 0 then s = 0.1 end return math.floor(x / s + 0.5) * s end",
      gdscript:
        "func snapGrid(x: float, s: float = 0.1) -> float: if s == 0: s = 0.1; return round(x / s) * s",
      cuda: "__device__ float snapGrid(float x, float s) { if (s == 0.0f) s = 0.1f; return roundf(x / s) * s; }",
      c: "double snapGrid(double x, double s) { if (s == 0) s = 0.1; return round(x / s) * s; }",
      json: '{"name": "Snap-to-Grid", "formula": "y = round(t / s) * s", "params": {"snap": 0.1}}',
      metal:
        "float snapGrid(float x, float s) { s = (s == 0.0) ? 0.1 : s; return round(x / s) * s; }",
      opencl:
        "float snapGrid(float x, float s) { if (s == 0.0f) s = 0.1f; return round(x / s) * s; }",
      unity:
        "public static float SnapGrid(float x, float s = 0.1f) { s = s == 0 ? 0.1f : s; return Mathf.Round(x / s) * s; }",
      matlab: "y = @(x, s) round(x / s) * s;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["step", "steps-easing", "round"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => snapGridCurve(p as SnapGridParams),
    },
  };
}
