export type Vec3 = readonly [number, number, number];
export type Mat4 = readonly number[];

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const smoothstep01 = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

export const mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export const sub3 = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];

export const cross3 = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

export const dot3 = (a: Vec3, b: Vec3) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const normalize3 = (v: Vec3): Vec3 => {
  const d = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / d, v[1] / d, v[2] / d];
};

export const perspective = (
  fovy: number,
  aspect: number,
  near: number,
  far: number,
): Mat4 => {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * nf,
    -1,
    0,
    0,
    2 * far * near * nf,
    0,
  ];
};

export const lookAt = (eye: Vec3, center: Vec3, up: Vec3): Mat4 => {
  const z = normalize3(sub3(eye, center));
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  return [
    x[0],
    y[0],
    z[0],
    0,
    x[1],
    y[1],
    z[1],
    0,
    x[2],
    y[2],
    z[2],
    0,
    -dot3(x, eye),
    -dot3(y, eye),
    -dot3(z, eye),
    1,
  ];
};

export const multiplyMat4 = (a: Mat4, b: Mat4): Mat4 => {
  const out = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
};
