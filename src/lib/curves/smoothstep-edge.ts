import {
  DEFAULT_SAMPLING,
  smoothstepEdgeKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { a: 0.2, b: 0.8 } as const;
export type SmoothstepEdgeParams = { a: number; b: number };

export function smoothstepEdgeCurve(
  params: SmoothstepEdgeParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = smoothstepEdgeKernel(params.a, params.b);
  return {
    id: "smoothstep-edge",
    name: "Smoothstep Edge",
    aliases: ["edged smoothstep", "ramped smoothstep", "windowed smoothstep"],
    family: "smoothstep",
    summary: "Ramped smooth threshold",
    formula: "y = smoothstep((x - a) / (b - a))",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["smoothstep", "ramp", "edge", "mask"],
    useCases: ["edge-masking", "alpha-ramps", "ui-transitions", "soft-clips"],
    snippets: {
      equation: "y = 3x^2 - 2x^3 over [a, b]",
      js: "function smoothstepEdge(x, a, b) { if (x <= a) return 0; if (x >= b) return 1; const t = (x - a) / (b - a); return t * t * (3 - 2 * t); }",
      glsl: "float smoothstepEdge(float x, float a, float b) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }",
      vex: "float smoothstepEdge(float x; float a; float b) { float t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }",
      ts: "function smoothstepEdge(x: number, a: number, b: number): number { if (x <= a) return 0; if (x >= b) return 1; const t = (x - a) / (b - a); return t * t * (3 - 2 * t); }",
      csharp:
        "float SmoothstepEdge(float x, float a, float b) { if (x <= a) return 0; if (x >= b) return 1; float t = (x - a) / (b - a); return t * t * (3 - 2 * t); }",
      rust: "fn smoothstep_edge(x: f64, a: f64, b: f64) -> f64 { if x <= a { return 0.0; } if x >= b { return 1.0; } let t = (x - a) / (b - a); t * t * (3.0 - 2.0 * t) }",
      hlsl: "float smoothstepEdge(float x, float a, float b) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }",
      wgsl: "fn smoothstepEdge(x: f32, a: f32, b: f32) -> f32 { let t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }",
      python:
        "def smoothstep_edge(x, a, b): if x <= a: return 0; if x >= b: return 1; t = (x - a) / (b - a); return t * t * (3 - 2 * t)",
      css: "cubic-bezier(0.42, 0, 0.58, 1)",
      cpp: "float smoothstepEdge(float x, float a = 0.2f, float b = 0.8f) { float t = std::max(0.0f, std::min(1.0f, (x - a) / (b - a))); return t * t * (3.0f - 2.0f * t); }",
      lua: "function smoothstepEdge(x, a, b) a = a or 0.2 b = b or 0.8 local t = (x - a) / (b - a) if t < 0 then t = 0 end if t > 1 then t = 1 end return t * t * (3 - 2 * t) end",
      gdscript:
        "func smoothstepEdge(x: float, a: float = 0.2, b: float = 0.8) -> float: var t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t)",
      cuda: "__device__ float smoothstepEdge(float x, float a, float b) { float t = fminf(1.0f, fmaxf(0.0f, (x - a) / (b - a))); return t * t * (3.0f - 2.0f * t); }",
      c: "double smoothstepEdge(double x, double a, double b) { double t = fmax(0.0, fmin(1.0, (x - a) / (b - a))); return t * t * (3.0 - 2.0 * t); }",
      json: '{"name": "Smoothstep Edge", "formula": "y = smoothstep((x - a) / (b - a))", "params": {"a": 0.2, "b": 0.8}}',
      metal:
        "float smoothstepEdge(float x, float a, float b) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }",
      opencl:
        "float smoothstepEdge(float x, float a, float b) { float t = fmin(1.0f, fmax(0.0f, (x - a) / (b - a))); return t * t * (3.0f - 2.0f * t); }",
      unity:
        "public static float SmoothstepEdge(float x, float a, float b) { if (x <= a) return 0; if (x >= b) return 1; float t = (x - a) / (b - a); return t * t * (3 - 2 * t); }",
      matlab:
        "y = @(x, a, b) max(0, min(1, (x - a) / (b - a))) ^ 2 * (3 - 2 * max(0, min(1, (x - a) / (b - a))));",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "smootherstep", "step", "septic-smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => smoothstepEdgeCurve(p as SmoothstepEdgeParams),
    },
  };
}
