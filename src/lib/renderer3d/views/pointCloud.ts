import { addRenderer3DGrid, pushLine, pushVertex } from "../geometry3d";
import { mix3, smoothstep01, type Vec3 } from "../math3d";
import { resolvePointCount } from "../tokens3d";
import type { Renderer3DGeometry, Renderer3DUseCase, Renderer3DView } from "../types";

export const createPointCloudView = (): Renderer3DView => ({
  id: "pointcloud",
  defaultUseCase: "scatter-volume",
  defaultRenderMode: "points",
  supportedRenderModes: ["points", "wireframe"],
  build({ data, time, colors, tokens }) {
    const useCase = resolvePointUseCase(data.useCase);
    const count = resolvePointCount(tokens, data.quality, data.params?.pointCount);
    const seed = data.params?.seed ?? 0;
    const mesh: number[] = [];
    const ghost: number[] = [];
    const wire: number[] = [];
    const points: number[] = [];
    const grid: number[] = [];
    const extent = tokens.surfaceExtent * 0.92;

    addRenderer3DGrid(grid, colors, tokens.gridExtent);

    for (let i = 0; i < count; i += 1) {
      const px = randomSigned(i, seed, 0) * extent;
      const py = randomSigned(i, seed, 1) * 1.42 + 0.72;
      const pz = randomSigned(i, seed, 2) * extent;
      const radius = Math.hypot(px / extent, (py - 0.72) / 1.42, pz / extent);
      const density = useCase === "density-shell"
        ? smoothstep01(1.12 - Math.abs(radius - 0.72) * 2.8)
        : smoothstep01(1.18 - radius);
      if (density <= 0.04) continue;

      const c = mix3(colors.curve2, colors.curve, density * 0.86 + 0.12);
      pushVertex(points, [px, py, pz], c, 0.18 + density * 0.72);

      if (i % 17 === 0) {
        const floor: Vec3 = [px, 0.02, pz];
        pushLine(wire, floor, [px, py, pz], colors.curve, 0.08 + density * 0.2);
      }
    }

    if (useCase === "density-shell") {
      addShellRings(wire, colors.curve, 1.62, 0.74, 0.2);
    }

    return { mesh, ghost, wire: [...grid, ...wire], points } satisfies Renderer3DGeometry;
  },
});

const resolvePointUseCase = (value: Renderer3DUseCase | undefined) =>
  value === "density-shell" || value === "scatter-volume"
    ? value
    : "scatter-volume";

const random01 = (i: number, seed: number, channel: number) => {
  const n = Math.sin((i + 1) * 127.1 + seed * 311.7 + channel * 74.7) * 43758.5453123;
  return n - Math.floor(n);
};

const randomSigned = (i: number, seed: number, channel: number) =>
  random01(i, seed, channel) * 2 - 1;

const addShellRings = (
  wire: number[],
  color: Vec3,
  radius: number,
  height: number,
  alpha: number,
) => {
  const sides = 96;
  for (let ring = -1; ring <= 1; ring += 1) {
    const y = height + ring * 0.58;
    let prev: Vec3 | null = null;
    for (let i = 0; i <= sides; i += 1) {
      const a = (i / sides) * Math.PI * 2;
      const p: Vec3 = [Math.cos(a) * radius, y, Math.sin(a) * radius];
      if (prev) pushLine(wire, prev, p, color, alpha);
      prev = p;
    }
  }
};
