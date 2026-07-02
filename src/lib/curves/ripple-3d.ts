import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
} as const;
export type Ripple3dParams = {
  seed: number;
};

export function ripple3dCurve(
  params: Ripple3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "ripple-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "ripple-3d",
    name: "Ripple 3D",
    aliases: ["ripple field", "raindrop ripples", "concentric waves"],
    family: "wave",
    summary: "Concentric sine ripples radiating from a noise-perturbed center",
    formula: "h(p) = sin(dist(p, c) * f - t) * exp(-dist * d) + 0.5",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["wave", "3d", "terrain", "ripple", "water", "concentric"],
    useCases: ["ripple-surface", "raindrop-pattern", "water-ripple"],
    roleTags: ["wave", "procedural", "renderer3d"],
    snippets: {
      equation: "h(p) = sin(dist(p, c) * f - t) * exp(-dist * d) + 0.5",
      glsl: "float ripple3d(vec2 p, float time, float seed) {\n  float cx = fbm(vec3(seed * 0.17, p.y + seed * 0.13, time * 0.15)) * 0.25;\n  float cy = fbm(vec3(p.x + seed * 0.23, seed * 0.11, time * 0.15)) * 0.25;\n  float dist = length(p - vec2(cx, cy));\n  return (sin(dist * 6.5 - time * 3.0) * exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      vex: "float ripple3d(vector p; float seed; float time) {\n  float cx = fbm(set(seed * 0.17, p.y + seed * 0.13, time * 0.15), 1) * 0.25;\n  float cy = fbm(set(p.x + seed * 0.23, seed * 0.11, time * 0.15), 1) * 0.25;\n  float dist = distance(p, set(cx, cy, 0));\n  return (sin(dist * 6.5 - time * 3.0) * exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      hlsl: "float ripple3d(float2 p, float time, float seed) {\n  float cx = fbm(float3(seed * 0.17, p.y + seed * 0.13, time * 0.15)) * 0.25;\n  float cy = fbm(float3(p.x + seed * 0.23, seed * 0.11, time * 0.15)) * 0.25;\n  float dist = length(p - float2(cx, cy));\n  return (sin(dist * 6.5 - time * 3.0) * exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      wgsl: "fn ripple_3d(p: vec2f, time: f32, seed: f32) -> f32 {\n  let cx = fbm(vec3f(seed * 0.17, p.y + seed * 0.13, time * 0.15)) * 0.25;\n  let cy = fbm(vec3f(p.x + seed * 0.23, seed * 0.11, time * 0.15)) * 0.25;\n  let dist = length(p - vec2f(cx, cy));\n  return (sin(dist * 6.5 - time * 3.0) * exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      ts: "function ripple3d(x: number, y: number, time: number, seed: number): number {\n  const cx = fbm3(seed * 0.17, y + seed * 0.13, time * 0.15, 1) * 0.25;\n  const cy = fbm3(x + seed * 0.23, seed * 0.11, time * 0.15, 1) * 0.25;\n  const dist = Math.hypot(x - cx, y - cy);\n  return (Math.sin(dist * 6.5 - time * 3.0) * Math.exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      python: "def ripple_3d(x, y, time, seed=1337):\n  cx = fbm((seed*0.17, y + seed*0.13, time*0.15)) * 0.25\n  cy = fbm((x + seed*0.23, seed*0.11, time*0.15)) * 0.25\n  import math; dist = math.hypot(x - cx, y - cy)\n  return (math.sin(dist*6.5 - time*3.0) * math.exp(-dist*1.8) + 0.5) * 0.7",
      opencl: "float ripple3d(float2 p, float time, float seed) {\n  float cx = fbm((float3)(seed*0.17f, p.y + seed*0.13f, time*0.15f)) * 0.25f;\n  float cy = fbm((float3)(p.x + seed*0.23f, seed*0.11f, time*0.15f)) * 0.25f;\n  float dist = length(p - (float2)(cx, cy));\n  return (sin(dist*6.5f - time*3.0f) * exp(-dist*1.8f) + 0.5f) * 0.7f;\n}",
      metal: "float ripple3d(float2 p, float time, float seed) {\n  float cx = fbm(float3(seed * 0.17, p.y + seed * 0.13, time * 0.15)) * 0.25;\n  float cy = fbm(float3(p.x + seed * 0.23, seed * 0.11, time * 0.15)) * 0.25;\n  float dist = length(p - float2(cx, cy));\n  return (sin(dist * 6.5 - time * 3.0) * exp(-dist * 1.8) + 0.5) * 0.7;\n}",
      cuda: "__device__ float ripple3d(float2 p, float time, float seed) {\n  float cx = fbm(make_float3(seed*0.17f, p.y + seed*0.13f, time*0.15f)) * 0.25f;\n  float cy = fbm(make_float3(p.x + seed*0.23f, seed*0.11f, time*0.15f)) * 0.25f;\n  float dist = hypotf(p.x - cx, p.y - cy);\n  return (sinf(dist*6.5f - time*3.0f) * expf(-dist*1.8f) + 0.5f) * 0.7f;\n}",
      unity: "public static float Ripple3d(Vector2 p, float time, float seed = 1337f) {\n  float cx = Fbm(new Vector3(seed*0.17f, p.y + seed*0.13f, time*0.15f)) * 0.25f;\n  float cy = Fbm(new Vector3(p.x + seed*0.23f, seed*0.11f, time*0.15f)) * 0.25f;\n  float dist = Vector2.Distance(p, new Vector2(cx, cy));\n  return (Mathf.Sin(dist*6.5f - time*3.0f) * Mathf.Exp(-dist*1.8f) + 0.5f) * 0.7f;\n}",
      shadertoy: "float ripple3d(vec2 p, float t) { float cx = fbm(vec3(0.23, p.y + 0.17, t*0.15)) * 0.25; float cy = fbm(vec3(p.x + 0.31, 0.14, t*0.15)) * 0.25; float dist = length(p - vec2(cx, cy)); return (sin(dist*6.5 - t*3.0) * exp(-dist*1.8) + 0.5) * 0.7; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "ripple",
      renderMode: "shaded",
      quality: "card",
      params: { seed: 1337, gridSize: 28 },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["gerstner-waves-3d", "sine-dunes-3d", "fbm-3d-noise"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => ripple3dCurve(p as Ripple3dParams),
    },
  };
}
