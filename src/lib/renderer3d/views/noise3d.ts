import { addRenderer3DGrid, pushLine, pushTri, pushVertex } from "../geometry3d";
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
  supportedRenderModes: [
    "shaded",
    "wireframe",
    "graph",
    "ramp",
    "field",
    "heightstrip",
    "motion",
  ],
  build({ data, time, colors, tokens }) {
    const useCase = resolveNoiseUseCase(data.useCase);
    const renderMode = data.renderMode ?? "shaded";
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
    const mesh: number[] = [];

    addRenderer3DGrid(wire, colors, tokens.gridExtent, data.gridMode ?? "full");

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

    const wf = colors.curve;
    const c2 = colors.curve2;
    const lift = 0.012;
    const heightAlpha = (y: number) => clamp01((y - 0.04) / 1.0) * 0.7 + 0.15;

    if (renderMode === "graph") {
      addStructuralWires(wire, verts, gridSize, 6, wf, lift, heightAlpha);
    } else if (renderMode === "ramp") {
      // Normalize ramp by actual mesh height range
      let minY = Infinity, maxY = -Infinity;
      for (const v of verts) {
        if (v.p[1] < minY) minY = v.p[1];
        if (v.p[1] > maxY) maxY = v.p[1];
      }
      const ySpan = maxY - minY || 1;
      const colorFor = (v: typeof verts[number]) => {
        const t = clamp01((v.p[1] - minY) / ySpan);
        return [
          c2[0] * (1 - t) + wf[0] * t,
          c2[1] * (1 - t) + wf[1] * t,
          c2[2] * (1 - t) + wf[2] * t,
        ] as Vec3;
      };
      for (let z = 0; z < gridSize - 1; z += 1) {
        for (let x = 0; x < gridSize - 1; x += 1) {
          const a = verts[z * gridSize + x];
          const b = verts[z * gridSize + x + 1];
          const c = verts[(z + 1) * gridSize + x];
          const d = verts[(z + 1) * gridSize + x + 1];
          pushVertex(mesh, a.p, colorFor(a), 1);
          pushVertex(mesh, b.p, colorFor(b), 1);
          pushVertex(mesh, c.p, colorFor(c), 1);
          pushVertex(mesh, b.p, colorFor(b), 1);
          pushVertex(mesh, d.p, colorFor(d), 1);
          pushVertex(mesh, c.p, colorFor(c), 1);
        }
      }
      addStructuralWires(wire, verts, gridSize, 6, wf, lift, heightAlpha);
    } else if (renderMode === "heightstrip") {
      const bg = colors.bg;
      for (let z = 0; z < gridSize - 1; z += 1) {
        for (let x = 0; x < gridSize - 1; x += 1) {
          const a = verts[z * gridSize + x];
          const b = verts[z * gridSize + x + 1];
          const c = verts[(z + 1) * gridSize + x];
          const d = verts[(z + 1) * gridSize + x + 1];
          const colorFor = (v: typeof a) => {
            const t = clamp01(v.p[1] / 1.2);
            return [
              bg[0] * (1 - t) + wf[0] * t,
              bg[1] * (1 - t) + wf[1] * t,
              bg[2] * (1 - t) + wf[2] * t,
            ] as Vec3;
          };
          pushVertex(mesh, a.p, colorFor(a), 1);
          pushVertex(mesh, b.p, colorFor(b), 1);
          pushVertex(mesh, c.p, colorFor(c), 1);
          pushVertex(mesh, b.p, colorFor(b), 1);
          pushVertex(mesh, d.p, colorFor(d), 1);
          pushVertex(mesh, c.p, colorFor(c), 1);
        }
      }
      addStructuralWires(wire, verts, gridSize, 6, wf, lift, heightAlpha);
    } else if (renderMode === "motion") {
      // Invisible mesh — only scanline shader makes it visible
      for (let z = 0; z < gridSize - 1; z += 1) {
        for (let x = 0; x < gridSize - 1; x += 1) {
          const a = verts[z * gridSize + x];
          const b = verts[z * gridSize + x + 1];
          const c = verts[(z + 1) * gridSize + x];
          const d = verts[(z + 1) * gridSize + x + 1];
          pushVertex(mesh, a.p, wf, 0);
          pushVertex(mesh, b.p, wf, 0);
          pushVertex(mesh, c.p, wf, 0);
          pushVertex(mesh, b.p, wf, 0);
          pushVertex(mesh, d.p, wf, 0);
          pushVertex(mesh, c.p, wf, 0);
        }
      }
      const motionAlpha = (y: number) => heightAlpha(y) * 0.14;
      addStructuralWires(wire, verts, gridSize, 6, wf, lift, motionAlpha);
    } else {
      for (let z = 0; z < gridSize - 1; z += 1) {
        for (let x = 0; x < gridSize - 1; x += 1) {
          const a = verts[z * gridSize + x];
          const b = verts[z * gridSize + x + 1];
          const c = verts[(z + 1) * gridSize + x];
          const d = verts[(z + 1) * gridSize + x + 1];
          pushVertex(mesh, a.p, wf, tokens.shadedAlpha);
          pushVertex(mesh, b.p, wf, tokens.shadedAlpha);
          pushVertex(mesh, c.p, wf, tokens.shadedAlpha);
          pushVertex(mesh, b.p, wf, tokens.shadedAlpha);
          pushVertex(mesh, d.p, wf, tokens.shadedAlpha);
          pushVertex(mesh, c.p, wf, tokens.shadedAlpha);
        }
      }
      addStructuralWires(wire, verts, gridSize, 6, wf, lift, heightAlpha);
    }

    return { mesh, ghost: [], wire, points: [] };
  },
});

