import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  scale: 4,
  octaves: 5,
  lacunarity: 2,
  gain: 0.5,
  gridSize: 64,
} as const;

export type Fbm3dNoiseParams = {
  seed: number;
  scale: number;
  octaves: number;
  lacunarity: number;
  gain: number;
  gridSize: number;
};

export function fbm3dNoiseCurve(
  params: Fbm3dNoiseParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "fbm-3d-noise",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "fbm-3d-noise",
    name: "FBM 3D Noise",
    family: "noise",
    summary: "3D fractal Brownian motion",
    formula: "fbm(p) = sum_i gain^i * noise(scale * p * lacunarity^i)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "field", "volume", "terrain", "shader", "houdini"],
    useCases: [
      "terrain-height",
      "procedural-texture",
      "clouds",
      "natural-look",
    ],
    roleTags: [
      "noise",
      "procedural",
      "renderer3d",
      "field",
      "volume",
      "terrain",
    ],
    snippets: {
      equation: "fbm(p) = sum_i gain^i * noise(scale * p * lacunarity^i)",
      glsl: "float fbm3d(vec3 p, int octaves, float lacunarity, float gain) { float value = 0.0, amplitude = 1.0, frequency = 1.0; for (int i = 0; i < octaves; i++) { value += amplitude * noise(p * frequency); p *= lacunarity; amplitude *= gain; } return value; }",
      vex: "float fbm3d(vector p; int octaves; float lacunarity; float gain) { float value = 0, amp = 1, freq = 1; for (int i = 0; i < octaves; i++) { value += amp * noise(p * freq); p *= lacunarity; amp *= gain; } return value; }",
      hlsl: "float fbm3d(float3 p, int octaves, float lacunarity, float gain) { float value = 0, amplitude = 1, frequency = 1; for (int i = 0; i < octaves; i++) { value += amplitude * noise(p * frequency); p *= lacunarity; amplitude *= gain; } return value; }",
      shadertoy:
        "float fbm(vec3 p) { float value = 0.0, amplitude = 0.5; for (int i = 0; i < 5; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; } return value; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "fbm-terrain",
      renderMode: "shaded",
      quality: "card",
      params: {
        seed: 1337,
        scale: 4,
        octaves: 5,
        lacunarity: 2,
        gain: 0.5,
        gridSize: 32,
      },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-1d", "domain-warp", "perlin-noise-1d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => fbm3dNoiseCurve(p as Fbm3dNoiseParams),
    },
  };
}
