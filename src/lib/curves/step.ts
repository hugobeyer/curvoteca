import { DEFAULT_SAMPLING, stepKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { edge: 0.5 } as const;
export type StepParams = { edge: number };

export function stepCurve(params: StepParams = defaultParams): CurveDefinition {
  const kernel: CurveKernel = stepKernel(params.edge);
  return {
    id: "step",
    name: "Step",
    aliases: ["hard step", "binary step", "threshold"],
    family: "utility",
    summary: "Binary threshold",
    formula: "y = x < edge ? 0 : 1",
    continuity: "discontinuous",
    domain: [0, 1],
    range: [0, 1],
    tags: ["step", "threshold", "binary", "utility"],
    useCases: ["thresholds", "binary-masks", "logic-gates", "signal-clipping"],
    snippets: {
      equation: "y = x < edge ? 0 : 1",
      js: "function step(x, edge) { edge = edge == null ? 0.5 : edge; return x < edge ? 0 : 1; }",
      glsl: "float step(float x, float edge) { return x < edge ? 0.0 : 1.0; }",
      vex: "float step(float x; float edge) { return x < edge ? 0 : 1; }",
      ts: "function step(x: number, edge: number = 0.5): number { return x < edge ? 0 : 1; }",
      csharp: "float Step(float x, float edge = 0.5f) { return x < edge ? 0 : 1; }",
      rust: "fn step(x: f64, edge: f64) -> f64 { if x < edge { 0.0 } else { 1.0 } }",
      hlsl: "float step(float x, float edge) { return x < edge ? 0.0 : 1.0; }",
      wgsl: "fn step(x: f32, edge: f32) -> f32 { return select(1.0, 0.0, x < edge); }",
      python: "def step(x, edge=0.5): return 0 if x < edge else 1",
      css: "step-end",
      cpp: "float step(float x, float edge = 0.5f) { return x < edge ? 0.0f : 1.0f; }",
      lua: "function step(x, edge) edge = edge or 0.5 return x < edge and 0 or 1 end",
      gdscript: "func step(x: float, edge: float = 0.5) -> float: return 0.0 if x < edge else 1.0",
      cuda: "__device__ float step(float x, float edge) { return x < edge ? 0.0f : 1.0f; }",
      c: "double step(double x, double edge) { return x < edge ? 0.0 : 1.0; }",
      json: "{\"name\": \"Step\", \"formula\": \"y = x < edge ? 0 : 1\", \"params\": {\"edge\": 0.5}}",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["smoothstep", "smootherstep", "smoothstep-edge", "pulse"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => stepCurve(p as StepParams),
    },
  };
}
