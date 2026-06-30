import {
  DEFAULT_SAMPLING,
  perlinNoiseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, scale: 4 } as const;
export type PerlinNoise1dParams = { seed: number; scale: number };

export function perlinNoise1dCurve(
  params: PerlinNoise1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = perlinNoiseKernel(params.seed, params.scale);
  return {
    id: "perlin-noise-1d",
    name: "Perlin Noise 1D",
    aliases: ["perlin noise", "gradient noise", "Perlin", "classic noise"],
    family: "noise",
    summary: "1D Perlin noise",
    formula:
      "y = fade(frac(x)) * grad(ceil(x)) + (1 - fade(frac(x))) * grad(floor(x))",
    continuity: "C1",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "procedural", "perlin", "gradient"],
    useCases: [
      "terrain-height",
      "procedural-texture",
      "organic-variation",
      "animation-jitter",
    ],
    snippets: {
      equation: "y = lerp(grad(floor(x)), grad(ceil(x)), fade(frac(x)))",
      js: "function perlinNoise1d(x, seed) { /* mulberry32 + perlin gradient table */ return perlin1dImpl(x, seed); }",
      ts: "function perlinNoise1d(x: number, seed: number = 1337): number { /* mulberry32 + perlin gradient table */ return perlin1dImpl(x, seed); }",
      glsl: "float perlinNoise1d(float x, float seed) { /* hash + gradient + fade */ return perlin1dImpl(x, seed); }",
      vex: "float perlinNoise1d(float x; float seed) { /* hash + gradient + fade */ return perlin1dImpl(x, seed); }",
      csharp:
        "float PerlinNoise1d(float x, float seed = 1337) { /* hash + gradient + fade */ return Perlin1dImpl(x, seed); }",
      rust: "fn perlin_noise_1d(x: f64, seed: f64) -> f64 { /* hash + gradient + fade */ perlin_1d_impl(x, seed) }",
      hlsl: "float perlinNoise1d(float x, float seed) { /* hash + gradient + fade */ return perlin1dImpl(x, seed); }",
      wgsl: "fn perlin_noise_1d(x: f32, seed: f32) -> f32 { /* hash + gradient + fade */ return perlin_1d_impl(x, seed); }",
      python:
        "def perlin_noise_1d(x, seed=1337): # hash + gradient + fade; return perlin_1d_impl(x, seed)",
      cpp: "float perlinNoise1d(float x, float seed = 1337.0f, float scale = 4.0f) { /* mulberry32 + perlin gradient table */ return perlin1dImpl(x, seed, scale); }",
      lua: "function perlinNoise1d(x, seed, scale) seed = seed or 1337; scale = scale or 4; -- hash + gradient + fade; return perlin_1d_impl(x, seed, scale) end",
      gdscript:
        "func perlinNoise1d(x: float, seed: float = 1337.0, scale: float = 4.0) -> float: # hash + gradient + fade; return perlin_1d_impl(x, seed, scale)",
      cuda: "__device__ float perlinNoise1d(float x, float seed, float scale) { /* hash + gradient + fade */ return perlin1dImpl(x, seed, scale); }",
      c: "#include <math.h>\ndouble perlinNoise1d(double x, double seed, double scale) { /* hash + gradient + fade */ return perlin1dImpl(x, seed, scale); }",
      metal:
        "float perlinNoise1d(float x, float seed, float scale) { /* hash + gradient + fade */ return perlin1dImpl(x, seed, scale); }",
      opencl:
        "float perlinNoise1d(float x, float seed, float scale) { /* hash + gradient + fade */ return perlin1dImpl(x, seed, scale); }",
      unity:
        "public static float PerlinNoise1d(float x, float seed, float scale) { /* hash + gradient + fade */ return Perlin1dImpl(x, seed, scale); }",
      shadertoy: "return perlin1dImpl(x, seed);",
      matlab: "y = @(x, seed) perlin_1d_impl(x, seed);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["value-noise-1d", "simplex-noise-1d", "fbm-1d", "smoothstep"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => perlinNoise1dCurve(p as PerlinNoise1dParams),
    },
  };
}
