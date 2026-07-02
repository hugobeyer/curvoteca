import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  scale: 4,
  octaves: 5,
  blend: 0.5,
} as const;
export type HybridBlend3dParams = {
  seed: number;
  scale: number;
  octaves: number;
  blend: number;
};

export function hybridBlend3dCurve(
  params: HybridBlend3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "hybrid-blend-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "hybrid-blend-3d",
    name: "Hybrid Blend 3D",
    aliases: ["hybrid terrain", "noise blend", "fbm-ridge mix"],
    family: "noise",
    summary: "Height-blended FBM + ridged noise terrain",
    formula:
      "h(p) = lerp(fbm(p), ridge(p), smoothstep(y)), smooth peaks, rough valleys",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "blend", "hybrid"],
    useCases: [
      "realistic-terrain",
      "mountain-valley",
      "mixed-texture",
    ],
    roleTags: ["noise", "procedural", "renderer3d", "terrain"],
    snippets: {
      equation:
        "h(p) = lerp(fbm(p), ridge(p), t)  where t = smoothstep(y)",
      glsl: "float hybridBlend3d(vec3 p, int octaves) { float f = fbm(p); float r = 1.0 - abs(fbm(p * 1.7) * 2.0 - 1.0); float t = smoothstep(-1.2, 1.2, p.y); return mix(f, r * r * 1.3, t); }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float hybridBlend3d(vector p; int octaves) { float f = fbm(p); float r = 1 - abs(fbm(p * 1.7) * 2 - 1); float t = smooth(-1.2, 1.2, p.y); return lerp(f, r * r * 1.3, t); }\n\nfloat fbm(vector p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      hlsl: "float hybridBlend3d(float3 p, int octaves) { float f = fbm(p); float r = 1 - abs(fbm(p * 1.7) * 2 - 1); float t = smoothstep(-1.2, 1.2, p.y); return lerp(f, r * r * 1.3, t); }",
      wgsl: "fn hybrid_blend_3d(p: vec3f, octaves: i32) -> f32 { let f = fbm(p); let r = 1.0 - abs(fbm(p * 1.7) * 2.0 - 1.0); let t = smoothstep(-1.2, 1.2, p.y); return mix(f, r * r * 1.3, t); }",
      ts: "function hybridBlend3d(p: Vec3, octaves: number = 5): number { const f = fbm3(p[0], p[1], p[2]); const r = 1 - Math.abs(fbm3(p[0]*1.7, p[1]*1.7, p[2]*1.7) * 2 - 1); const t = clamp01((p[1] + 1.2) / 2.4); return f * (1 - t) + r * r * 1.3 * t; }",
      python:
        "def hybrid_blend_3d(p, octaves=5): f = fbm(p); r = 1 - abs(fbm((p[0]*1.7, p[1]*1.7, p[2]*1.7))*2 - 1); t = max(0, min(1, (p[1]+1.2)/2.4)); return f*(1-t) + r*r*1.3*t",
      opencl:
        "float hybridBlend3d(float3 p, int octaves) { float f = fbm(p); float r = 1 - fabs(fbm(p * 1.7f) * 2 - 1); float t = smoothstep(-1.2f, 1.2f, p.y); return mix(f, r * r * 1.3f, t); }",
      metal:
        "float hybridBlend3d(float3 p, int octaves) { float f = fbm(p); float r = 1 - abs(fbm(p * 1.7) * 2 - 1); float t = smoothstep(-1.2, 1.2, p.y); return mix(f, r * r * 1.3, t); }",
      cuda: "__device__ float hybridBlend3d(float3 p, int octaves) { float f = fbm(p); float r = 1 - fabsf(fbm(make_float3(p.x*1.7f, p.y*1.7f, p.z*1.7f))*2 - 1); float t = smoothstep(-1.2f, 1.2f, p.y); return lerpf(f, r*r*1.3f, t); }",
      unity:
        "public static float HybridBlend3d(Vector3 p, int octaves = 5) { float f = Fbm(p); float r = 1 - Mathf.Abs(Fbm(p * 1.7f) * 2 - 1); float t = Mathf.SmoothStep(-1.2f, 1.2f, p.y); return Mathf.Lerp(f, r * r * 1.3f, t); }",
      shadertoy:
        "float hybridBlend3d(vec3 p) { float f = fbm(p); float r = 1.0 - abs(fbm(p * 1.7) * 2.0 - 1.0); float t = smoothstep(-1.2, 1.2, p.y); return mix(f, r * r * 1.3, t); }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "hybrid-blend",
      renderMode: "heightstrip",
      quality: "card",
      params: {
        seed: 1337,
        scale: 4,
        octaves: 5,
        gridSize: 28,
      },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "domain-warp", "fbm-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => hybridBlend3dCurve(p as HybridBlend3dParams),
    },
  };
}
