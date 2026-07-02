import type { Vec3 } from "./math3d";

export type Renderer3DCameraState = {
  yaw: number;
  pitch: number;
  distance: number;
  target: Vec3;
};

export type Renderer3DControls = {
  camera: Renderer3DCameraState;
  destroy: () => void;
};

export const createRenderer3DControls = (
  canvas: HTMLCanvasElement,
  requestRender: () => void,
): Renderer3DControls => {
  const camera: Renderer3DCameraState = {
    yaw: -0.7,
    pitch: 0.66,
    distance: 5.1,
    target: [0, 0.56, 0],
  };

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    camera.yaw += dx * 0.006;
    camera.pitch = Math.max(0.16, Math.min(1.25, camera.pitch + dy * 0.004));
    requestRender();
  };

  const onPointerEnd = () => {
    dragging = false;
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    camera.distance = Math.max(2.4, Math.min(8.5, camera.distance + event.deltaY * 0.004));
    requestRender();
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", onPointerEnd);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  return {
    camera,
    destroy() {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      canvas.removeEventListener("wheel", onWheel);
    },
  };
};
