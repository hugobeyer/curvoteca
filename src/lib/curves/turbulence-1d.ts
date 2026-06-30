import {
  DEFAULT_SAMPLING,
  turbulenceKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, octaves: 4 } as const;
export type Turbulence1dParams = { seed: number; octaves: number };

export function turbulence1dCurve(
  params: Turbulence1dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = turbulenceKernel(params.seed, params.octaves);
  return {
    id: "turbulence-1d",
    name: "Turbulence 1D",
    aliases: ["turbulence", "ridge noise", "billow noise", "abs-fbm"],
    family: "noise",
    summary: "Ridge/turbulence noise",
    formula: "y = sum_i (1 / 2^i) * |noise(x * 2^i)|",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "procedural", "turbulence", "ridge"],
    useCases: [
      "flame-rendering",
      "terrain-ridges",
      "marble-texture",
      "natural-look",
    ],
    snippets: {
      equation: "y = sum_i (1 / 2^i) * abs(noise(x * 2^i))",
      js: "function turbulence1d(x, seed, octaves) { /* mulberry32 + abs(value-noise) sum */ return turbulence1dImpl(x, seed, octaves); }",
      ts: "function turbulence1d(x: number, seed: number = 1337, octaves: number = 4): number { /* mulberry32 + abs(value-noise) sum */ return turbulence1dImpl(x, seed, octaves); }",
      glsl: "float turbulence1d(float x; float seed; float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      vex: "float turbulence1d(float x; float seed; float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      csharp:
        "float Turbulence1d(float x, float seed = 1337, float octaves = 4) { /* abs(value-noise) summed */ return Turbulence1dImpl(x, seed, octaves); }",
      rust: "fn turbulence_1d(x: f64, seed: f64, octaves: f64) -> f64 { /* abs(value-noise) summed */ turbulence_1d_impl(x, seed, octaves) }",
      hlsl: "float turbulence1d(float x, float seed, float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      wgsl: "fn turbulence_1d(x: f32, seed: f32, octaves: f32) -> f32 { /* abs(value-noise) summed */ return turbulence_1d_impl(x, seed, octaves); }",
      python:
        "def turbulence_1d(x, seed=1337, octaves=4): # abs(value-noise) summed; return turbulence_1d_impl(x, seed, octaves)",
      cpp: "float turbulence1d(float x, float seed = 1337.0f, float octaves = 4.0f) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      lua: "function turbulence1d(x, seed, octaves) seed = seed or 1337 octaves = octaves or 4 -- abs(value-noise) summed; return turbulence1dImpl(x, seed, octaves) end",
      gdscript:
        "func turbulence1d(x: float, seed: float = 1337.0, octaves: float = 4.0) -> float: # abs(value-noise) summed; return turbulence1dImpl(x, seed, octaves)",
      cuda: "__device__ float turbulence1d(float x, float seed, float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      c: "double turbulence1d(double x, double seed, double octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      metal:
        "float turbulence1d(float x, float seed, float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      opencl:
        "float turbulence1d(float x, float seed, float octaves) { /* abs(value-noise) summed */ return turbulence1dImpl(x, seed, octaves); }",
      unity:
        "public static float Turbulence1d(float x, float seed = 1337, float octaves = 4) { return Turbulence1dImpl(x, seed, octaves); }",
      shadertoy: "return turbulence1dImpl(x, seed, octaves);",
      matlab: "y = @(x, seed, octaves) turbulence1dImpl(x, seed, octaves);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-1d", "perlin-noise-1d", "value-noise-1d", "worley-noise-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => turbulence1dCurve(p as Turbulence1dParams),
    },
  };
}
