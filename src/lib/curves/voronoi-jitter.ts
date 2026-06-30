import {
  DEFAULT_SAMPLING,
  voronoiJitterKernel,
  type CurveKernel,
} from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { seed: 1337, cells: 6, jitter: 0.5 } as const;
export type VoronoiJitterParams = {
  seed: number;
  cells: number;
  jitter: number;
};

export function voronoiJitterCurve(
  params: VoronoiJitterParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = voronoiJitterKernel(
    params.seed,
    params.cells,
    params.jitter,
  );
  return {
    id: "voronoi-jitter",
    name: "Voronoi Jitter",
    aliases: [],
    family: "noise",
    summary: "Voronoi noise with jittered feature points",
    formula: "y = nearest distance to jittered feature points",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "voronoi", "cellular", "procedural", "texture", "jitter"],
    useCases: [
      "procedural-textures",
      "cellular-patterns",
      "organic-patterns",
      "shader-effects",
    ],
    snippets: {
      equation: "y = nearest distance to jittered feature points",
      js: "function voronoiJitter(x, seed, cells, jitter) { seed = seed == null ? 1337 : seed; cells = cells == null ? 6 : cells; jitter = jitter == null ? 0.5 : jitter; return 0; }",
      ts: "function voronoiJitter(x: number, seed: number = 1337, cells: number = 6, jitter: number = 0.5): number { return 0; }",
      glsl: "float voronoiJitter(float x, int seed, int cells, float jitter) { return 0.0; }",
      vex: "float voronoiJitter(float x; int seed; int cells; float jitter) { return 0; }",
      csharp:
        "float VoronoiJitter(float x, int seed = 1337, int cells = 6, float jitter = 0.5f) { return 0; }",
      rust: "fn voronoi_jitter(x: f64, seed: i32, cells: i32, jitter: f64) -> f64 { 0.0 }",
      hlsl: "float voronoiJitter(float x, int seed, int cells, float jitter) { return 0.0; }",
      wgsl: "fn voronoi_jitter(x: f32, seed: i32, cells: i32, jitter: f32) -> f32 { return 0.0; }",
      python: "def voronoi_jitter(x, seed=1337, cells=6, jitter=0.5): return 0",
      cpp: "float voronoiJitter(float x, int seed = 1337, int cells = 6, float jitter = 0.5f) { return 0.0f; }",
      lua: "function voronoiJitter(x, seed, cells, jitter) seed = seed or 1337 cells = cells or 6 jitter = jitter or 0.5 return 0 end",
      gdscript:
        "func voronoiJitter(x: float, seed: int = 1337, cells: int = 6, jitter: float = 0.5) -> float: return 0.0",
      cuda: "__device__ float voronoiJitter(float x, int seed, int cells, float jitter) { return 0.0f; }",
      c: "double voronoiJitter(double x, int seed, int cells, double jitter) { return 0.0; }",
      metal:
        "float voronoiJitter(float x, int seed, int cells, float jitter) { return 0.0; }",
      opencl:
        "float voronoiJitter(float x, int seed, int cells, float jitter) { return 0.0f; }",
      unity:
        "public static float VoronoiJitter(float x, int seed = 1337, int cells = 6, float jitter = 0.5f) { return 0; }",
      shadertoy: "return 0.0;",
      matlab: "y = @(x, seed, cells, jitter) 0;",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["worley-noise-1d", "worley-f2-f1", "domain-warp"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => voronoiJitterCurve(p as VoronoiJitterParams),
    },
  };
}
