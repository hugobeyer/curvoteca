import type {
  Renderer3DData,
  Renderer3DHandle,
  Renderer3DParams,
  Renderer3DQuality,
  Renderer3DRenderMode,
  Renderer3DUseCase,
  Renderer3DViewId,
} from "./renderer3d";

const ROOT_SELECTOR = "[data-renderer3d-root]";

const DEBUG_RENDERER3D = false;
const debugLog = (...args: unknown[]) => {
  if (DEBUG_RENDERER3D) console.log("[renderer3d]", ...args);
};

type Renderer3DWindow = Window & {
  __curvotecaInitRenderer3DViewports?: (scope?: ParentNode) => void;
  __curvotecaDestroyRenderer3DViewports?: (scope?: ParentNode) => void;
};

const mounted = new WeakMap<HTMLElement, Renderer3DHandle>();
const observed = new WeakSet<HTMLElement>();
let observer: IntersectionObserver | null = null;
let listenersReady = false;

export const bindGlobalListeners = () => {
  if (listenersReady || typeof window === "undefined") return;
  listenersReady = true;
  const wnd = window as Renderer3DWindow;
  wnd.__curvotecaInitRenderer3DViewports = initRenderer3DViewports;
  wnd.__curvotecaDestroyRenderer3DViewports = destroyRenderer3DViewports;
  document.addEventListener("curvoteca:renderer3d-views-changed", (event) => {
    const scope = event instanceof CustomEvent ? event.detail?.scope : null;
    initRenderer3DViewports(toParentNode(scope));
  });
  window.addEventListener("pagehide", () => {
    destroyRenderer3DViewports(document);
  });
};

export const initRenderer3DViewports = (scope: ParentNode = document) => {
  bindGlobalListeners();
  const roots = scope.querySelectorAll<HTMLElement>(ROOT_SELECTOR);
  debugLog("init: found", roots.length, "root(s) in scope");
  roots.forEach(observeRoot);
};

export const destroyRenderer3DViewports = (scope: ParentNode = document) => {
  scope.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach(destroyRoot);
};

const observeRoot = (root: HTMLElement) => {
  if (observed.has(root)) return;
  observed.add(root);
  debugLog("observeRoot:", root.dataset.renderer3dId);

  // Direct mount if the element is already inside the viewport.
  // Off-screen cards (e.g. scrolled above y:0) still have non-zero
  // dimensions, so we check viewport overlap to avoid exhausting
  // WebGL contexts by mounting too many at once.
  const rect = root.getBoundingClientRect();
  if (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom >= 0 &&
    rect.top <= (typeof window !== "undefined" ? window.innerHeight : 0)
  ) {
    debugLog("observeRoot: direct mount (in viewport)");
    void mountRoot(root);
  }

  if (typeof IntersectionObserver === "undefined") return;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const root = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            debugLog("IntersectionObserver: visible -> mount");
            void mountRoot(root);
          } else {
            debugLog("IntersectionObserver: hidden -> destroy");
            destroyRoot(root);
          }
        });
      },
      { threshold: 0 },
    );
  }
  observer.observe(root);
};

const mountRoot = async (root: HTMLElement) => {
  if (mounted.has(root) || !root.isConnected) {
    debugLog("mountRoot: skip (already mounted or disconnected)");
    return;
  }
  const id = root.dataset.renderer3dId || "?";
  debugLog("mountRoot: mounting", id);
  const { mountRenderer3D } = await import("./renderer3d");
  if (mounted.has(root) || !root.isConnected) {
    debugLog("mountRoot: skip (mounted during async import)");
    return;
  }
  const canvas = root.querySelector<HTMLCanvasElement>(
    "[data-renderer3d-canvas]",
  );
  debugLog("mountRoot: canvas found?", !!canvas);
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    debugLog("mountRoot: canvas rect", rect.width, "x", rect.height);
  }
  const data = readRenderer3DData(root);
  // Column-based grid size override (set by gallery grid cycle)
  const colGrid = root.getAttribute("data-renderer3d-gridsize");
  if (colGrid) {
    const n = Number(colGrid);
    if (n > 0) data.params = { ...data.params, gridSize: n };
  }
  // Scale LOD by pager size (smaller cards = less geo)
  if (!data.params?.lod) {
    try {
      const pager = Number(localStorage.getItem("curvoteca:pager-size")) || 48;
      data.params = { ...data.params, lod: pager };
    } catch {}
  }
  debugLog(
    "mountRoot: viewId=",
    data.viewId,
    "useCase=",
    data.useCase,
    "mode=",
    data.renderMode,
    "quality=",
    data.quality,
  );
  const handle = mountRenderer3D(root, {
    data,
    canvas: canvas ?? undefined,
  });
  mounted.set(root, handle);
  // Expose for grid cycle wiring in CurveGalleryShell
  (root as unknown as Record<string, unknown>).__r3dh = handle;
};

const destroyRoot = (root: HTMLElement) => {
  const handle = mounted.get(root);
  if (!handle) return;
  handle.destroy();
  mounted.delete(root);
};

const readRenderer3DData = (root: HTMLElement): Renderer3DData => ({
  id: root.dataset.renderer3dId || "renderer3d",
  viewId: readViewId(root.dataset.renderer3dView),
  useCase: readUseCase(root.dataset.renderer3dUseCase),
  renderMode: readRenderMode(root.dataset.renderer3dRenderMode),
  quality: readQuality(root.dataset.renderer3dQuality),
  gridMode: readGridMode(root.dataset.renderer3dGridMode),
  params: readParams(root.dataset.renderer3dParams),
});

const readViewId = (value: string | undefined): Renderer3DViewId =>
  value === "pointcloud" ? "pointcloud" : "noise3d";

const readUseCase = (
  value: string | undefined,
): Renderer3DUseCase | undefined => {
  if (
    value === "fbm-terrain" ||
    value === "domain-warp" ||
    value === "ridged-rock" ||
    value === "ridged-multi" ||
    value === "voronoi-terrain" ||
    value === "hybrid-blend" ||
    value === "gerstner-waves" ||
    value === "scatter-volume" ||
    value === "density-shell"
  ) {
    return value;
  }
  return undefined;
};

const readRenderMode = (
  value: string | undefined,
): Renderer3DRenderMode | undefined => {
  if (
    value === "shaded" ||
    value === "wireframe" ||
    value === "points" ||
    value === "graph" ||
    value === "ramp" ||
    value === "field" ||
    value === "heightstrip" ||
    value === "motion"
  ) {
    return value;
  }
  return undefined;
};

const readQuality = (
  value: string | undefined,
): Renderer3DQuality | undefined => {
  if (value === "card" || value === "detail" || value === "high") {
    return value;
  }
  return undefined;
};

const readGridMode = (
  value: string | undefined,
): "full" | "lines" | "axis" | undefined => {
  if (value === "lines" || value === "axis") return value;
  return "full";
};

const readParams = (value: string | undefined): Renderer3DParams => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    return {};
  }
};

const toParentNode = (scope?: ParentNode | Node | null): ParentNode => {
  if (
    scope instanceof Element ||
    scope instanceof Document ||
    scope instanceof DocumentFragment
  ) {
    return scope;
  }
  return document;
};
