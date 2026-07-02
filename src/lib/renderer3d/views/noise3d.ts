import { addRenderer3DGrid, pushLine, pushVertex } from "../geometry3d";
import {
  clamp01,
  cross3,
  dot3,
  mix3,
  normalize3,
  smoothstep01,
  sub3,
  type Vec3,
} from "../math3d";
import { resolveGridSize } from "../tokens3d";
import type {
  Renderer3DGeometry,
  Renderer3DUseCase,
  Renderer3DView,
} from "../types";

export const createNoise3DView = (): Renderer3DView => ({
  id: "noise3d",
  defaultUseCase: "fbm-terrain",
  defaultRenderMode: "shaded",
  supportedRenderModes: ["shaded", "wireframe"],
  build({ data, time, colors, tokens }) {
    const useCase = resolveNoiseUseCase(data.useCase);
    // Read current pager size for LOD scaling (live, so column/pager cycling takes effect)
    let lod = data.params?.lod;
    if (typeof localStorage !== "undefined") {
      try {
        const p = Number(localStorage.getItem("curvoteca:pager-size"));
        if (p > 0) lod = p;
      } catch {}
    }
    const gridSize = resolveGridSize(
      tokens,
      data.quality,
      data.params?.gridSize,
      lod,
    );
    const size = tokens.surfaceExtent;
    const wire: number[] = [];

    // Grid (respect grid mode: full / lines / axis)
    addRenderer3DGrid(wire, colors, tokens.gridExtent, data.gridMode ?? "full");

    // Terrain vertices
    const verts: { p: Vec3; value: number }[] = [];
    for (let z = 0; z < gridSize; z += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        const u = (x / (gridSize - 1)) * 2 - 1;
        const v = (z / (gridSize - 1)) * 2 - 1;
        const value = sampleNoiseUseCase(
          useCase,
          u,
          v,
          time,
          data.params?.seed ?? 0,
        );
        const falloff =
          useCase === "fbm-terrain"
            ? smoothstep01(1.25 - Math.hypot(u, v) * 0.76)
            : 1;
        const amp =
          useCase === "ridged-rock"
            ? 1.35
            : useCase === "domain-warp"
              ? 1.05
              : 1.14;
        verts.push({
          p: [u * size, 0.04 + value * amp * falloff, v * size],
          value,
        });
      }
    }

    // Wireframe — unlit curve color, alpha fades by height (low Y = faint)
    const wf = colors.curve;
    const lift = 0.012;
    const heightAlpha = (y: number) => clamp01((y - 0.04) / 1.0) * 0.7 + 0.15;
    for (let z = 0; z < gridSize; z += 1) {
      for (let x = 0; x < gridSize - 1; x += 1) {
        const a = verts[z * gridSize + x].p;
        const b = verts[z * gridSize + x + 1].p;
        const alpha = heightAlpha((a[1] + b[1]) / 2);
        pushLine(
          wire,
          [a[0], a[1] + lift, a[2]],
          [b[0], b[1] + lift, b[2]],
          wf,
          alpha,
        );
      }
    }
    for (let x = 0; x < gridSize; x += 1) {
      for (let z = 0; z < gridSize - 1; z += 1) {
        const a = verts[z * gridSize + x].p;
        const b = verts[(z + 1) * gridSize + x].p;
        const alpha = heightAlpha((a[1] + b[1]) / 2);
        pushLine(
          wire,
          [a[0], a[1] + lift, a[2]],
          [b[0], b[1] + lift, b[2]],
          wf,
          alpha,
        );
      }
    }

    return { mesh: [], ghost: [], wire, points: [] };
  },
});

const resolveNoiseUseCase = (value: Renderer3DUseCase | undefined) =>
  value === "domain-warp" || value === "ridged-rock" || value === "fbm-terrain"
    ? value
    : "fbm-terrain";

const sampleNoiseUseCase = (
  useCase: "fbm-terrain" | "domain-warp" | "ridged-rock",
  u: number,
  v: number,
  time: number,
  seed: number,
) => {
  const z = time * 0.00013 + seed * 0.013;
  if (useCase === "domain-warp") {
    return warpedFbm3(u * 2.15 + 4, v * 2.15, z, z * 0.9);
  }
  if (useCase === "ridged-rock") {
    return ridgedFbm3(u * 2.85 + 2, v * 2.85 + 9, z);
  }
  return fbm3(u * 2.3 + 8, v * 2.3 + 3, z);
};

const hash3 = (x: number, y: number, z: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
};

const valueNoise3 = (x: number, y: number, z: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = smoothstep01(xf);
  const v = smoothstep01(yf);
  const w = smoothstep01(zf);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const h = (dx: number, dy: number, dz: number) =>
    hash3(xi + dx, yi + dy, zi + dz);
  const x00 = lerp(h(0, 0, 0), h(1, 0, 0), u);
  const x10 = lerp(h(0, 1, 0), h(1, 1, 0), u);
  const x01 = lerp(h(0, 0, 1), h(1, 0, 1), u);
  const x11 = lerp(h(0, 1, 1), h(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
};

const fbm3 = (x: number, y: number, z: number) => {
  let amplitude = 0.5;
  let frequency = 1;
  let sum = 0;
  let weight = 0;
  for (let i = 0; i < 5; i += 1) {
    sum += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2.04;
  }
  return sum / weight;
};

const warpedFbm3 = (x: number, y: number, z: number, t: number) => {
  const qx = fbm3(x + 11.3, y, z + t);
  const qz = fbm3(x, y + 5.7, z + t * 0.73);
  return fbm3(x + qx * 2.55, y, z + qz * 2.55);
};

const ridgedFbm3 = (x: number, y: number, z: number) => {
  const v = fbm3(x, y, z);
  const r = 1 - Math.abs(v * 2 - 1);
  return r * r;
};
