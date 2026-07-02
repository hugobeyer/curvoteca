import { bindBufferInfo, type Renderer3DBufferInfo } from "./geometry3d";

const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aColor;
layout(location=2) in float aAlpha;

uniform mat4 uMvp;
uniform float uPointSize;

out vec3 vColor;
out float vAlpha;
out float vWorldY;

void main() {
  gl_Position = uMvp * vec4(aPos, 1.0);
  gl_PointSize = uPointSize;
  vColor = aColor;
  vAlpha = aAlpha;
  vWorldY = aPos.y;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 vColor;
in float vAlpha;
in float vWorldY;

uniform float uTime;
uniform float uShowScanline;

out vec4 outColor;

void main() {
  vec4 base = vec4(vColor, vAlpha);
  // Scanline glow — only on terrain (Y > 0.02), pseudo-bloom with tight+wide layers
  float scanY = (fract(uTime * 0.0004) * 2.0) - 1.0;
  float dist = abs(vWorldY - scanY);
  float tight = exp(-dist * 28.0);
  float bloom = exp(-dist * 6.0) * 0.42;
  float glow = (tight * 0.92 + bloom) * step(0.02, vWorldY);
  base.a += glow * uShowScanline;
  outColor = base;
}
`;

export type Renderer3DProgram = {
  program: WebGLProgram;
  uMvp: WebGLUniformLocation | null;
  uPointSize: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uShowScanline: WebGLUniformLocation | null;
};

export const createRenderer3DProgram = (
  gl: WebGL2RenderingContext,
): Renderer3DProgram | null => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(
      "[renderer3d] program link failed",
      gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    return null;
  }

  return {
    program,
    uMvp: gl.getUniformLocation(program, "uMvp"),
    uPointSize: gl.getUniformLocation(program, "uPointSize"),
    uTime: gl.getUniformLocation(program, "uTime"),
    uShowScanline: gl.getUniformLocation(program, "uShowScanline"),
  };
};

export const drawBufferInfo = (
  gl: WebGL2RenderingContext,
  info: Renderer3DBufferInfo | null,
  primitive: GLenum,
) => {
  if (!info || info.count <= 0) return;
  bindBufferInfo(gl, info);
  gl.drawArrays(primitive, 0, info.count);
};

const compileShader = (
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      "[renderer3d] shader compile failed",
      gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};
