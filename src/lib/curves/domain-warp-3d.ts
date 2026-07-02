import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  scale: 4,
  octaves: 5,
  lacunarity: 2,
  gain: 0.5,
} as const;
export type DomainWarp3dParams = {
  seed: number;
  scale: number;
  octaves: number;
  lacunarity: number;
  gain: number;
};

export function domainWarp3dCurve(
  params: DomainWarp3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "domain-warp-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "domain-warp-3d",
    name: "Domain Warp 3D",
    aliases: ["domain warp", "warped noise 3d", "space distortion"],
    family: "noise",
    summary: "3D domain-warped FBM terrain",
    formula: "w(p) = fbm(p + vec3(fbm(p + a), 0, fbm(p + b)) * warp)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "domain-warp", "organic", "alien"],
    useCases: ["organic-terrain", "alien-landscape", "fluid-surface"],
    roleTags: ["noise", "procedural", "renderer3d", "terrain", "field"],
    snippets: {
      equation:
        "w(p) = fbm(p + vec3(fbm(p + a), 0, fbm(p + b)) * warp)",
      glsl: "float domainWarp3d(vec3 p, int octaves, float warp) { float qx = fbm(p + vec3(11.3, 0, 0)); float qz = fbm(p + vec3(0, 5.7, 0)); return fbm(p + vec3(qx, 0, qz) * warp); }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float domainWarp3d(vector p; int octaves; float warp) { float qx = fbm(p + {11.3, 0, 0}); float qz = fbm(p + {0, 5.7, 0}); return fbm(p + set(qx, 0, qz) * warp); }\n\nfloat fbm(vector p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      hlsl: "float domainWarp3d(float3 p, int octaves, float warp) { float qx = fbm(p + float3(11.3, 0, 0)); float qz = fbm(p + float3(0, 5.7, 0)); return fbm(p + float3(qx, 0, qz) * warp); }\n\nfloat fbm(float3 p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      wgsl: "fn domain_warp_3d(p: vec3f, octaves: i32, warp: f32) -> f32 { let qx = fbm(p + vec3f(11.3, 0, 0)); let qz = fbm(p + vec3f(0, 5.7, 0)); return fbm(p + vec3f(qx, 0, qz) * warp); }\n\nfn fbm(p: vec3f) -> f32 { var v = 0.0; var a = 0.5; var f = 1.0; for (var i = 0u; i < 5u; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      ts: "function domainWarp3d(p: Vec3, octaves: number = 5, warp: number = 2.55): number { const qx = fbm3(p[0] + 11.3, p[1], p[2]); const qz = fbm3(p[0], p[1] + 5.7, p[2]); return fbm3(p[0] + qx * warp, p[1], p[2] + qz * warp); }",
      python:
        "def domain_warp_3d(p, octaves=5, warp=2.55): qx = fbm((p[0] + 11.3, p[1], p[2])); qz = fbm((p[0], p[1] + 5.7, p[2])); return fbm((p[0] + qx * warp, p[1], p[2] + qz * warp))",
      opencl:
        "float domainWarp3d(float3 p, int octaves, float warp) { float qx = fbm((float3)(p.x + 11.3f, p.y, p.z)); float qz = fbm((float3)(p.x, p.y + 5.7f, p.z)); return fbm((float3)(p.x + qx * warp, p.y, p.z + qz * warp)); }\n\nfloat fbm(float3 p) { float v = 0, a = 0.5f, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5f; f *= 2; } return v; }",
      metal:
        "float domainWarp3d(float3 p, int octaves, float warp) { float qx = fbm(p + float3(11.3, 0, 0)); float qz = fbm(p + float3(0, 5.7, 0)); return fbm(p + float3(qx, 0, qz) * warp); }",
      cuda: "__device__ float domainWarp3d(float3 p, int octaves, float warp) { float qx = fbm(make_float3(p.x + 11.3f, p.y, p.z)); float qz = fbm(make_float3(p.x, p.y + 5.7f, p.z)); return fbm(make_float3(p.x + qx * warp, p.y, p.z + qz * warp)); }",
      unity:
        "public static float DomainWarp3d(Vector3 p, int octaves = 5, float warp = 2.55f) { float qx = Fbm(new Vector3(p.x + 11.3f, p.y, p.z)); float qz = Fbm(new Vector3(p.x, p.y + 5.7f, p.z)); return Fbm(new Vector3(p.x + qx * warp, p.y, p.z + qz * warp)); }",
      shadertoy:
        "float domainWarp3d(vec3 p) { float qx = fbm(p + vec3(11.3, 0, 0)); float qz = fbm(p + vec3(0, 5.7, 0)); return fbm(p + vec3(qx, 0, qz) * 2.55); }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "domain-warp",
      renderMode: "shaded",
      quality: "card",
      params: {
        seed: 1337,
        scale: 4,
        octaves: 5,
        lacunarity: 2,
        gain: 0.5,
        gridSize: 28,
      },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "fbm-1d", "turbulence-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => domainWarp3dCurve(p as DomainWarp3dParams),
    },
  };
}
