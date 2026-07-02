import { DEFAULT_SAMPLING, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  seed: 1337,
  cells: 6,
} as const;
export type VoronoiTerrain3dParams = {
  seed: number;
  cells: number;
};

export function voronoiTerrain3dCurve(
  params: VoronoiTerrain3dParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = {
    id: "voronoi-terrain-3d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t: number) => ({ x: t, y: 0 }),
  };
  return {
    id: "voronoi-terrain-3d",
    name: "Voronoi Terrain 3D",
    aliases: [
      "worley 3d",
      "cellular terrain",
      "voronoi noise 3d",
      "cell noise",
    ],
    family: "noise",
    summary: "3D Voronoi cellular terrain",
    formula: "v(p) = d2(p) - d1(p) where d1, d2 are nearest cell distances",
    continuity: "C0",
    domain: [0, 1],
    range: [0, 1],
    tags: ["noise", "3d", "terrain", "voronoi", "cellular", "crystalline"],
    useCases: [
      "stone-texture",
      "cracked-surface",
      "cell-pattern",
      "crystalline-terrain",
    ],
    roleTags: ["noise", "procedural", "renderer3d", "terrain"],
    snippets: {
      equation:
        "v(p) = d2(p) - d1(p)  where d1,d2 = nearest, 2nd-nearest cell distances",
      glsl: "float voronoi3d(vec3 p, float seed) { vec3 i = floor(p); vec3 f = fract(p); float best = 999.0, second = 999.0; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { vec3 cell = i + vec3(dx, dy, dz); vec3 rnd = vec3(hash(cell + seed), hash(cell + seed*1.3), hash(cell + seed*1.7)); vec3 offset = rnd; float d = length(f - vec3(dx, dy, dz) - offset + 0.5); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      vex: "float voronoi3d(vector p; float seed) { vector i = floor(p); vector f = p - i; float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { vector cell = i + {dx, dy, dz}; vector rnd = set(rand(cell + seed), rand(cell + seed*1.3), rand(cell + seed*1.7)); vector diff = f - set(dx, dy, dz) - rnd + 0.5; float d = length(diff); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      hlsl: "float voronoi3d(float3 p, float seed) { int3 i = floor(p); float3 f = frac(p); float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { float3 cell = i + int3(dx, dy, dz); float3 rnd = float3(hash(cell + seed), hash(cell + seed*1.3), hash(cell + seed*1.7)); float d = length(f - float3(dx, dy, dz) - rnd + 0.5); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      wgsl: "fn voronoi_3d(p: vec3f, seed: f32) -> f32 { let i = floor(p); let f = fract(p); var best = 999.0; var second = 999.0; for (var dx = -1; dx <= 1; dx++) { for (var dy = -1; dy <= 1; dy++) { for (var dz = -1; dz <= 1; dz++) { let cell = i + vec3f(f32(dx), f32(dy), f32(dz)); let rnd = vec3f(hash(cell + seed), hash(cell + seed*1.3), hash(cell + seed*1.7)); let d = length(f - vec3f(f32(dx), f32(dy), f32(dz)) - rnd + 0.5); if (d < best) { second = best; best = d; } else if (d < second) { second = d; } } } } return second - best; }",
      ts: "function voronoi3d(p: Vec3, seed: number = 1337): number { const xi = Math.floor(p[0]), yi = Math.floor(p[1]), zi = Math.floor(p[2]); let best = 999, second = 999; for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) { const cx = xi + dx + hash(xi+dx+seed, yi+dy, zi+dz); const cy = yi + dy + hash(xi+dx, yi+dy+seed*1.3, zi+dz); const cz = zi + dz + hash(xi+dx, yi+dy, zi+dz+seed*1.7); const d = Math.hypot(p[0]-cx, p[1]-cy, p[2]-cz); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      python:
        "def voronoi_3d(p, seed=1337): xi, yi, zi = int(p[0]), int(p[1]), int(p[2]); best = second = 999; for dx in (-1,0,1): for dy in (-1,0,1): for dz in (-1,0,1): cx = xi+dx+hash((xi+dx+seed, yi+dy, zi+dz)); cy = yi+dy+hash((xi+dx, yi+dy+seed*1.3, zi+dz)); cz = zi+dz+hash((xi+dx, yi+dy, zi+dz+seed*1.7)); d = ((p[0]-cx)**2+(p[1]-cy)**2+(p[2]-cz)**2)**0.5; if d < best: second, best = best, d; elif d < second: second = d; return second - best",
      opencl:
        "float voronoi3d(float3 p, float seed) { int3 i = (int3)(floor(p.x), floor(p.y), floor(p.z)); float3 f = p - (float3)(i.x, i.y, i.z); float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { float3 cell = (float3)(i.x+dx, i.y+dy, i.z+dz); float3 rnd = (float3)(hash(cell + seed), hash(cell + seed*1.3f), hash(cell + seed*1.7f)); float d = length(f - (float3)(dx, dy, dz) - rnd + 0.5f); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      metal:
        "float voronoi3d(float3 p, float seed) { int3 i = int3(floor(p)); float3 f = fract(p); float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { float3 cell = float3(i.x+dx, i.y+dy, i.z+dz); float3 rnd = float3(hash(cell + seed), hash(cell + seed*1.3), hash(cell + seed*1.7)); float d = length(f - float3(dx, dy, dz) - rnd + 0.5); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      cuda: "__device__ float voronoi3d(float3 p, float seed) { int3 i = make_int3(floorf(p.x), floorf(p.y), floorf(p.z)); float3 f = make_float3(p.x-i.x, p.y-i.y, p.z-i.z); float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { float3 rnd = make_float3(hash(i.x+dx+seed, i.y+dy, i.z+dz), hash(i.x+dx, i.y+dy+seed*1.3f, i.z+dz), hash(i.x+dx, i.y+dy, i.z+dz+seed*1.7f)); float d = length(make_float3(f.x-dx-rnd.x+0.5f, f.y-dy-rnd.y+0.5f, f.z-dz-rnd.z+0.5f)); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      unity:
        "public static float Voronoi3d(Vector3 p, float seed = 1337) { Vector3Int i = Vector3Int.FloorToInt(p); Vector3 f = p - i; float best = 999, second = 999; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { Vector3 rnd = new Vector3(Hash(i.x+dx+seed, i.y+dy, i.z+dz), Hash(i.x+dx, i.y+dy+seed*1.3f, i.z+dz), Hash(i.x+dx, i.y+dy, i.z+dz+seed*1.7f)); float d = Vector3.Distance(f - new Vector3(dx, dy, dz), rnd - Vector3.one*0.5f); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return second - best; }",
      shadertoy:
        "float voronoi3d(vec3 p) { vec3 i = floor(p); vec3 f = fract(p); float best = 999., second = 999.; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) for (int dz = -1; dz <= 1; dz++) { vec3 rnd = vec3(hash(i+vec3(dx,dy,dz)+1337.), hash(i+vec3(dx,dy,dz)+1738.), hash(i+vec3(dx,dy,dz)+2143.)); vec3 diff = f - vec3(dx,dy,dz) - rnd + .5; float d = dot(diff,diff); if (d < best) { second = best; best = d; } else if (d < second) second = d; } return sqrt(second) - sqrt(best); }",
    },
    preview: {
      kind: "renderer3d",
      viewId: "noise3d",
      useCase: "voronoi-terrain",
      renderMode: "wireframe",
      quality: "card",
      params: {
        seed: 1337,
        scale: 4,
        gridSize: 32,
      },
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["fbm-3d-noise", "worley-noise-1d", "worley-f2-f1"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => voronoiTerrain3dCurve(p as VoronoiTerrain3dParams),
    },
  };
}
