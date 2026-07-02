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

type Renderer3DWindow = Window & {
  __curvotecaInitRenderer3DViewports?: (scope?: ParentNode) => void;
  __curvotecaDestroyRenderer3DViewports?: (scope?: ParentNode) => void;
};

const mounted = new WeakMap<HTMLElement, Renderer3DHandle>();
const observed = new WeakSet<HTMLElement>();
let observer: IntersectionObserver | null = null;
let listenersReady = false;

export const initRenderer3DViewports = (scope: ParentNode = document) => {
  bindGlobalListeners();
  scope.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach(observeRoot);
};

export const destroyRenderer3DViewports = (scope: ParentNode = document) => {
  scope.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach(destroyRoot);
};

const observeRoot = (root: HTMLElement) => {
  if (observed.has(root)) return;
  observed.add(root);
  if (typeof IntersectionObserver === "undefined") {
    void mountRoot(root);
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const root = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            void mountRoot(root);
          } else {
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
  if (mounted.has(root) || !root.isConnected) return;
  const { mountRenderer3D } = await import("./renderer3d");
  if (mounted.has(root) || !root.isConnected) return;
  const canvas = root.querySelector<HTMLCanvasElement>(
    "[data-renderer3d-canvas]",
  );
  const handle = mountRenderer3D(root, {
    data: readRenderer3DData(root),
    canvas: canvas ?? undefined,
  });
  mounted.set(root, handle);
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
  if (value === "shaded" || value === "wireframe" || value === "points") {
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

const readParams = (value: string | undefined): Renderer3DParams => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    return {};
  }
};

const bindGlobalListeners = () => {
  if (listenersReady || typeof window === "undefined") return;
  listenersReady = true;
  const wnd = window as Renderer3DWindow;
  wnd.__curvotecaInitRenderer3DViewports = initRenderer3DViewports;
  wnd.__curvotecaDestroyRenderer3DViewports = destroyRenderer3DViewports;
  document.addEventListener("curvoteca:renderer3d-views-changed", (event) => {
    const scope = (event as CustomEvent).detail?.scope;
    initRenderer3DViewports(scope instanceof Node ? scope : document);
  });
  window.addEventListener("pagehide", () => {
    destroyRenderer3DViewports(document);
  });
};
