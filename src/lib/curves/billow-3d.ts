import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  octaves: 5,
} as const;
export type Billow3dParams = {
  seed: number;
  octaves: number;
};

export function billow3dCurve(
  params: Billow3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "billow-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "billow-3d",
    name: "Billow 3D",
    aliases: ["abs FBM", "puffy noise", "cloud terrain"],
    family: "noise",
    summary: "abs(FBM) puffy cloud-like terrain",
    formula: "b(p) = |fbm(p)|",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "cloud", "billow"],
    useCases: ["cloud-terrain", "puffy-surface", "abs-noise"],
    roleTags: ["noise", "procedural", "renderer3d", "terrain"],
    snippets: {
      equation: "b(p) = |fbm(p)|",
      glsl: "float billow3d(vec3 p, int seed, int octaves) { return abs(fbm(p, octaves) + seed * 0.013); }",
      vex: "float billow3d(vector p; int seed; int octaves) {\n  return abs(fbm(p, octaves) + seed * 0.013);\n}",
      hlsl: "float billow3d(float3 p, int seed, int octaves) { return abs(fbm(p, octaves) + seed * 0.013); }",
      wgsl: "fn billow_3d(p: vec3f, seed: i32, octaves: i32) -> f32 { return abs(fbm(p, octaves) + f32(seed) * 0.013); }",
      ts: "function billow3d(p: Vec3, seed: number, octaves: number): number { return Math.abs(fbm3(p[0], p[1], p[2] + seed * 0.013, octaves)); }",
      python: "def billow_3d(p, seed=1337, octaves=5): return abs(fbm(p, octaves) + seed * 0.013)",
      opencl: "float billow3d(float3 p, int seed, int octaves) { return fabs(fbm(p, octaves) + seed * 0.013f); }",
      metal: "float billow3d(float3 p, int seed, int octaves) { return abs(fbm(p, octaves) + seed * 0.013); }",
      cuda: "__device__ float billow3d(float3 p, int seed, int octaves) { return fabsf(fbm(p, octaves) + seed * 0.013f); }",
      unity: "public static float Billow3d(Vector3 p, int seed = 1337, int octaves = 5) { return Mathf.Abs(Fbm(p, octaves) + seed * 0.013f); }",
      shadertoy: "float billow3d(vec3 p) { return abs(fbm(p, 5)); }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "billow",
      renderMode: "ramp",
      quality: "card",
      params: { seed: 1337, gridSize: 28 },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "ridged-multi-3d", "domain-warp-3d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => billow3dCurve(p as Billow3dParams),
    },
  };
}
