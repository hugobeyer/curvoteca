import type { Renderer3DColors } from "./colors3d";
import type { Vec3 } from "./math3d";

export type Renderer3DBufferInfo = {
  buffer: WebGLBuffer;
  count: number;
};

export const VERTEX_FLOATS = 7;

export const pushVertex = (
  out: number[],
  p: Vec3,
  c: Vec3,
  alpha = 1,
) => {
  out.push(p[0], p[1], p[2], c[0], c[1], c[2], alpha);
};

export const pushLine = (
  out: number[],
  a: Vec3,
  b: Vec3,
  c: Vec3,
  alpha: number,
) => {
  pushVertex(out, a, c, alpha);
  pushVertex(out, b, c, alpha);
};

export const pushTri = (
  out: number[],
  a: Vec3,
  b: Vec3,
  c: Vec3,
  color: Vec3,
  alpha: number,
) => {
  pushVertex(out, a, color, alpha);
  pushVertex(out, b, color, alpha);
  pushVertex(out, c, color, alpha);
};

export const createBufferInfo = (
  gl: WebGL2RenderingContext,
  data: readonly number[],
): Renderer3DBufferInfo | null => {
  if (data.length === 0) return null;
  const buffer = gl.createBuffer();
  if (!buffer) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return { buffer, count: data.length / VERTEX_FLOATS };
};

export const bindBufferInfo = (
  gl: WebGL2RenderingContext,
  info: Renderer3DBufferInfo,
) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, info.buffer);
  const stride = VERTEX_FLOATS * Float32Array.BYTES_PER_ELEMENT;
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
};

export const addRenderer3DGrid = (
  out: number[],
  colors: Renderer3DColors,
  size: number,
) => {
  const steps = 24;
  for (let i = -steps; i <= steps; i += 1) {
    const t = (i / steps) * size;
    const major = i % 4 === 0;
    const zero = i === 0;
    const color = zero ? colors.zero : major ? colors.grid : colors.subgrid;
    const alpha = zero ? 0.16 : major ? 0.04 : 0.016;
    pushLine(out, [-size, 0, t], [size, 0, t], color, alpha);
    pushLine(out, [t, 0, -size], [t, 0, size], color, alpha);
  }
};
