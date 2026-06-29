import {
  DEFAULT_SAMPLING,
  simplexNoiseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, scale: 4 } as const;
export type SimplexNoise1dParams = { seed: number; scale: number };

export function simplexNoise1dCurve(
  params: SimplexNoise1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = simplexNoiseKernel(params.seed, params.scale);
  return {
    id: "simplex-noise-1d",
    name: "Simplex Noise 1D",
    aliases: ["simplex noise", "simplex", "lattice-free noise"],
    family: "noise",
    summary: "1D simplex noise",
    formula: "y = contribution(i) + contribution(i+1) over skewed lattice",
    continuity: "C1",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "procedural", "simplex", "gradient"],
    useCases: [
      "terrain-height",
      "procedural-texture",
      "organic-variation",
      "shader-noise",
    ],
    snippets: {
      equation: "y = sum_k (kernel(f_k) * grad(hash_k)) over simplex cells",
      js: "function simplexNoise1d(x, seed) { /* mulberry32 + skewed 1D simplex */ return simplex1dImpl(x, seed); }",
      ts: "function simplexNoise1d(x: number, seed: number = 1337): number { /* mulberry32 + skewed 1D simplex */ return simplex1dImpl(x, seed); }",
      glsl: "float simplexNoise1d(float x, float seed) { /* skew + kernel + grad */ return simplex1dImpl(x, seed); }",
      vex: "float simplexNoise1d(float x; float seed) { /* skew + kernel + grad */ return simplex1dImpl(x, seed); }",
      csharp: "float SimplexNoise1d(float x, float seed = 1337) { /* skew + kernel + grad */ return Simplex1dImpl(x, seed); }",
      rust: "fn simplex_noise_1d(x: f64, seed: f64) -> f64 { /* skew + kernel + grad */ simplex_1d_impl(x, seed) }",
      hlsl: "float simplexNoise1d(float x, float seed) { /* skew + kernel + grad */ return simplex1dImpl(x, seed); }",
      wgsl: "fn simplex_noise_1d(x: f32, seed: f32) -> f32 { /* skew + kernel + grad */ return simplex_1d_impl(x, seed); }",
      python: "def simplex_noise_1d(x, seed=1337): # skew + kernel + grad; return simplex_1d_impl(x, seed)",
      cpp: "float simplexNoise1d(float x, float seed = 1337.0f) { /* mulberry32 + skewed 1D simplex */ return simplex1dImpl(x, seed); }",
      lua: "function simplexNoise1d(x, seed) seed = seed or 1337; --[[mulberry32 + skewed 1D simplex]] return simplex1dImpl(x, seed) end",
      gdscript: "func simplexNoise1d(x: float, seed: float = 1337.0) -> float: # mulberry32 + skewed 1D simplex; return simplex1dImpl(x, seed)",
      cuda: "__device__ float simplexNoise1d(float x, float seed) { /* mulberry32 + skewed 1D simplex */ return simplex1dImpl(x, seed); }",
      c: "double simplexNoise1d(double x, double seed) { /* mulberry32 + skewed 1D simplex */ return simplex1dImpl(x, seed); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: [
      "perlin-noise-1d",
      "value-noise-1d",
      "fbm-1d",
      "worley-noise-1d",
    ],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => simplexNoise1dCurve(p as SimplexNoise1dParams),
    },
  };
}
