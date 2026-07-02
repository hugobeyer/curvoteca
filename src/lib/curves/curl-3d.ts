import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  octaves: 5,
} as const;
export type Curl3dParams = {
  seed: number;
  octaves: number;
};

export function curl3dCurve(
  params: Curl3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "curl-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "curl-3d",
    name: "Curl 3D",
    aliases: ["curl noise", "swirl field", "vector curl terrain"],
    family: "noise",
    summary: "Cross-product of gradient fields for swirling ridges",
    formula: "c(p) = (∇f₁ × ∇f₂)_y",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "curl", "swirl", "vector"],
    useCases: ["swirl-terrain", "curl-field", "vortex-surface"],
    roleTags: ["noise", "procedural", "renderer3d", "terrain", "field"],
    snippets: {
      equation: "c(p) = (∇f₁ × ∇f₂)_y  (divergence-free curl from cross product of gradient fields)",
      glsl: "float curl3d(vec3 p, int seed, int octaves) { float eps = 0.01; vec3 o = vec3(13.7, 7.3, 5.1) + float(seed) * 0.1 * vec3(1, 1, 1); float f1 = fbm(p, octaves); float f2 = fbm(p + o, octaves); float f1x = (fbm(p + vec3(eps,0,0), octaves) - f1) / eps; float f1z = (fbm(p + vec3(0,0,eps), octaves) - f1) / eps; float f2x = (fbm(p + o + vec3(eps,0,0), octaves) - f2) / eps; float f2z = (fbm(p + o + vec3(0,0,eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      vex: "float curl3d(vector p; int seed; int octaves) {\n  float eps = 0.01;\n  vector o = {13.7, 7.3, 5.1} + seed * 0.1;\n  float f1 = fbm(p, octaves);\n  float f2 = fbm(p + o, octaves);\n  float f1x = (fbm(p + {eps,0,0}, octaves) - f1) / eps;\n  float f1z = (fbm(p + {0,0,eps}, octaves) - f1) / eps;\n  float f2x = (fbm(p + o + {eps,0,0}, octaves) - f2) / eps;\n  float f2z = (fbm(p + o + {0,0,eps}, octaves) - f2) / eps;\n  return (f1x * f2z - f1z * f2x) * 0.2;\n}",
      hlsl: "float curl3d(float3 p, int seed, int octaves) { float eps = 0.01; float3 o = float3(13.7, 7.3, 5.1) + seed * 0.1; float f1 = fbm(p, octaves); float f2 = fbm(p + o, octaves); float f1x = (fbm(p + float3(eps,0,0), octaves) - f1) / eps; float f1z = (fbm(p + float3(0,0,eps), octaves) - f1) / eps; float f2x = (fbm(p + o + float3(eps,0,0), octaves) - f2) / eps; float f2z = (fbm(p + o + float3(0,0,eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      wgsl: "fn curl_3d(p: vec3f, seed: i32, octaves: i32) -> f32 { let eps = 0.01; let o = vec3f(13.7, 7.3, 5.1) + f32(seed) * 0.1; let f1 = fbm(p, octaves); let f2 = fbm(p + o, octaves); let f1x = (fbm(p + vec3f(eps,0,0), octaves) - f1) / eps; let f1z = (fbm(p + vec3f(0,0,eps), octaves) - f1) / eps; let f2x = (fbm(p + o + vec3f(eps,0,0), octaves) - f2) / eps; let f2z = (fbm(p + o + vec3f(0,0,eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      ts: "function curl3d(p: Vec3, seed: number, octaves: number): number { const eps = 0.01; const o: Vec3 = [13.7 + seed * 0.1, 7.3, 5.1]; const f1 = fbm3(p[0], p[1], p[2], octaves); const f2 = fbm3(p[0]+o[0], p[1]+o[1], p[2]+o[2], octaves); const f1x = (fbm3(p[0]+eps, p[1], p[2], octaves) - f1) / eps; const f1z = (fbm3(p[0], p[1], p[2]+eps, octaves) - f1) / eps; const f2x = (fbm3(p[0]+o[0]+eps, p[1]+o[1], p[2]+o[2], octaves) - f2) / eps; const f2z = (fbm3(p[0]+o[0], p[1]+o[1], p[2]+o[2]+eps, octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      python: "def curl_3d(p, seed=1337, octaves=5): eps = 0.01; o = (13.7 + seed*0.1, 7.3, 5.1); f1 = fbm(p, octaves); f2 = fbm((p[0]+o[0], p[1]+o[1], p[2]+o[2]), octaves); f1x = (fbm((p[0]+eps, p[1], p[2]), octaves) - f1)/eps; f1z = (fbm((p[0], p[1], p[2]+eps), octaves) - f1)/eps; f2x = (fbm((p[0]+o[0]+eps, p[1]+o[1], p[2]+o[2]), octaves) - f2)/eps; f2z = (fbm((p[0]+o[0], p[1]+o[1], p[2]+o[2]+eps), octaves) - f2)/eps; return (f1x*f2z - f1z*f2x)*0.2",
      opencl: "float curl3d(float3 p, int seed, int octaves) { float eps = 0.01f; float3 o = (float3)(13.7f + seed*0.1f, 7.3f, 5.1f); float f1 = fbm(p, octaves); float f2 = fbm((float3)(p.x+o.x, p.y+o.y, p.z+o.z), octaves); float f1x = (fbm((float3)(p.x+eps, p.y, p.z), octaves) - f1) / eps; float f1z = (fbm((float3)(p.x, p.y, p.z+eps), octaves) - f1) / eps; float f2x = (fbm((float3)(p.x+o.x+eps, p.y+o.y, p.z+o.z), octaves) - f2) / eps; float f2z = (fbm((float3)(p.x+o.x, p.y+o.y, p.z+o.z+eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      metal: "float curl3d(float3 p, int seed, int octaves) { float eps = 0.01; float3 o = float3(13.7, 7.3, 5.1) + seed * 0.1; float f1 = fbm(p, octaves); float f2 = fbm(p + o, octaves); float f1x = (fbm(p + float3(eps,0,0), octaves) - f1) / eps; float f1z = (fbm(p + float3(0,0,eps), octaves) - f1) / eps; float f2x = (fbm(p + o + float3(eps,0,0), octaves) - f2) / eps; float f2z = (fbm(p + o + float3(0,0,eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      cuda: "__device__ float curl3d(float3 p, int seed, int octaves) { float eps = 0.01f; float3 o = make_float3(13.7f + seed*0.1f, 7.3f, 5.1f); float f1 = fbm(p, octaves); float f2 = fbm(make_float3(p.x+o.x, p.y+o.y, p.z+o.z), octaves); float f1x = (fbm(make_float3(p.x+eps, p.y, p.z), octaves) - f1) / eps; float f1z = (fbm(make_float3(p.x, p.y, p.z+eps), octaves) - f1) / eps; float f2x = (fbm(make_float3(p.x+o.x+eps, p.y+o.y, p.z+o.z), octaves) - f2) / eps; float f2z = (fbm(make_float3(p.x+o.x, p.y+o.y, p.z+o.z+eps), octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      unity: "public static float Curl3d(Vector3 p, int seed = 1337, int octaves = 5) { float eps = 0.01f; Vector3 o = new Vector3(13.7f + seed*0.1f, 7.3f, 5.1f); float f1 = Fbm(p, octaves); float f2 = Fbm(p + o, octaves); float f1x = (Fbm(p + Vector3.right*eps, octaves) - f1) / eps; float f1z = (Fbm(p + Vector3.forward*eps, octaves) - f1) / eps; float f2x = (Fbm(p + o + Vector3.right*eps, octaves) - f2) / eps; float f2z = (Fbm(p + o + Vector3.forward*eps, octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      shadertoy: "float curl3d(vec3 p) { float eps = 0.01; vec3 o = vec3(13.7,7.3,5.1); float f1 = fbm(p, 5); float f2 = fbm(p+o, 5); float f1x = (fbm(p+vec3(eps,0,0),5)-f1)/eps; float f1z = (fbm(p+vec3(0,0,eps),5)-f1)/eps; float f2x = (fbm(p+o+vec3(eps,0,0),5)-f2)/eps; float f2z = (fbm(p+o+vec3(0,0,eps),5)-f2)/eps; return (f1x*f2z-f1z*f2x)*0.2; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "curl-noise",
      renderMode: "graph",
      quality: "card",
      params: { seed: 1337, gridSize: 28 },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "billow-3d", "domain-warp-3d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => curl3dCurve(p as Curl3dParams),
    },
  };
}
