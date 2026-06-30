import {
  DEFAULT_SAMPLING,
  reinhardKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { whitePoint: 1 } as const;
export type ReinhardParams = { whitePoint: number };

export function reinhardCurve(
  params: ReinhardParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = reinhardKernel(params.whitePoint);
  return {
    id: "reinhard",
    name: "Reinhard Tone Map",
    aliases: [],
    family: "tone-mapping",
    summary: "Reinhard global tone mapping operator",
    formula: "y = t * (1 + t/wp^2) / (1 + t)",
    continuity: "C3+",
    domain: [0, 10],
    range: [0, 1],
    tags: ["tonemap", "hdr", "reinhard", "photography", "rendering"],
    useCases: [
      "hdr-tonemapping",
      "photography",
      "rendering-pipeline",
      "color-science",
    ],
    snippets: {
      equation: "y = t * (1 + t/wp^2) / (1 + t)",
      js: "function reinhard(x, wp) { wp = wp == null ? 1 : wp; return x * (1 + x / (wp * wp)) / (1 + x); }",
      ts: "function reinhard(x: number, wp: number = 1): number { return x * (1 + x / (wp * wp)) / (1 + x); }",
      glsl: "float reinhard(float x, float wp) { wp = (wp == 0.0) ? 1.0 : wp; return x * (1.0 + x / (wp * wp)) / (1.0 + x); }",
      vex: "float reinhard(float x; float wp) { if (wp == 0) wp = 1; return x * (1 + x / (wp * wp)) / (1 + x); }",
      csharp:
        "float Reinhard(float x, float wp = 1) { return x * (1 + x / (wp * wp)) / (1 + x); }",
      rust: "fn reinhard(x: f64, wp: f64) -> f64 { let wp = if wp == 0.0 { 1.0 } else { wp }; x * (1.0 + x / (wp * wp)) / (1.0 + x) }",
      hlsl: "float reinhard(float x, float wp) { wp = (wp == 0.0) ? 1.0 : wp; return x * (1.0 + x / (wp * wp)) / (1.0 + x); }",
      wgsl: "fn reinhard(x: f32, wp: f32) -> f32 { let wp = select(1.0, wp, wp != 0.0); return x * (1.0 + x / (wp * wp)) / (1.0 + x); }",
      python:
        "def reinhard(x, wp=1): wp = wp or 1; return x * (1 + x / (wp * wp)) / (1 + x)",
      css: "cubic-bezier(0.5, 1, 0.5, 1)",
      cpp: "float reinhard(float x, float wp = 1.0f) { return x * (1.0f + x / (wp * wp)) / (1.0f + x); }",
      lua: "function reinhard(x, wp) wp = wp or 1; return x * (1 + x / (wp * wp)) / (1 + x) end",
      gdscript:
        "func reinhard(x: float, wp: float = 1.0) -> float: return x * (1 + x / (wp * wp)) / (1 + x)",
      cuda: "__device__ float reinhard(float x, float wp) { return x * (1.0f + x / (wp * wp)) / (1.0f + x); }",
      c: "double reinhard(double x, double wp) { return x * (1.0 + x / (wp * wp)) / (1.0 + x); }",
      json: '{"name": "Reinhard Tone Map", "formula": "y = t * (1 + t/wp^2) / (1 + t)", "params": {"whitePoint": 1}}',
      metal:
        "float reinhard(float x, float wp) { wp = (wp == 0.0) ? 1.0 : wp; return x * (1.0 + x / (wp * wp)) / (1.0 + x); }",
      opencl:
        "float reinhard(float x, float wp) { return x * (1.0f + x / (wp * wp)) / (1.0f + x); }",
      unity:
        "public static float Reinhard(float x, float wp = 1) { return x * (1 + x / (wp * wp)) / (1 + x); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["filmic", "compressor", "gain"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => reinhardCurve(p as ReinhardParams),
    },
  };
}
