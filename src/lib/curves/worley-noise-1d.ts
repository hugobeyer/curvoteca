import {
  DEFAULT_SAMPLING,
  worleyNoiseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, cells: 6 } as const;
export type WorleyNoise1dParams = { seed: number; cells: number };

export function worleyNoise1dCurve(
  params: WorleyNoise1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = worleyNoiseKernel(params.seed, params.cells);
  return {
    id: "worley-noise-1d",
    name: "Worley Noise 1D",
    aliases: ["worley noise", "cellular noise", "voronoi noise", "cell noise"],
    family: "noise",
    summary: "Cellular noise 1D",
    formula: "y = cells * min_i wrap(|x - p_i|)",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "procedural", "worley", "cellular", "voronoi"],
    useCases: [
      "stone-texture",
      "cracked-surface",
      "cell-pattern",
      "organic-cells",
    ],
    snippets: {
      equation: "y = cells * min_i min(|x - p_i|, 1 - |x - p_i|)",
      js: "function worleyNoise1d(x, seed, cells) { /* mulberry32 + nearest feature point */ return worley1dImpl(x, seed, cells); }",
      ts: "function worleyNoise1d(x: number, seed: number = 1337, cells: number = 6): number { /* mulberry32 + nearest feature point */ return worley1dImpl(x, seed, cells); }",
      glsl: "float worleyNoise1d(float x; float seed; float cells) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
      vex: "float worleyNoise1d(float x; float seed; float cells) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
      csharp: "float WorleyNoise1d(float x, float seed = 1337, float cells = 6) { /* nearest feature point */ return Worley1dImpl(x, seed, cells); }",
      rust: "fn worley_noise_1d(x: f64, seed: f64, cells: f64) -> f64 { /* nearest feature point */ worley_1d_impl(x, seed, cells) }",
      hlsl: "float worleyNoise1d(float x, float seed, float cells) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
      wgsl: "fn worley_noise_1d(x: f32, seed: f32, cells: f32) -> f32 { /* nearest feature point */ return worley_1d_impl(x, seed, cells); }",
      python: "def worley_noise_1d(x, seed=1337, cells=6): # nearest feature point; return worley_1d_impl(x, seed, cells)",
      cpp: "float worleyNoise1d(float x, float seed = 1337.0f, float cells = 6.0f) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
      lua: "function worleyNoise1d(x, seed, cells) seed = seed or 1337 cells = cells or 6 -- nearest feature point; return worley1dImpl(x, seed, cells) end",
      gdscript: "func worleyNoise1d(x: float, seed: float = 1337.0, cells: float = 6.0) -> float: # nearest feature point; return worley1dImpl(x, seed, cells)",
      cuda: "__device__ float worleyNoise1d(float x, float seed, float cells) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
      c: "double worleyNoise1d(double x, double seed, double cells) { /* nearest feature point */ return worley1dImpl(x, seed, cells); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-1d", "value-noise-1d", "perlin-noise-1d", "simplex-noise-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => worleyNoise1dCurve(p as WorleyNoise1dParams),
    },
  };
}
