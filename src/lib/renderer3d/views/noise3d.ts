import {
  addRenderer3DGrid,
  pushLine,
  pushTri,
  pushVertex,
} from "../geometry3d";
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
    const gridSize = resolveGridSize(tokens, data.quality, data.params?.gridSize);
    const size = tokens.surfaceExtent;
    const mesh: number[] = [];
    const ghost: number[] = [];
    const wire: number[] = [];
    const points: number[] = [];
    const grid: number[] = [];
    const verts: { p: Vec3; value: number }[] = [];

    addRenderer3DGrid(grid, colors, tokens.gridExtent);

    for (let z = 0; z < gridSize; z += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        const u = (x / (gridSize - 1)) * 2 - 1;
        const v = (z / (gridSize - 1)) * 2 - 1;
        const value = sampleNoiseUseCase(useCase, u, v, time, data.params?.seed ?? 0);
        const falloff = useCase === "fbm-terrain"
          ? smoothstep01(1.25 - Math.hypot(u, v) * 0.76)
          : 1;
        const amp = useCase === "ridged-rock" ? 1.35 : useCase === "domain-warp" ? 1.05 : 1.14;
        verts.push({ p: [u * size, 0.04 + value * amp * falloff, v * size], value });
      }
    }

    const normalAt = (x: number, z: number): Vec3 => {
      const left = verts[z * gridSize + Math.max(0, x - 1)].p;
      const right = verts[z * gridSize + Math.min(gridSize - 1, x + 1)].p;
      const down = verts[Math.max(0, z - 1) * gridSize + x].p;
      const up = verts[Math.min(gridSize - 1, z + 1) * gridSize + x].p;
      return normalize3(cross3(sub3(up, down), sub3(right, left)));
    };

    const normals: Vec3[] = [];
    for (let z = 0; z < gridSize; z += 1) {
      for (let x = 0; x < gridSize; x += 1) normals.push(normalAt(x, z));
    }

    for (let z = 0; z < gridSize - 1; z += 1) {
      for (let x = 0; x < gridSize - 1; x += 1) {
        const i = z * gridSize + x;
        const a = verts[i];
        const b = verts[i + 1];
        const c = verts[i + gridSize];
        const d = verts[i + gridSize + 1];
        const ca = shadeColor(a.value, normals[i], useCase, colors.curve, colors.curve2);
        const cb = shadeColor(b.value, normals[i + 1], useCase, colors.curve, colors.curve2);
        const cc = shadeColor(c.value, normals[i + gridSize], useCase, colors.curve, colors.curve2);
        const cd = shadeColor(d.value, normals[i + gridSize + 1], useCase, colors.curve, colors.curve2);

        pushVertex(mesh, a.p, ca, tokens.shadedAlpha);
        pushVertex(mesh, b.p, cb, tokens.shadedAlpha);
        pushVertex(mesh, c.p, cc, tokens.shadedAlpha);
        pushVertex(mesh, b.p, cb, tokens.shadedAlpha);
        pushVertex(mesh, d.p, cd, tokens.shadedAlpha);
        pushVertex(mesh, c.p, cc, tokens.shadedAlpha);

        pushTri(ghost, a.p, b.p, c.p, ca, tokens.ghostAlpha);
        pushTri(ghost, b.p, d.p, c.p, cd, tokens.ghostAlpha);
      }
    }

    const lift = 0.012;
    for (let z = 0; z < gridSize; z += 1) {
      for (let x = 0; x < gridSize - 1; x += 1) {
        const a = verts[z * gridSize + x].p;
        const b = verts[z * gridSize + x + 1].p;
        const alpha = x % 4 === 0 || z % 4 === 0 ? tokens.wireAlpha : tokens.wireAlpha * 0.42;
        pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], colors.curve, alpha);
      }
    }

    for (let x = 0; x < gridSize; x += 1) {
      for (let z = 0; z < gridSize - 1; z += 1) {
        const a = verts[z * gridSize + x].p;
        const b = verts[(z + 1) * gridSize + x].p;
        const alpha = x % 4 === 0 || z % 4 === 0 ? tokens.wireAlpha : tokens.wireAlpha * 0.42;
        pushLine(wire, [a[0], a[1] + lift, a[2]], [b[0], b[1] + lift, b[2]], colors.curve, alpha);
      }
    }

    return { mesh, ghost, wire: [...grid, ...wire], points };
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

const shadeColor = (
  value: number,
  normal: Vec3,
  useCase: "fbm-terrain" | "domain-warp" | "ridged-rock",
  curve: Vec3,
  curve2: Vec3,
): Vec3 => {
  const light = normalize3([-0.45, 0.9, 0.35]);
  const ndl = clamp01(dot3(normal, light)) * 0.72 + 0.24;
  const orangeBias = useCase === "ridged-rock" ? 0.82 : useCase === "domain-warp" ? 0.68 : 0.58;
  const base = mix3(curve2, curve, clamp01(value * orangeBias + 0.18));
  return [base[0] * ndl, base[1] * ndl, base[2] * ndl];
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
  const h = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
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
