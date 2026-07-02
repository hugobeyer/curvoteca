import { readRenderer3DColors, type Renderer3DColors } from "./colors3d";
import { createRenderer3DControls, type Renderer3DControls } from "./controls3d";
import { createRenderer3DProgram, drawBufferInfo, type Renderer3DProgram } from "./gl3d";
import { createBufferInfo, type Renderer3DBufferInfo } from "./geometry3d";
import { lookAt, multiplyMat4, perspective } from "./math3d";
import { readRenderer3DTokens, type Renderer3DTokens } from "./tokens3d";
import type {
  Renderer3DData,
  Renderer3DGeometry,
  Renderer3DHandle,
  Renderer3DMountOptions,
  Renderer3DQuality,
  Renderer3DRenderMode,
  Renderer3DUseCase,
  Renderer3DView,
  Renderer3DViewId,
} from "./types";
import { createNoise3DView } from "./views/noise3d";
import { createPointCloudView } from "./views/pointCloud";

const THEME_EVENT = "curvoteca:theme-changed";

export const createDefaultRenderer3DViews = (): Renderer3DView[] => [
  createNoise3DView(),
  createPointCloudView(),
];

export const mountRenderer3D = (
  container: HTMLElement,
  options: Renderer3DMountOptions,
): Renderer3DHandle => {
  const canvas = options.canvas ?? ensureCanvas(container);
  const glContext = canvas.getContext("webgl2", { antialias: true, alpha: false });
  const programInfo = glContext ? createRenderer3DProgram(glContext) : null;
  const viewList = options.views?.length ? [...options.views] : createDefaultRenderer3DViews();
  const views = new Map<Renderer3DViewId, Renderer3DView>(
    viewList.map((view) => [view.id, view]),
  );

  if (!glContext || !programInfo) return createNoopRenderer3DHandle();
  const gl = glContext;
  const program = programInfo;

  let data: Renderer3DData = normalizeData(options.data, views);
  let colors: Renderer3DColors = readRenderer3DColors(container);
  let tokens: Renderer3DTokens = readRenderer3DTokens(container);
  let controls: Renderer3DControls | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let frame = 0;
  let geometryKey = "";
  let geometryBuffers: UploadedGeometry = emptyUploadedGeometry();
  let destroyed = false;

  const requestRender = () => {
    if (destroyed || frame) return;
    frame = requestAnimationFrame(render);
  };

  controls = createRenderer3DControls(canvas, requestRender);

  const readTheme = () => {
    colors = readRenderer3DColors(container);
    tokens = readRenderer3DTokens(container);
    geometryKey = "";
    requestRender();
  };

  const resize = () => {
    resizeCanvas(canvas, gl, tokens);
    requestRender();
  };

  const setData = (next: Partial<Renderer3DData>) => {
    data = normalizeData({ ...data, ...next, params: { ...data.params, ...next.params } }, views);
    geometryKey = "";
    requestRender();
  };

  const setView = (viewId: Renderer3DViewId, next?: Partial<Renderer3DData>) => {
    const view = views.get(viewId);
    if (!view) return;
    setData({
      ...next,
      viewId,
      useCase: next?.useCase ?? view.defaultUseCase,
      renderMode: next?.renderMode ?? view.defaultRenderMode,
    });
  };

  const setUseCase = (useCase: Renderer3DUseCase) => {
    setData({ useCase });
  };

  const setRenderMode = (renderMode: Renderer3DRenderMode) => {
    setData({ renderMode });
  };

  const setQuality = (quality: Renderer3DQuality) => {
    setData({ quality });
  };

  const destroy = () => {
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    resizeObserver?.disconnect();
    controls?.destroy();
    container.removeEventListener(THEME_EVENT, readTheme);
    disposeUploadedGeometry(gl, geometryBuffers);
    gl.deleteProgram(program.program);
    if (!options.canvas && canvas.parentElement === container) canvas.remove();
  };

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  }
  container.addEventListener(THEME_EVENT, readTheme);
  resizeCanvas(canvas, gl, tokens);
  requestRender();

  function render(time: number) {
    frame = 0;
    if (destroyed || !controls) return;

    resizeCanvas(canvas, gl, tokens);
    const view = views.get(data.viewId);
    if (!view) return;

    const nextGeometryKey = buildGeometryKey(data, time, tokens.animationStepMs);
    if (nextGeometryKey !== geometryKey) {
      const geometry = view.build({ data, time, colors, tokens });
      disposeUploadedGeometry(gl, geometryBuffers);
      geometryBuffers = uploadGeometry(gl, geometry);
      geometryKey = nextGeometryKey;
    }

    gl.clearColor(colors.bg[0], colors.bg[1], colors.bg[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program.program);
    gl.uniformMatrix4fv(program.uMvp, false, new Float32Array(cameraMvp(canvas, controls)));
    gl.uniform1f(program.uPointSize, 4.2 * currentDpr(tokens));

    drawBufferInfo(gl, geometryBuffers.wire, gl.LINES);

    const renderMode = data.renderMode ?? view.defaultRenderMode;
    if (renderMode === "wireframe") {
      drawBufferInfo(gl, geometryBuffers.ghost, gl.TRIANGLES);
      gl.disable(gl.DEPTH_TEST);
      drawBufferInfo(gl, geometryBuffers.wire, gl.LINES);
      gl.enable(gl.DEPTH_TEST);
    } else if (renderMode === "points") {
      drawBufferInfo(gl, geometryBuffers.points, gl.POINTS);
    } else {
      drawBufferInfo(gl, geometryBuffers.mesh, gl.TRIANGLES);
      drawBufferInfo(gl, geometryBuffers.points, gl.POINTS);
      drawBufferInfo(gl, geometryBuffers.wire, gl.LINES);
    }

    if (data.params?.animate !== false) requestRender();
  }

  return { destroy, resize, setData, setView, setUseCase, setRenderMode, setQuality };
};

