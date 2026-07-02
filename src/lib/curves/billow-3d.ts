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
      glsl: "float billow3d(vec3 p, int octaves) { return abs(fbm(p)); }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float billow3d(vector p; int octaves) { return abs(fbm(p)); }\n\nfloat fbm(vector p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      hlsl: "float billow3d(float3 p, int octaves) { return abs(fbm(p)); }\n\nfloat fbm(float3 p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      wgsl: "fn billow_3d(p: vec3f, octaves: i32) -> f32 { return abs(fbm(p)); }\n\nfn fbm(p: vec3f) -> f32 { var v = 0.0; var a = 0.5; var f = 1.0; for (var i = 0u; i < 5u; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      ts: "function billow3d(p: Vec3, octaves: number = 5): number { return Math.abs(fbm3(p[0], p[1], p[2], octaves)); }",
      python: "def billow_3d(p, octaves=5): return abs(fbm(p))",
      opencl: "float billow3d(float3 p, int octaves) { return fabs(fbm(p)); }\n\nfloat fbm(float3 p) { float v = 0, a = 0.5f, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5f; f *= 2; } return v; }",
      metal: "float billow3d(float3 p, int octaves) { return abs(fbm(p)); }",
      cuda: "__device__ float billow3d(float3 p, int octaves) { return fabsf(fbm(p)); }",
      unity: "public static float Billow3d(Vector3 p, int octaves = 5) { return Mathf.Abs(Fbm(p)); }",
      shadertoy: "float billow3d(vec3 p) { return abs(fbm(p)); }",
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
