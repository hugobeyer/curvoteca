import {
  DEFAULT_SAMPLING,
  domainWarpKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { warp: 0.1, freq: 4, seed: 1337 } as const;
export type DomainWarpParams = { warp: number; freq: number; seed: number };

export function domainWarpCurve(
  params: DomainWarpParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = domainWarpKernel(params.warp, params.freq, params.seed);
  return {
    id: "domain-warp",
    name: "Domain Warp",
    aliases: [],
    family: "noise",
    summary: "Domain-warped noise",
    formula: "y = noise(t + noise(t * f) * w)",
    continuity: "C0",
    domain: [0, 1],
    range: [-1, 1],
    tags: ["noise", "domain-warp", "procedural", "organic", "texture"],
    useCases: [
      "procedural-textures",
      "organic-noise",
      "shader-effects",
      "abstract-art",
    ],
    snippets: {
      equation: "y = noise(t + noise(t * f) * w)",
      js: "function domainWarp(x, w, f, seed) { w = w == null ? 0.1 : w; f = f == null ? 4 : f; seed = seed == null ? 1337 : seed; return 0; }",
      ts: "function domainWarp(x: number, w: number = 0.1, f: number = 4, seed: number = 1337): number { return 0; }",
      glsl: "float domainWarp(float x, float w, float f, int seed) { return 0.0; }",
      vex: "float domainWarp(float x; float w; float f; int seed) { return 0; }",
      csharp: "float DomainWarp(float x, float w = 0.1f, float f = 4, int seed = 1337) { return 0; }",
      rust: "fn domain_warp(x: f64, w: f64, f: f64, seed: i32) -> f64 { 0.0 }",
      hlsl: "float domainWarp(float x, float w, float f, int seed) { return 0.0; }",
      wgsl: "fn domain_warp(x: f32, w: f32, f: f32, seed: i32) -> f32 { return 0.0; }",
      python: "def domain_warp(x, w=0.1, f=4, seed=1337): return 0",
      cpp: "float domainWarp(float x, float w = 0.1f, float f = 4.0f, int seed = 1337) { return 0.0f; }",
      lua: "function domainWarp(x, w, f, seed) w = w or 0.1; f = f or 4; seed = seed or 1337; return 0 end",
      gdscript: "func domain_warp(x: float, w: float = 0.1, f: float = 4.0, seed: int = 1337) -> float: return 0.0",
      cuda: "__device__ float domainWarp(float x, float w, float f, int seed) { return 0.0f; }",
      c: "double domainWarp(double x, double w, double f, int seed) { return 0.0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["perlin-noise-1d", "fbm-1d", "turbulence-1d", "value-noise-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => domainWarpCurve(p as DomainWarpParams),
    },
  };
}