// Shared wireframe helper: draw grid lines at `step` interval plus thicker border outline
const addStructuralWires = (
  wire: number[],
  verts: { p: Vec3; value: number }[],
  gridSize: number,
  step: number,
  color: Vec3,
  lift: number,
  heightAlpha: (y: number) => number,
) => {
  const last = gridSize - 1;
  // Internal grid lines — X-parallel
  for (let z = 0; z < gridSize; z += step) {
    for (let x = 0; x < gridSize - 1; x += 1) {
      const a = verts[z * gridSize + x].p;
      const b = verts[z * gridSize + x + 1].p;
      const alpha = heightAlpha((a[1] + b[1]) / 2);
      pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], color, alpha);
    }
  }
  // Internal grid lines — Z-parallel
  for (let x = 0; x < gridSize; x += step) {
    for (let z = 0; z < gridSize - 1; z += 1) {
      const a = verts[z * gridSize + x].p;
      const b = verts[(z + 1) * gridSize + x].p;
      const alpha = heightAlpha((a[1] + b[1]) / 2);
      pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], color, alpha);
    }
  }
  // Border outline — 4 perimeter edges, higher alpha
  const borderAlpha = 0.55;
  for (let x = 0; x < last; x += 1) {
    const a = verts[x].p;
    const b = verts[x + 1].p;
    pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], color, borderAlpha);
    const c = verts[last * gridSize + x].p;
    const d = verts[last * gridSize + x + 1].p;
    pushLine(wire, [c[0], c[1] + lift, c[2]], [d[0], d[1] + lift, d[2]], color, borderAlpha);
  }
  for (let z = 0; z < last; z += 1) {
    const a = verts[z * gridSize].p;
    const b = verts[(z + 1) * gridSize].p;
    pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], color, borderAlpha);
    const c = verts[z * gridSize + last].p;
    const d = verts[(z + 1) * gridSize + last].p;
    pushLine(wire, [c[0], c[1] + lift, c[2]], [d[0], d[1] + lift, d[2]], color, borderAlpha);
  }
};

const resolveNoiseUseCase = (value: Renderer3DUseCase | undefined) => {
  const noise = value as string;
  if (noise === "domain-warp" || noise === "ridged-rock" || noise === "fbm-terrain" || noise === "ridged-multi" || noise === "voronoi-terrain" || noise === "hybrid-blend") return value as "fbm-terrain" | "domain-warp" | "ridged-rock" | "ridged-multi" | "voronoi-terrain" | "hybrid-blend";
  return "fbm-terrain" as const;
};

const sampleNoiseUseCase = (
  useCase: "fbm-terrain" | "domain-warp" | "ridged-rock" | "ridged-multi" | "voronoi-terrain" | "hybrid-blend",
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
  if (useCase === "ridged-multi") {
    return ridgedMulti3(u * 2.85 + 2, v * 2.85 + 9, z, seed);
  }
  if (useCase === "voronoi-terrain") {
    return voronoi3d(u * 3.2 + 6, v * 3.2 + 4, z, seed);
  }
  if (useCase === "hybrid-blend") {
    return hybridBlend3(u * 2.6 + 5, v * 2.6 + 8, z, seed);
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

const ridgedMulti3 = (x: number, y: number, z: number, seed: number) => {
  let result = 0;
  let amp = 0.6;
  let freq = 1.0;
  let weight = 0;
  for (let i = 0; i < 5; i += 1) {
    const offset = (seed + i * 7.3) * 0.17;
    const v = fbm3(x * freq + offset, y * freq, z * freq + offset);
    const ridge = 1 - Math.abs(v * 2 - 1);
    result += ridge * ridge * amp;
    weight += amp;
    amp *= 0.55;
    freq *= 2.1;
  }
  return result / weight;
};

const voronoi3d = (x: number, y: number, z: number, seed: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let best = 999;
  let second = 999;
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dz = -1; dz <= 1; dz += 1) {
        const cx = xi + dx + hash3(xi + dx + seed, yi + dy, zi + dz);
        const cy = yi + dy + hash3(xi + dx, yi + dy + seed * 1.3, zi + dz);
        const cz = zi + dz + hash3(xi + dx, yi + dy, zi + dz + seed * 1.7);
        const d = Math.hypot(x - cx, y - cy, z - cz);
        if (d < best) {
          second = best;
          best = d;
        } else if (d < second) {
          second = d;
        }
      }
    }
  }
  return second - best;
};

const hybridBlend3 = (x: number, y: number, z: number, seed: number) => {
  const f = fbm3(x, y, z);
  const r = 1 - Math.abs(fbm3(x * 1.7 + seed * 0.1, y * 1.7, z * 1.7) * 2 - 1);
  const t = smoothstep01((y + 1.2) / 2.4);
  return f * (1 - t) + r * r * t * 1.3;
};
