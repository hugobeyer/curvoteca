import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  speed: 1,
} as const;
export type GerstnerWaves3dParams = {
  seed: number;
  speed: number;
};

export function gerstnerWaves3dCurve(
  params: GerstnerWaves3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "gerstner-waves-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "gerstner-waves-3d",
    name: "Gerstner Waves 3D",
    aliases: ["ocean waves", "trochoidal waves", "water surface"],
    family: "wave",
    summary: "Gerstner wave sum water surface",
    formula: "h(x,z) = sum_i a_i * cos(dir_i · (x,z) * f_i + t * s_i + φ_i)",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["wave", "3d", "ocean", "water", "surface", "gerstner"],
    useCases: ["ocean-surface", "water-simulation", "wave-terrain"],
    roleTags: ["wave", "procedural", "renderer3d"],
    snippets: {
      equation: "h(x,z) = sum_i a_i * cos(dir_i · (x,z) * f_i + t * s_i + φ_i)",
      glsl: "float gerstner3d(vec2 p, float time) { float h = 0.0; vec2 dir; dir = vec2(0.3, 0.95); h += 0.28 * cos(dot(dir, p) * 1.2 + time * 0.6 + 0.0); dir = vec2(0.36, 0.93); h += 0.18 * cos(dot(dir, p) * 2.1 + time * 0.8 + 1.7); dir = vec2(0.86, 0.5); h += 0.12 * cos(dot(dir, p) * 3.5 + time * 1.1 + 3.3); dir = vec2(0.97, 0.26); h += 0.07 * cos(dot(dir, p) * 5.7 + time * 1.4 + 5.1); dir = vec2(0.99, 0.12); h += 0.04 * cos(dot(dir, p) * 9.2 + time * 1.7 + 7.8); return h; }",
      vex: "float gerstner3d(vector2 p; float time) { float h = 0; vector2 dir; dir = {0.3, 0.95}; h += 0.28 * cos(dot(dir, p) * 1.2 + time * 0.6); dir = {0.36, 0.93}; h += 0.18 * cos(dot(dir, p) * 2.1 + time * 0.8 + 1.7); dir = {0.86, 0.5}; h += 0.12 * cos(dot(dir, p) * 3.5 + time * 1.1 + 3.3); dir = {0.97, 0.26}; h += 0.07 * cos(dot(dir, p) * 5.7 + time * 1.4 + 5.1); dir = {0.99, 0.12}; h += 0.04 * cos(dot(dir, p) * 9.2 + time * 1.7 + 7.8); return h; }",
      hlsl: "float gerstner3d(float2 p, float time) { float h = 0; float2 d; d = float2(0.3, 0.95); h += 0.28 * cos(dot(d, p) * 1.2 + time * 0.6); d = float2(0.36, 0.93); h += 0.18 * cos(dot(d, p) * 2.1 + time * 0.8 + 1.7); d = float2(0.86, 0.5); h += 0.12 * cos(dot(d, p) * 3.5 + time * 1.1 + 3.3); d = float2(0.97, 0.26); h += 0.07 * cos(dot(d, p) * 5.7 + time * 1.4 + 5.1); d = float2(0.99, 0.12); h += 0.04 * cos(dot(d, p) * 9.2 + time * 1.7 + 7.8); return h; }",
      wgsl: "fn gerstner_3d(p: vec2f, time: f32) -> f32 { var h = 0.0; h += 0.28 * cos(dot(vec2f(0.3, 0.95), p) * 1.2 + time * 0.6); h += 0.18 * cos(dot(vec2f(0.36, 0.93), p) * 2.1 + time * 0.8 + 1.7); h += 0.12 * cos(dot(vec2f(0.86, 0.5), p) * 3.5 + time * 1.1 + 3.3); h += 0.07 * cos(dot(vec2f(0.97, 0.26), p) * 5.7 + time * 1.4 + 5.1); h += 0.04 * cos(dot(vec2f(0.99, 0.12), p) * 9.2 + time * 1.7 + 7.8); return h; }",
      ts: "function gerstner3d(x: number, z: number, time: number): number { let h = 0; h += 0.28 * Math.cos((0.3*x + 0.95*z) * 1.2 + time*0.6); h += 0.18 * Math.cos((0.36*x + 0.93*z) * 2.1 + time*0.8 + 1.7); h += 0.12 * Math.cos((0.86*x + 0.5*z) * 3.5 + time*1.1 + 3.3); h += 0.07 * Math.cos((0.97*x + 0.26*z) * 5.7 + time*1.4 + 5.1); h += 0.04 * Math.cos((0.99*x + 0.12*z) * 9.2 + time*1.7 + 7.8); return h; }",
      python: "def gerstner_3d(x, z, time): h = 0; h += 0.28 * cos((0.3*x + 0.95*z) * 1.2 + time*0.6); h += 0.18 * cos((0.36*x + 0.93*z) * 2.1 + time*0.8 + 1.7); h += 0.12 * cos((0.86*x + 0.5*z) * 3.5 + time*1.1 + 3.3); h += 0.07 * cos((0.97*x + 0.26*z) * 5.7 + time*1.4 + 5.1); h += 0.04 * cos((0.99*x + 0.12*z) * 9.2 + time*1.7 + 7.8); return h",
      opencl: "float gerstner3d(float2 p, float time) { float h = 0; h += 0.28f * cos(dot((float2)(0.3f,0.95f), p) * 1.2f + time * 0.6f); h += 0.18f * cos(dot((float2)(0.36f,0.93f), p) * 2.1f + time * 0.8f + 1.7f); h += 0.12f * cos(dot((float2)(0.86f,0.5f), p) * 3.5f + time * 1.1f + 3.3f); h += 0.07f * cos(dot((float2)(0.97f,0.26f), p) * 5.7f + time * 1.4f + 5.1f); h += 0.04f * cos(dot((float2)(0.99f,0.12f), p) * 9.2f + time * 1.7f + 7.8f); return h; }",
      metal: "float gerstner3d(float2 p, float time) { float h = 0; h += 0.28 * cos(dot(float2(0.3, 0.95), p) * 1.2 + time * 0.6); h += 0.18 * cos(dot(float2(0.36, 0.93), p) * 2.1 + time * 0.8 + 1.7); h += 0.12 * cos(dot(float2(0.86, 0.5), p) * 3.5 + time * 1.1 + 3.3); h += 0.07 * cos(dot(float2(0.97, 0.26), p) * 5.7 + time * 1.4 + 5.1); h += 0.04 * cos(dot(float2(0.99, 0.12), p) * 9.2 + time * 1.7 + 7.8); return h; }",
      cuda: "__device__ float gerstner3d(float2 p, float time) { float h = 0; h += 0.28f * cosf(dot(make_float2(0.3f,0.95f), p) * 1.2f + time * 0.6f); h += 0.18f * cosf(dot(make_float2(0.36f,0.93f), p) * 2.1f + time * 0.8f + 1.7f); h += 0.12f * cosf(dot(make_float2(0.86f,0.5f), p) * 3.5f + time * 1.1f + 3.3f); h += 0.07f * cosf(dot(make_float2(0.97f,0.26f), p) * 5.7f + time * 1.4f + 5.1f); h += 0.04f * cosf(dot(make_float2(0.99f,0.12f), p) * 9.2f + time * 1.7f + 7.8f); return h; }",
      unity: "public static float Gerstner3d(Vector2 p, float time) { float h = 0; h += 0.28f * Mathf.Cos(Vector2.Dot(new Vector2(0.3f, 0.95f), p) * 1.2f + time * 0.6f); h += 0.18f * Mathf.Cos(Vector2.Dot(new Vector2(0.36f, 0.93f), p) * 2.1f + time * 0.8f + 1.7f); h += 0.12f * Mathf.Cos(Vector2.Dot(new Vector2(0.86f, 0.5f), p) * 3.5f + time * 1.1f + 3.3f); h += 0.07f * Mathf.Cos(Vector2.Dot(new Vector2(0.97f, 0.26f), p) * 5.7f + time * 1.4f + 5.1f); h += 0.04f * Mathf.Cos(Vector2.Dot(new Vector2(0.99f, 0.12f), p) * 9.2f + time * 1.7f + 7.8f); return h; }",
      shadertoy: "float gerstner3d(vec2 p, float t) { float h = 0.0; h += 0.28*cos(dot(vec2(0.3,0.95),p)*1.2+t*0.6); h += 0.18*cos(dot(vec2(0.36,0.93),p)*2.1+t*0.8+1.7); h += 0.12*cos(dot(vec2(0.86,0.5),p)*3.5+t*1.1+3.3); h += 0.07*cos(dot(vec2(0.97,0.26),p)*5.7+t*1.4+5.1); h += 0.04*cos(dot(vec2(0.99,0.12),p)*9.2+t*1.7+7.8); return h; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "gerstner-waves",
      renderMode: "shaded",
      quality: "card",
      params: { seed: 1337, gridSize: 28 },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "triangle-wave", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => gerstnerWaves3dCurve(p as GerstnerWaves3dParams),
    },
  };
}