type UploadedGeometry = {
  mesh: Renderer3DBufferInfo | null;
  ghost: Renderer3DBufferInfo | null;
  wire: Renderer3DBufferInfo | null;
  points: Renderer3DBufferInfo | null;
};

const ensureCanvas = (container: HTMLElement) => {
  const existing = container.querySelector<HTMLCanvasElement>("[data-renderer3d-canvas]");
  if (existing) return existing;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-renderer3d-canvas", "");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.append(canvas);
  return canvas;
};

const normalizeData = (
  data: Renderer3DData,
  views: ReadonlyMap<Renderer3DViewId, Renderer3DView>,
): Renderer3DData => {
  const view = views.get(data.viewId) ?? [...views.values()][0];
  const requestedRenderMode = data.renderMode ?? view.defaultRenderMode;
  const renderMode = view.supportedRenderModes.includes(requestedRenderMode)
    ? requestedRenderMode
    : view.defaultRenderMode;
  return {
    ...data,
    viewId: view.id,
    useCase: data.useCase ?? view.defaultUseCase,
    renderMode,
    quality: data.quality ?? "detail",
    params: data.params ?? {},
  };
};

const resizeCanvas = (
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
  tokens: Renderer3DTokens,
) => {
  const dpr = currentDpr(tokens);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
};

const currentDpr = (tokens: Renderer3DTokens) =>
  Math.max(tokens.dprMin, Math.min(tokens.dprMax, window.devicePixelRatio || tokens.dprMin));

const cameraMvp = (canvas: HTMLCanvasElement, controls: Renderer3DControls) => {
  const { yaw, pitch, distance, target } = controls.camera;
  const eye = [
    Math.sin(yaw) * Math.cos(pitch) * distance,
    Math.sin(pitch) * distance,
    Math.cos(yaw) * Math.cos(pitch) * distance,
  ] as const;
  const aspect = canvas.width / Math.max(1, canvas.height);
  return multiplyMat4(
    perspective(Math.PI / 4.15, aspect, 0.05, 80),
    lookAt(eye, target, [0, 1, 0]),
  );
};

const buildGeometryKey = (
  data: Renderer3DData,
  time: number,
  animationStepMs: number,
) => {
  const step = data.params?.animate === false ? 0 : Math.floor(time / animationStepMs);
  return JSON.stringify({
    viewId: data.viewId,
    useCase: data.useCase,
    quality: data.quality,
    params: data.params,
    step,
  });
};

const uploadGeometry = (
  gl: WebGL2RenderingContext,
  geometry: Renderer3DGeometry,
): UploadedGeometry => ({
  mesh: createBufferInfo(gl, geometry.mesh),
  ghost: createBufferInfo(gl, geometry.ghost),
  wire: createBufferInfo(gl, geometry.wire),
  points: createBufferInfo(gl, geometry.points),
});

const emptyUploadedGeometry = (): UploadedGeometry => ({
  mesh: null,
  ghost: null,
  wire: null,
  points: null,
});

const disposeUploadedGeometry = (
  gl: WebGL2RenderingContext,
  geometry: UploadedGeometry,
) => {
  if (geometry.mesh) gl.deleteBuffer(geometry.mesh.buffer);
  if (geometry.ghost) gl.deleteBuffer(geometry.ghost.buffer);
  if (geometry.wire) gl.deleteBuffer(geometry.wire.buffer);
  if (geometry.points) gl.deleteBuffer(geometry.points.buffer);
};

const createNoopRenderer3DHandle = (): Renderer3DHandle => ({
  destroy() {},
  resize() {},
  setData() {},
  setView() {},
  setUseCase() {},
  setRenderMode() {},
  setQuality() {},
});
