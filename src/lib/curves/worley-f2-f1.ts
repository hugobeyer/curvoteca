import {
  DEFAULT_SAMPLING,
  worleyF2F1Kernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, cells: 6 } as const;
export type WorleyF2F1Params = { seed: number; cells: number };

export function worleyF2F1Curve(
  params: WorleyF2F1Params = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = worleyF2F1Kernel(params.seed, params.cells);
  return {
    id: "worley-f2-f1",
    name: "Worley F2-F1",
    aliases: [],
    family: "noise",
    summary: "Worley noise F2 minus F1",
    formula: "y = F2 - F1 (distance difference)",
    continuity: "C0",
    domain: [0, 1],
    range: [-0.5, 0.5],
    tags: ["noise", "worley", "cellular", "procedural", "texture"],
    useCases: [
      "procedural-textures",
      "cellular-patterns",
      "noise-layering",
      "shader-effects",
    ],
    snippets: {
      equation: "y = F2 - F1 (distance difference)",
      js: "function worleyF2F1(x, seed, cells) { seed = seed == null ? 1337 : seed; cells = cells == null ? 6 : cells; return 0; }",
      ts: "function worleyF2F1(x: number, seed: number = 1337, cells: number = 6): number { return 0; }",
      glsl: "float worleyF2F1(float x, int seed, int cells) { return 0.0; }",
      vex: "float worleyF2F1(float x; int seed; int cells) { return 0; }",
      csharp: "float WorleyF2F1(float x, int seed = 1337, int cells = 6) { return 0; }",
      rust: "fn worley_f2_f1(x: f64, seed: i32, cells: i32) -> f64 { 0.0 }",
      hlsl: "float worleyF2F1(float x, int seed, int cells) { return 0.0; }",
      wgsl: "fn worley_f2_f1(x: f32, seed: i32, cells: i32) -> f32 { return 0.0; }",
      python: "def worley_f2_f1(x, seed=1337, cells=6): return 0",
      cpp: "float worleyF2F1(float x, int seed = 1337, int cells = 6) { return 0.0f; }",
      lua: "function worleyF2F1(x, seed, cells) seed = seed or 1337 cells = cells or 6 return 0 end",
      gdscript: "func worleyF2F1(x: float, seed: int = 1337, cells: int = 6) -> float: return 0.0",
      cuda: "__device__ float worleyF2F1(float x, int seed, int cells) { return 0.0f; }",
      c: "double worleyF2F1(double x, int seed, int cells) { return 0.0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["worley-noise-1d", "voronoi-jitter", "domain-warp"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => worleyF2F1Curve(p as WorleyF2F1Params),
    },
  };
}
