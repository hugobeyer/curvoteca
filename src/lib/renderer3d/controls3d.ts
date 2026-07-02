import type { Vec3 } from "./math3d";

export type Renderer3DCameraState = {
  yaw: number;
  pitch: number;
  distance: number;
  target: [number, number, number];
};

export const DEFAULT_CAMERA_STATE: Renderer3DCameraState = {
  yaw: -0.7,
  pitch: 0.66,
  distance: 8,
  target: [0, 0.25, 0],
};

export type Renderer3DControls = {
  camera: Renderer3DCameraState;
  reset: () => void;
  destroy: () => void;
};

export const createRenderer3DControls = (
  canvas: HTMLCanvasElement,
  requestRender: () => void,
): Renderer3DControls => {
  const camera: Renderer3DCameraState = {
    ...DEFAULT_CAMERA_STATE,
    target: [...DEFAULT_CAMERA_STATE.target],
  };

  let dragging = false;
  let dragButton = -1;
  let hasMoved = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 && event.button !== 1 && event.button !== 2) return;
    event.preventDefault();
    event.stopPropagation();
    dragging = true;
    dragButton = event.button;
    hasMoved = false;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    event.preventDefault();
    event.stopPropagation();
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved = true;
    lastX = event.clientX;
    lastY = event.clientY;
    if (dragButton === 0) {
      // LMB = orbit (trackball)
      camera.yaw -= dx * 0.006;
      camera.pitch = Math.max(0.16, Math.min(1.25, camera.pitch + dy * 0.004));
    } else if (dragButton === 1) {
      // MMB = translate camera on its local X (right) and Y (up)
      const cp = Math.cos(camera.pitch);
      const sp = Math.sin(camera.pitch);
      const cy = Math.cos(camera.yaw);
      const sy = Math.sin(camera.yaw);
      // Camera-local right and up vectors (normalized)
      const rx = -cy,
        ry = 0,
        rz = sy;
      const ux = -sp * sy,
        uy = cp,
        uz = -sp * cy;
      const s = 0.004;
      camera.target[0] += (dx * rx + dy * ux) * s;
      camera.target[1] += (dx * ry + dy * uy) * s;
      camera.target[2] += (dx * rz + dy * uz) * s;
      const limit = 2;
      for (let i = 0; i < 3; i++) {
        if (camera.target[i] > limit) camera.target[i] = limit;
        if (camera.target[i] < -limit) camera.target[i] = -limit;
      }
    } else if (dragButton === 2) {
      // RMB = zoom
      camera.distance = Math.max(
        2.4,
        Math.min(20, camera.distance + dy * 0.02),
      );
    }
    requestRender();
  };

  const onPointerEnd = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragging = false;
    dragButton = -1;
    // If no drag happened, forward click to parent card's detail link
    if (!hasMoved) {
      const card = canvas.closest(".card");
      if (card) {
        const link = card.querySelector(
          "[data-open-detail]",
        ) as HTMLElement | null;
        if (link) link.click();
      }
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  canvas.addEventListener("pointerup", onPointerEnd, { passive: false });
  canvas.addEventListener("pointercancel", onPointerEnd, { passive: false });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  return {
    camera,
    reset() {
      camera.yaw = DEFAULT_CAMERA_STATE.yaw;
      camera.pitch = DEFAULT_CAMERA_STATE.pitch;
      camera.distance = DEFAULT_CAMERA_STATE.distance;
      camera.target[0] = DEFAULT_CAMERA_STATE.target[0];
      camera.target[1] = DEFAULT_CAMERA_STATE.target[1];
      camera.target[2] = DEFAULT_CAMERA_STATE.target[2];
      requestRender();
    },
    destroy() {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
    },
  };
};
