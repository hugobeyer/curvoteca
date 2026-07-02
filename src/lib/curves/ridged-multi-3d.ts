import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  octaves: 5,
  lacunarity: 2.1,
  gain: 0.55,
  sharpness: 2,
} as const;
export type RidgedMulti3dParams = {
  seed: number;
  octaves: number;
  lacunarity: number;
  gain: number;
  sharpness: number;
};

export function ridgedMulti3dCurve(
  params: RidgedMulti3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "ridged-multi-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "ridged-multi-3d",
    name: "Ridged Multi 3D",
    aliases: ["ridged noise 3d", "multi-ridge", "layered ridges", "erosion"],
    family: "noise",
    summary: "Multi-layered ridged noise terrain",
    formula:
      "r(p) = sum_i gain^i * (1 - |2 * fbm(p * lacunarity^i + offset_i) - 1|)^sharpness",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "ridged", "erosion", "rock"],
    useCases: ["rock-formation", "erosion", "mountain-ridges", "strata"],
    roleTags: ["noise", "procedural", "renderer3d", "terrain"],
    snippets: {
      equation:
        "r(p) = sum_i gain^i * (1 - |2 * fbm(p * lacunarity^i) - 1|)^2",
      glsl: "float ridgedMulti3d(vec3 p, int octaves, float lacunarity, float gain) { float result = 0.0, amp = 0.6, freq = 1.0, weight = 0.0; for (int i = 0; i < octaves; i++) { float v = fbm(p * freq); float ridge = 1.0 - abs(v * 2.0 - 1.0); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float ridgedMulti3d(vector p; int octaves; float lacunarity; float gain) { float result = 0, amp = 0.6, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = fbm(p * freq); float ridge = 1 - abs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }\n\nfloat fbm(vector p) { float v = 0, a = 0.5, f = 1; for (int i = 0; i < 5; i++) { v += a * noise(p * f); a *= 0.5; f *= 2; } return v; }",
      hlsl: "float ridgedMulti3d(float3 p, int octaves, float lacunarity, float gain) { float result = 0, amp = 0.6, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = fbm(p * freq); float ridge = 1 - abs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      wgsl: "fn ridged_multi_3d(p: vec3f, octaves: i32, lacunarity: f32, gain: f32) -> f32 { var result = 0.0; var amp = 0.6; var freq = 1.0; var weight = 0.0; for (var i = 0; i < octaves; i++) { let v = fbm(p * freq); let ridge = 1.0 - abs(v * 2.0 - 1.0); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      ts: "function ridgedMulti3d(p: Vec3, octaves: number = 5, lacunarity: number = 2.1, gain: number = 0.55): number { let result = 0, amp = 0.6, freq = 1, weight = 0; for (let i = 0; i < octaves; i++) { const v = fbm3(p[0] * freq, p[1] * freq, p[2] * freq); const ridge = 1 - Math.abs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      python:
        "def ridged_multi_3d(p, octaves=5, lacunarity=2.1, gain=0.55): result = 0; amp = 0.6; freq = 1; weight = 0; for i in range(octaves): v = fbm((p[0]*freq, p[1]*freq, p[2]*freq)); ridge = 1 - abs(v*2 - 1); result += ridge*ridge*amp; weight += amp; amp *= gain; freq *= lacunarity; return result / weight",
      opencl:
        "float ridgedMulti3d(float3 p, int octaves, float lacunarity, float gain) { float result = 0, amp = 0.6f, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = fbm(p * freq); float ridge = 1 - fabs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      metal:
        "float ridgedMulti3d(float3 p, int octaves, float lacunarity, float gain) { float result = 0, amp = 0.6, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = fbm(p * freq); float ridge = 1 - abs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      cuda: "__device__ float ridgedMulti3d(float3 p, int octaves, float lacunarity, float gain) { float result = 0, amp = 0.6f, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = fbm(make_float3(p.x*freq, p.y*freq, p.z*freq)); float ridge = 1 - fabsf(v*2 - 1); result += ridge*ridge*amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      unity:
        "public static float RidgedMulti3d(Vector3 p, int octaves = 5, float lacunarity = 2.1f, float gain = 0.55f) { float result = 0, amp = 0.6f, freq = 1, weight = 0; for (int i = 0; i < octaves; i++) { float v = Fbm(p * freq); float ridge = 1 - Mathf.Abs(v * 2 - 1); result += ridge * ridge * amp; weight += amp; amp *= gain; freq *= lacunarity; } return result / weight; }",
      shadertoy:
        "float ridgedMulti3d(vec3 p) { float result = 0.0, amp = 0.6, freq = 1.0; for (int i = 0; i < 5; i++) { float v = fbm(p * freq); float ridge = 1.0 - abs(v * 2.0 - 1.0); result += ridge * ridge * amp; amp *= 0.55; freq *= 2.1; } return result; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "ridged-multi",
      renderMode: "heightstrip",
      quality: "card",
      params: {
        seed: 1337,
        scale: 4,
        octaves: 5,
        lacunarity: 2.1,
        gain: 0.55,
        gridSize: 30,
      },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "fbm-1d", "turbulence-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => ridgedMulti3dCurve(p as RidgedMulti3dParams),
    },
  };
}
