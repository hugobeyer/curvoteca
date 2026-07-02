import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
} as const;
export type SineDunes3dParams = {
  seed: number;
};

export function sineDunes3dCurve(
  params: SineDunes3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "sine-dunes-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "sine-dunes-3d",
    name: "Sine Dunes 3D",
    aliases: ["sand dunes", "directional sine", "wind-rippled"],
    family: "noise",
    summary: "Directional sine waves with noise-perturbed spacing",
    formula: "d(x,z) = sin(x * f + noise(x,z) * w) * 0.5 + 0.5",
    continuity: "C1",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "dune", "sine", "desert"],
    useCases: ["desert-terrain", "dune-surface", "wind-pattern"],
    roleTags: ["noise", "procedural", "renderer3d", "terrain"],
    snippets: {
      equation: "d(x,z) = sin(x · f + noise(x, z) · w) · 0.5 + 0.5",
      glsl: "float sineDunes3d(vec2 p, float seed) { float perturb = fbm(vec3(p * 0.3 + seed, 0.0)); return (sin(p.x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8; }\n\nfloat fbm(vec3 p) { float v = 0.0, a = 0.5, f = 1.0; for (int i = 0; i < 3; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      vex: "float sineDunes3d(vector p; float seed) {\n  float perturb = fbm(p * 0.3 + seed, 3);\n  return (sin(p.x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8;\n}",
      hlsl: "float sineDunes3d(float2 p, float seed) { float perturb = fbm(float3(p * 0.3 + seed, 0)); return (sin(p.x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8; }",
      wgsl: "fn sine_dunes_3d(p: vec2f, seed: f32) -> f32 { let perturb = fbm(vec3f(p * 0.3 + seed, 0.0)); return (sin(p.x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8; }\n\nfn fbm(p: vec3f) -> f32 { var v = 0.0; var a = 0.5; var f = 1.0; for (var i = 0u; i < 3u; i++) { v += a * noise(p * f); a *= 0.5; f *= 2.0; } return v; }",
      ts: "function sineDunes3d(x: number, z: number, seed: number): number { const perturb = fbm3(x * 0.3 + 5, z * 0.3 + 3, seed * 0.01, 3) * 0.4; return (Math.sin(x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8; }",
      python: "def sine_dunes_3d(x, z, seed): perturb = fbm((x*0.3+5, z*0.3+3, seed*0.01)) * 0.4; return (sin(x*2.5 + perturb*3 + seed*0.1)*0.5 + 0.5)*0.8",
      opencl: "float sineDunes3d(float2 p, float seed) { float perturb = fbm((float3)(p.x*0.3f+seed, p.y*0.3f, 0.0f)); return (sin(p.x*2.5f + perturb*3.0f + seed*0.1f)*0.5f + 0.5f)*0.8f; }",
      metal: "float sineDunes3d(float2 p, float seed) { float perturb = fbm(float3(p * 0.3 + seed, 0)); return (sin(p.x * 2.5 + perturb * 3.0 + seed * 0.1) * 0.5 + 0.5) * 0.8; }",
      cuda: "__device__ float sineDunes3d(float2 p, float seed) { float perturb = fbm(make_float3(p.x*0.3f+seed, p.y*0.3f, 0.0f)); return (sinf(p.x*2.5f + perturb*3.0f + seed*0.1f)*0.5f + 0.5f)*0.8f; }",
      unity: "public static float SineDunes3d(Vector2 p, float seed) { float perturb = Fbm(new Vector3(p.x*0.3f+seed, p.y*0.3f, 0)); return (Mathf.Sin(p.x*2.5f + perturb*3.0f + seed*0.1f)*0.5f + 0.5f)*0.8f; }",
      shadertoy: "float sineDunes3d(vec2 p) { float perturb = fbm(vec3(p*0.3, 0.0)); return (sin(p.x*2.5 + perturb*3.0)*0.5+0.5)*0.8; }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "sine-dunes",
      renderMode: "heightstrip",
      quality: "card",
      params: { seed: 1337, gridSize: 28 },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "billow-3d", "gerstner-waves-3d"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => sineDunes3dCurve(p as SineDunes3dParams),
    },
  };
}
