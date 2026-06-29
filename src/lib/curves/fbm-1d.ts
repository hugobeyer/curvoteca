import {
  DEFAULT_SAMPLING,
  fbmKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  octaves: 4,
  lacunarity: 2,
  gain: 0.5,
} as const;
export type Fbm1dParams = {
  seed: number;
  octaves: number;
  lacunarity: number;
  gain: number;
};

export function fbm1dCurve(
  params: Fbm1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = fbmKernel(
    params.seed,
    params.octaves,
    params.lacunarity,
    params.gain,
  );
  return {
    id: "fbm-1d",
    name: "FBM 1D",
    aliases: ["fbm", "fractal brownian motion", "fractal noise", "multi-octave noise"],
    family: "noise",
    summary: "Fractal Brownian motion",
    formula: "y = (1 / A) * sum_{i=0..N-1} gain^i * noise(x * lacunarity^i)",
    continuity: "C1",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "procedural", "fbm", "fractal", "multi-octave"],
    useCases: [
      "terrain-height",
      "procedural-texture",
      "clouds",
      "natural-look",
    ],
    snippets: {
      equation: "y = (1 / A) * sum_i gain^i * noise(x * lacunarity^i)",
      js: "function fbm1d(x, seed, octaves, lacunarity, gain) { /* mulberry32 + summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      ts: "function fbm1d(x: number, seed: number = 1337, octaves: number = 4, lacunarity: number = 2, gain: number = 0.5): number { /* mulberry32 + summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      glsl: "float fbm1d(float x; float seed; float octaves; float lacunarity; float gain) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      vex: "float fbm1d(float x; float seed; float octaves; float lacunarity; float gain) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      csharp: "float Fbm1d(float x, float seed = 1337, float octaves = 4, float lacunarity = 2, float gain = 0.5f) { /* summed value-noise octaves */ return Fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      rust: "fn fbm_1d(x: f64, seed: f64, octaves: f64, lacunarity: f64, gain: f64) -> f64 { /* summed value-noise octaves */ fbm_1d_impl(x, seed, octaves, lacunarity, gain) }",
      hlsl: "float fbm1d(float x, float seed, float octaves, float lacunarity, float gain) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      wgsl: "fn fbm_1d(x: f32, seed: f32, octaves: f32, lacunarity: f32, gain: f32) -> f32 { /* summed value-noise octaves */ return fbm_1d_impl(x, seed, octaves, lacunarity, gain); }",
      python: "def fbm_1d(x, seed=1337, octaves=4, lacunarity=2, gain=0.5): # summed value-noise octaves; return fbm_1d_impl(x, seed, octaves, lacunarity, gain)",
      cpp: "float fbm1d(float x, float seed = 1337.0f, float octaves = 4.0f, float lacunarity = 2.0f, float gain = 0.5f) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      lua: "function fbm1d(x, seed, octaves, lacunarity, gain) seed = seed or 1337; octaves = octaves or 4; lacunarity = lacunarity or 2; gain = gain or 0.5; -- summed value-noise octaves; return fbm1dImpl(x, seed, octaves, lacunarity, gain) end",
      gdscript: "func fbm_1d(x: float, seed: float = 1337.0, octaves: float = 4.0, lacunarity: float = 2.0, gain: float = 0.5) -> float: # summed value-noise octaves; return fbm_1d_impl(x, seed, octaves, lacunarity, gain)",
      cuda: "__device__ float fbm1d(float x, float seed, float octaves, float lacunarity, float gain) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
      c: "double fbm1d(double x, double seed, double octaves, double lacunarity, double gain) { /* summed value-noise octaves */ return fbm1dImpl(x, seed, octaves, lacunarity, gain); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: [
      "turbulence-1d",
      "perlin-noise-1d",
      "value-noise-1d",
      "simplex-noise-1d",
    ],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => fbm1dCurve(p as Fbm1dParams),
    },
  };
}
