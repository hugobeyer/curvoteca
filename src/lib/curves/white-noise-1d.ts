import {
  DEFAULT_SAMPLING,
  whiteNoiseKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337 } as const;
export type WhiteNoise1dParams = { seed: number };

export function whiteNoise1dCurve(
  params: WhiteNoise1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = whiteNoiseKernel(params.seed);
  return {
    id: "white-noise-1d",
    name: "White Noise 1D",
    aliases: ["white noise", "random noise", "uniform noise", "rng noise"],
    family: "noise",
    summary: "White noise 1D",
    formula: "y = 2 * rng(seed) - 1   (per sample)",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "procedural", "white", "random", "uniform"],
    useCases: ["dithering", "static-texture", "random-jitter", "audio-noise"],
    snippets: {
      equation: "y = 2 * rng(seed) - 1",
      js: "function whiteNoise1d(x, seed) { /* mulberry32; independent per-sample */ return whiteNoise1dImpl(x, seed); }",
      ts: "function whiteNoise1d(x: number, seed: number = 1337): number { /* mulberry32; independent per-sample */ return whiteNoise1dImpl(x, seed); }",
      glsl: "float whiteNoise1d(float x, float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      vex: "float whiteNoise1d(float x; float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      csharp:
        "float WhiteNoise1d(float x, float seed = 1337) { /* hash(x, seed) * 2 - 1 */ return WhiteNoise1dImpl(x, seed); }",
      rust: "fn white_noise_1d(x: f64, seed: f64) -> f64 { /* hash(x, seed) * 2 - 1 */ white_noise_1d_impl(x, seed) }",
      hlsl: "float whiteNoise1d(float x, float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      wgsl: "fn white_noise_1d(x: f32, seed: f32) -> f32 { /* hash(x, seed) * 2 - 1 */ return white_noise_1d_impl(x, seed); }",
      python:
        "def white_noise_1d(x, seed=1337): # hash(x, seed) * 2 - 1; return white_noise_1d_impl(x, seed)",
      cpp: "float whiteNoise1d(float x, float seed = 1337.0f) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      lua: "function whiteNoise1d(x, seed) seed = seed or 1337 -- hash(x, seed) * 2 - 1; return whiteNoise1dImpl(x, seed) end",
      gdscript:
        "func whiteNoise1d(x: float, seed: float = 1337.0) -> float: # hash(x, seed) * 2 - 1; return whiteNoise1dImpl(x, seed)",
      cuda: "__device__ float whiteNoise1d(float x, float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      c: "double whiteNoise1d(double x, double seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      metal:
        "float whiteNoise1d(float x, float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      opencl:
        "float whiteNoise1d(float x, float seed) { /* hash(x, seed) * 2 - 1 */ return whiteNoise1dImpl(x, seed); }",
      unity:
        "public static float WhiteNoise1d(float x, float seed = 1337) { return WhiteNoise1dImpl(x, seed); }",
      shadertoy: "return whiteNoise1dImpl(x, seed);",
      matlab: "y = @(x, seed) whiteNoise1dImpl(x, seed);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["value-noise-1d", "worley-noise-1d", "fbm-1d", "turbulence-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => whiteNoise1dCurve(p as WhiteNoise1dParams),
    },
  };
}
