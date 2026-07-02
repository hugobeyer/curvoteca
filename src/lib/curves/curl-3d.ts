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
      glsl: "float curl3d(vec3 p, int octaves) { const float eps = 0.01; float f1 = fbm(p); float f2 = fbm(p + vec3(13.7, 7.3, 5.1)); float f1x = (fbm(p + vec3(eps,0,0)) - f1) / eps; float f1z = (fbm(p + vec3(0,0,eps)) - f1) / eps; float f2x = (fbm(p + vec3(13.7+eps,7.3,5.1)) - f2) / eps; float f2z = (fbm(p + vec3(13.7,7.3,5.1+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float curl3d(vector p; int octaves) { float eps = 0.01; float f1 = fbm(p); float f2 = fbm(p + {13.7, 7.3, 5.1}); float f1x = (fbm(p + {eps,0,0}) - f1) / eps; float f1z = (fbm(p + {0,0,eps}) - f1) / eps; float f2x = (fbm(p + {13.7+eps,7.3,5.1}) - f2) / eps; float f2z = (fbm(p + {13.7,7.3,5.1+eps}) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }\n\nfloat fbm(vector p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      hlsl: "float curl3d(float3 p, int octaves) { const float eps = 0.01; float f1 = fbm(p); float f2 = fbm(p + float3(13.7, 7.3, 5.1)); float f1x = (fbm(p + float3(eps,0,0)) - f1) / eps; float f1z = (fbm(p + float3(0,0,eps)) - f1) / eps; float f2x = (fbm(p + float3(13.7+eps,7.3,5.1)) - f2) / eps; float f2z = (fbm(p + float3(13.7,7.3,5.1+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      wgsl: "fn curl_3d(p: vec3f, octaves: i32) -> f32 { let eps = 0.01; let f1 = fbm(p); let f2 = fbm(p + vec3f(13.7, 7.3, 5.1)); let f1x = (fbm(p + vec3f(eps,0,0)) - f1) / eps; let f1z = (fbm(p + vec3f(0,0,eps)) - f1) / eps; let f2x = (fbm(p + vec3f(13.7+eps,7.3,5.1)) - f2) / eps; let f2z = (fbm(p + vec3f(13.7,7.3,5.1+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }\n\nfn fbm(p: vec3f) -> f32 { var v = 0.0; var a = 0.5; var f = 1.0; for (var i = 0u; i < 5u; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      ts: "function curl3d(p: Vec3, octaves: number = 5): number { const eps = 0.01; const f1 = fbm3(p[0], p[1], p[2], octaves); const f2 = fbm3(p[0]+13.7, p[1]+7.3, p[2]+5.1, octaves); const f1x = (fbm3(p[0]+eps, p[1], p[2], octaves) - f1) / eps; const f1z = (fbm3(p[0], p[1], p[2]+eps, octaves) - f1) / eps; const f2x = (fbm3(p[0]+13.7+eps, p[1]+7.3, p[2]+5.1, octaves) - f2) / eps; const f2z = (fbm3(p[0]+13.7, p[1]+7.3, p[2]+5.1+eps, octaves) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      python: "def curl_3d(p, octaves=5): eps = 0.01; f1 = fbm(p); f2 = fbm((p[0]+13.7, p[1]+7.3, p[2]+5.1)); f1x = (fbm((p[0]+eps, p[1], p[2])) - f1)/eps; f1z = (fbm((p[0], p[1], p[2]+eps)) - f1)/eps; f2x = (fbm((p[0]+13.7+eps, p[1]+7.3, p[2]+5.1)) - f2)/eps; f2z = (fbm((p[0]+13.7, p[1]+7.3, p[2]+5.1+eps)) - f2)/eps; return (f1x*f2z - f1z*f2x)*0.2",
      opencl: "float curl3d(float3 p, int octaves) { const float eps = 0.01f; float f1 = fbm(p); float f2 = fbm((float3)(p.x+13.7f, p.y+7.3f, p.z+5.1f)); float f1x = (fbm((float3)(p.x+eps, p.y, p.z)) - f1) / eps; float f1z = (fbm((float3)(p.x, p.y, p.z+eps)) - f1) / eps; float f2x = (fbm((float3)(p.x+13.7f+eps, p.y+7.3f, p.z+5.1f)) - f2) / eps; float f2z = (fbm((float3)(p.x+13.7f, p.y+7.3f, p.z+5.1f+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      metal: "float curl3d(float3 p, int octaves) { const float eps = 0.01; float f1 = fbm(p); float f2 = fbm(p + float3(13.7, 7.3, 5.1)); float f1x = (fbm(p + float3(eps,0,0)) - f1) / eps; float f1z = (fbm(p + float3(0,0,eps)) - f1) / eps; float f2x = (fbm(p + float3(13.7+eps,7.3,5.1)) - f2) / eps; float f2z = (fbm(p + float3(13.7,7.3,5.1+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2; }",
      cuda: "__device__ float curl3d(float3 p, int octaves) { const float eps = 0.01f; float f1 = fbm(p); float f2 = fbm(make_float3(p.x+13.7f, p.y+7.3f, p.z+5.1f)); float f1x = (fbm(make_float3(p.x+eps, p.y, p.z)) - f1) / eps; float f1z = (fbm(make_float3(p.x, p.y, p.z+eps)) - f1) / eps; float f2x = (fbm(make_float3(p.x+13.7f+eps, p.y+7.3f, p.z+5.1f)) - f2) / eps; float f2z = (fbm(make_float3(p.x+13.7f, p.y+7.3f, p.z+5.1f+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      unity: "public static float Curl3d(Vector3 p, int octaves = 5) { float eps = 0.01f; float f1 = Fbm(p); float f2 = Fbm(new Vector3(p.x+13.7f, p.y+7.3f, p.z+5.1f)); float f1x = (Fbm(new Vector3(p.x+eps, p.y, p.z)) - f1) / eps; float f1z = (Fbm(new Vector3(p.x, p.y, p.z+eps)) - f1) / eps; float f2x = (Fbm(new Vector3(p.x+13.7f+eps, p.y+7.3f, p.z+5.1f)) - f2) / eps; float f2z = (Fbm(new Vector3(p.x+13.7f, p.y+7.3f, p.z+5.1f+eps)) - f2) / eps; return (f1x*f2z - f1z*f2x) * 0.2f; }",
      shadertoy: "float curl3d(vec3 p) { float eps = 0.01; float f1 = fbm(p); float f2 = fbm(p+vec3(13.7,7.3,5.1)); float f1x = (fbm(p+vec3(eps,0,0))-f1)/eps; float f1z = (fbm(p+vec3(0,0,eps))-f1)/eps; float f2x = (fbm(p+vec3(13.7+eps,7.3,5.1))-f2)/eps; float f2z = (fbm(p+vec3(13.7,7.3,5.1+eps))-f2)/eps; return (f1x*f2z-f1z*f2x)*0.2; }",
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
