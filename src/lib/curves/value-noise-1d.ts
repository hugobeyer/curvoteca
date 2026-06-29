import {
  DEFAULT_SAMPLING,
  valueNoiseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, scale: 4 } as const;
export type ValueNoise1dParams = { seed: number; scale: number };

export function valueNoise1dCurve(
  params: ValueNoise1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = valueNoiseKernel(params.seed, params.scale);
  return {
    id: "value-noise-1d",
    name: "Value Noise 1D",
    aliases: ["value noise", "lattice noise"],
    family: "noise",
    summary: "1D value noise",
    formula: "y = lerp(rand(floor(x)), rand(ceil(x)), fade(frac(x)))",
    continuity: "C1",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "procedural", "value-noise", "random"],
    useCases: [
      "terrain-height",
      "procedural-texture",
      "jitter",
      "organic-variation",
    ],
    snippets: {
      equation: "y = lerp(rand(floor(x)), rand(ceil(x)), smoothstep(0,1,frac(x)))",
      js: "function valueNoise1d(x, seed) { /* mulberry32 + smoothstep interpolation */ return valueNoise1dImpl(x, seed); }",
      ts: "function valueNoise1d(x: number, seed: number = 1337): number { /* mulberry32 + smoothstep interpolation */ return valueNoise1dImpl(x, seed); }",
      glsl: "float valueNoise1d(float x, float seed) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
      vex: "float valueNoise1d(float x; float seed) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
      csharp: "float ValueNoise1d(float x, float seed = 1337) { /* hash + smoothstep */ return ValueNoise1dImpl(x, seed); }",
      rust: "fn value_noise_1d(x: f64, seed: f64) -> f64 { /* hash + smoothstep */ value_noise_1d_impl(x, seed) }",
      hlsl: "float valueNoise1d(float x, float seed) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
      wgsl: "fn value_noise_1d(x: f32, seed: f32) -> f32 { /* hash + smoothstep */ return value_noise_1d_impl(x, seed); }",
      python: "def value_noise_1d(x, seed=1337): # hash + smoothstep interpolation; return value_noise_1d_impl(x, seed)",
      cpp: "float valueNoise1d(float x, float seed = 1337.0f) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
      lua: "function valueNoise1d(x, seed) seed = seed or 1337 -- hash + smoothstep; return valueNoise1dImpl(x, seed) end",
      gdscript: "func valueNoise1d(x: float, seed: float = 1337.0) -> float: # hash + smoothstep; return valueNoise1dImpl(x, seed)",
      cuda: "__device__ float valueNoise1d(float x, float seed) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
      c: "double valueNoise1d(double x, double seed) { /* hash + smoothstep */ return valueNoise1dImpl(x, seed); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["perlin-noise-1d", "simplex-noise-1d", "fbm-1d", "white-noise-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => valueNoise1dCurve(p as ValueNoise1dParams),
    },
  };
}
