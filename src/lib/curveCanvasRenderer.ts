// ---------------------------------------------------------------------------
// curveCanvasRenderer.ts
// The runtime canvas renderer for a single curve card. Composes the
// focused `renderer/*` modules (grid, bounds, quad, curve stroke,
// probe tooltip, colors, tokens, effects) into one `renderCurveToCanvas`
// entry point that the wall, compare tray, and detail viewport all call.
// Owns the canvas-tiling math (wrap modes) and the per-curve viewport
// state that the rest of the app stores in localStorage.
// ---------------------------------------------------------------------------

import {
  getTileMetrics,
  getVisibleWorldRect,
  parseViewBox,
  worldToScreen,
  type CurvePoint,
  type CurveRect,
  type CurveViewportState,
} from "./curveViewportMath";
import type { CurveViewMode } from "../data/curves";
import { readColors, type RendererColors } from "./renderer/colors";
import { readTokens, type RendererTokens } from "./renderer/tokens";
import { readEffects, type EffectValues } from "./renderer/effects";
import { drawCurve, parseSampledPoints } from "./renderer/curve";
import {
  readRampColors,
  readRampTokens,
  renderRamp,
} from "./renderer/views/ramp";
import { renderField } from "./renderer/views/field";
import { renderHeightStrip } from "./renderer/views/heightStrip";
import { drawGridLines } from "./renderer/gridLines";
import { buildEdgeMaskPair, type EdgeMaskPair } from "./renderer/edgeFade";
import { drawBounds, drawZeroLines } from "./renderer/bounds";
import { drawAxisLabels } from "./renderer/labels";
import { drawCursor } from "./renderer/cursor";
import { resetCtx } from "./renderer/ctxState";
import { drawViewportQuad } from "./renderer/quad";
import {
  buildProbe,
  computeProbeAlpha,
  computeProbePhase,
  drawProbe,
  updateProbeText,
  type ProbeState,
} from "./renderer/probe";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THEME_EVENT = "curvoteca:theme-changed";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ViewGridMode = "full" | "lines" | "axis";

export const VIEW_GRID_MODES: readonly ViewGridMode[] = [
  "full",
  "lines",
  "axis",
];

export type CurveRenderer = {
  mount(root: HTMLElement): void;
  update(state: CurveViewportState): void;
  render(): void;
  setProbe(clientX: number, clientY: number): void;
  clearProbe(): void;
  setViewportVisible(visible: boolean): void;
  setColumnCount(c: number): void;
  /**
   * Cycle the canvas viewport grid display. Three modes:
   *   - "full"  : major grid + subgrid + axis labels + 0..1 frame box
   *              + endlines (default)
   *   - "lines" : major grid + axis labels only (no subgrid, no
   *              frame, no endlines)
   *   - "axis"  : zero/axis lines only (no labels, no grid, no frame)
   * Off-viewport cards store the mode and apply it on the next
   * in-viewport render.
   */
  setViewGridMode(mode: ViewGridMode): void;
  /**
   * Notify the renderer that the view mode changed (e.g. the user
   * clicked the cycle button). The renderer re-reads the
   * `data-curve-view-mode` attribute on the next renderStatic. The
   * call is a no-op for off-viewport cards.
   */
  notifyViewModeChanged(): void;
  destroy(): void;
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export const createCurveCanvasRenderer = (
  initialRoot: HTMLElement,
): CurveRenderer => {
  let root = initialRoot;
  let canvas = root.querySelector<HTMLCanvasElement>("[data-curve-canvas]");
  if (!canvas) {
    // Authoring bug: the card's template is missing the canvas slot. We
    // still create one and prepend it so the page keeps working, but warn
    // so a human notices.
    console.warn(
      "[curveCanvasRenderer] missing [data-curve-canvas] on root; creating one",
      root,
    );
    canvas = document.createElement("canvas");
    canvas.setAttribute("data-curve-canvas", "");
    canvas.setAttribute("aria-hidden", "true");
    root.prepend(canvas);
  }

  const baseRect = parseViewBox(root.getAttribute("data-curve-view-default"));
  const sourcePoints = root.getAttribute("data-curve-points") || "";
  const points = parseSampledPoints(sourcePoints);
  const metrics = getTileMetrics(points, baseRect);
  const domain = parseInterval(root.getAttribute("data-curve-domain"));
  const range = parseInterval(root.getAttribute("data-curve-range"));

  let state: CurveViewportState = {
    zoomX: 1,
    zoomY: 1,
    centerX: 0.5,
    centerY: 0.5,
    wrapMode: "clamp",
  };
  let visible: CurveRect = getVisibleWorldRect(baseRect, state);
  let colors: RendererColors = readColors(root);
  let tokens: RendererTokens = readTokens(root);
  let effects: EffectValues = readEffects(root);
  let probe: ProbeState | null = null;
  // Mouse position in CSS px relative to the canvas, or null when the
  // pointer has left the card. Captured from setProbe() (called on every
  // mousemove) and cleared by clearProbe() (called on mouseleave). Drives
  // the custom canvas cursor — see drawCursor.
  let mouse: { x: number; y: number } | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let onThemeChange: (() => void) | null = null;
  let frame = 0;
  let staticCanvas: HTMLCanvasElement | null = null;
  let staticCtx: CanvasRenderingContext2D | null = null;
  // Bg + viewport quad are rendered to a separate canvas that does NOT
  // receive the edge-fade mask, so the inside-viewBox tint stays solid
  // even where the grid/curve dissolve at the canvas edges.
  let bgCanvas: HTMLCanvasElement | null = null;
  let bgCtx: CanvasRenderingContext2D | null = null;
  // Cached full composite (bg + static blitted together) that the live
  // canvas can re-use unchanged across frames. Rebuilt by renderStatic
  // whenever the underlying layers are rebuilt; between rebuilds the
  // per-frame render() can blit this one canvas instead of doing the
  // drawImage(bg) + drawImage(static) two-step every frame. The win is
  // largest during a probe appear/disappear ramp, where bg+static pixels
  // are identical frame-to-frame but the composite was being re-blitted.
  let compositeCanvas: HTMLCanvasElement | null = null;
  let compositeCtx: CanvasRenderingContext2D | null = null;
  let needsStaticRedraw = true;
  // Cached canvas CSS size + backing-store DPR. Refreshed by the resize
  // observer so per-frame render() doesn't have to call
  // getBoundingClientRect() (which can force a layout flush on dirty
  // pages). null until the first resize callback lands.
  let cachedRect: { width: number; height: number } | null = null;
  // True after a full composite (bg + static) has been blitted to the live
  // canvas for the current size/state, AND no probe/cursor/ramp is in
  // flight. When true, render() is a no-op.
  let liveCanvasClean = false;
  // True when the card is inside the wall's scroll viewport. Set by the
  // page-level IntersectionObserver. When false, setProbe() and the
  // per-frame overlay work are skipped, and the probe DOM classes are
  // stripped. The static layer is still blitted on resize/state changes
  // so the card is correct when scrolled back into view.
  let inViewport = true;
  // Current column count of the wall grid (1..8). The label density
  // is handled recursively inside drawAxisLabels (it picks fewer
  // ticks as the card gets smaller, down to just "0" and "1"). The
  // probe is suppressed at high column counts (see setProbe).
  // Default 1 = full UI; mount() reads the live value from the grid.
  const PROBE_COL_THRESHOLD = 2;
  let columnCount = 1;
  // Canvas viewport grid display mode. Default "full" (grid + subgrid +
  // labels + frame + endlines). The bottom-bar view-grid button cycles
  // through "full" -> "lines" -> "axis" -> "full". Honored inside
  // renderStatic so the suppressed draws are skipped entirely.
  let viewGridMode: ViewGridMode = "full";
  // Cached pair of 1D edge-fade masks (horizontal + vertical), rebuilt on
  // resize or when the fade width / DPR change. Applied as two sequential
  // destination-in passes at the end of renderStatic. Stored as canvases
  // (not files) so the GPU can blit them stretched with bilinear filtering
  // — no per-line alpha math needed.
  let maskPair: EdgeMaskPair | null = null;
  let maskKey: string | null = null;

  let ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      mount() {},
      update(next) {
        state = next;
      },
      render() {},
      setProbe() {},
      clearProbe() {},
      setViewportVisible() {},
      setColumnCount() {},
      setViewGridMode() {},
      notifyViewModeChanged() {},
      destroy() {},
    };
  }

  // ---- private helpers ---------------------------------------------------

  const setViewportVisible = (next: boolean) => {
    if (inViewport === next) return;
    inViewport = next;
    if (!inViewport) {
      // Out of viewport: kill the active probe + cursor so we don't
      // leave a stale readout or crosshair pinned to the last position.
      // The canvas pixels are still valid; the cached composite stays
      // until a state change forces a redraw.
      probe = null;
      mouse = null;
      clearProbeDom();
      // render() now early-returns on !inViewport, so the canvas stays
      // as-is until setViewportVisible(true) forces a rebuild.
    } else {
      // Back in viewport: the static layer may be stale (theme change,
      // resize, state change while we were gone). Force a redraw.
      needsStaticRedraw = true;
      liveCanvasClean = false;
      requestRender();
    }
  };

  const setCanvasSize = () => {
    // Read the rect live on the first call (before the ResizeObserver has
    // fired) and on every call after that — the cache is only used as a
    // fast path. The cache is authoritative once written by refreshRect.
    const dpr = currentDpr();
    const rect = cachedRect ?? canvas!.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas!.width !== width || canvas!.height !== height) {
      canvas!.width = width;
      canvas!.height = height;
      // Backing store changed; anything we cached as "already on the
      // live canvas" is gone. Mark dirty so the next render() does a
      // full blit instead of skipping with a blank buffer.
      liveCanvasClean = false;
    }
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: rect.width, height: rect.height };
  };

  // Refresh the cached CSS rect + DPR. Called from the ResizeObserver and
  // any other path that knows the size changed. Falls back to a live
  // getBoundingClientRect() — which is what the observer is firing for
  // anyway, so we're not avoiding layout here, we're avoiding it on the
  // per-frame render() path.
  const refreshRect = () => {
    const rect = canvas!.getBoundingClientRect();
    cachedRect = { width: rect.width, height: rect.height };
  };

  // Read DPR the same way setCanvasSize does. Pulled out so the mask and
  // the canvas always agree on the backing-store scale.
  const currentDpr = () =>
    Math.max(
      tokens.dprMin,
      Math.min(tokens.dprMax, window.devicePixelRatio || tokens.dprMin),
    );

  // (Re)build the 1D edge-fade mask pair if the size, DPR, or fade width
  // has changed since last build. The horizontal mask (width×1) is
  // stretched to height by the GPU; the vertical mask (1×height) is
  // stretched to width. Together they fade all four edges.
  const ensureEdgeMasks = (
    screen: { width: number; height: number },
    dpr: number,
  ): EdgeMaskPair | null => {
    if (tokens.edgeFade <= 0) return null;
    const key = `${Math.round(screen.width)}x${Math.round(screen.height)}@${dpr.toFixed(2)}:${tokens.edgeFade}:${tokens.edgeFadeInset}`;
    if (maskPair && maskKey === key) return maskPair;
    maskPair = buildEdgeMaskPair(
      screen,
      tokens.edgeFade,
      dpr,
      tokens.edgeFadeInset,
    );
    maskKey = key;
    return maskPair;
  };

  // Apply both edge-fade masks as sequential destination-in passes. The
  // horizontal mask is drawn first (left/right fade), then the vertical
  // mask on top (top/bottom fade). destination-in multiplies destination
  // alpha by source alpha, so the two passes compose cleanly.
  const applyEdgeMasks = (
    ctx: CanvasRenderingContext2D,
    masks: EdgeMaskPair,
    screen: { width: number; height: number },
  ) => {
    resetCtx(ctx);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(masks.horizontal, 0, 0, screen.width, screen.height);
    ctx.drawImage(masks.vertical, 0, 0, screen.width, screen.height);
    ctx.restore();
  };

  const screenPoint = (
    point: CurvePoint,
    screen: { width: number; height: number },
  ): CurvePoint => worldToScreen(point, visible, screen);

  // Strip probe DOM classes when the card leaves the viewport. The probe
  // sample stays in memory so the re-entry path can resume the ramp, but
  // the visible affordances (readout, crosshair overlay, is-probe-near
  // styling) are gone until the user scrolls back.
  const clearProbeDom = () => {
    root.classList.remove("has-probe", "is-probe-near");
  };

  const renderStatic = (screen: { width: number; height: number }) => {
    if (!staticCanvas) {
      staticCanvas = document.createElement("canvas");
      staticCtx = staticCanvas.getContext("2d");
    }
    if (!bgCanvas) {
      bgCanvas = document.createElement("canvas");
      bgCtx = bgCanvas.getContext("2d");
    }
    if (!compositeCanvas) {
      compositeCanvas = document.createElement("canvas");
      compositeCtx = compositeCanvas.getContext("2d");
    }
    // View mode dispatcher. Read once per static redraw; the mode lives
    // on the root element as `data-curve-view-mode` (set by CurveViewport
    // and updated by the detail popup's view-cycle button). Only the curve
    // draw is swapped; bg (quad, zero, labels) and the masked layer's
    // scaffolding (grid, bounds, edge fade) are unchanged. The attribute
    // is always set by CurveViewport.astro — a missing value here is a
    // bug, not something to silently default.
    const viewMode = root!.getAttribute(
      "data-curve-view-mode",
    ) as CurveViewMode;
    const rampMode = viewMode === "ramp";
    const fieldMode = viewMode === "field";
    const heightStripMode = viewMode === "heightStrip";
    const rampLikeMode = rampMode || heightStripMode;
    const rampTokens = rampLikeMode ? readRampTokens(root!) : null;
    const rampColors = rampLikeMode ? readRampColors(root!) : null;
    const dpr = currentDpr();
    const w = Math.max(1, Math.round(screen.width * dpr));
    const h = Math.max(1, Math.round(screen.height * dpr));
    if (staticCanvas.width !== w || staticCanvas.height !== h) {
      staticCanvas.width = w;
      staticCanvas.height = h;
    }
    if (bgCanvas.width !== w || bgCanvas.height !== h) {
      bgCanvas.width = w;
      bgCanvas.height = h;
    }
    if (compositeCanvas.width !== w || compositeCanvas.height !== h) {
      compositeCanvas.width = w;
      compositeCanvas.height = h;
    }
    staticCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    compositeCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sp = (p: CurvePoint) => screenPoint(p, screen);

    // ---- bg layer (NOT masked): bg fill + viewport quad + zero lines -
    // Zero lines live here too: the world (0,0) reference is a stable
    // visual anchor and should not dissolve with the grid/curve at the
    // canvas edges. The viewport quad (the 0..1 frame box) is part of
    // the grid chrome and only renders in the "full" grid mode.
    // Axis labels render in both "full" and "lines" modes.
    bgCtx!.clearRect(0, 0, screen.width, screen.height);
    bgCtx!.fillStyle = colors.bg;
    bgCtx!.fillRect(0, 0, screen.width, screen.height);
    if (viewGridMode === "full") {
      drawViewportQuad({
        ctx: bgCtx!,
        baseRect,
        screen,
        tokens,
        screenPoint: sp,
      });
    }
    drawZeroLines({
      ctx: bgCtx!,
      baseRect,
      visible,
      domain,
      range,
      colors,
      tokens,
      screenPoint: sp,
    });
    // Axis labels run at every column count — drawAxisLabels itself
    // picks a recursive density tier (octa / quart / half / pair) based
    // on screen.width. Drawn in "full" and "lines" modes; hidden in
    // "axis" mode so the user sees only the zero lines.
    if (viewGridMode !== "axis") {
      drawAxisLabels({
        ctx: bgCtx!,
        baseRect,
        visible,
        domain,
        state,
        screen,
        colors,
        tokens,
        screenPoint: sp,
      });
    }

    // ---- content layer (MASKED): grid + bounds + curve -----------------
    const realCtx = ctx;
    ctx = staticCtx!;
    try {
      ctx.clearRect(0, 0, screen.width, screen.height);
      // Major grid + bounds only render in "full" and "lines". The
      // "lines" mode drops the subgrid pass (passed via subgrid:false)
      // and the 0..1 frame endlines. The "axis" mode draws neither.
      if (viewGridMode !== "axis") {
        drawGridLines({
          ctx,
          baseRect,
          visible,
          screen,
          colors,
          tokens,
          screenPoint: sp,
          subgrid: viewGridMode === "full",
        });
        if (viewGridMode === "full") {
          drawBounds({
            ctx,
            baseRect,
            visible,
            domain,
            range,
            colors,
            tokens,
            screenPoint: sp,
          });
        }
      }
      if (rampMode && rampTokens && rampColors && range) {
        renderRamp({
          ctx,
          points,
          baseRect,
          visible,
          range,
          state,
          tokens: rampTokens,
          colors: rampColors,
          baseColors: colors,
          baseTokens: tokens,
          screen,
          screenPoint: sp,
        });
      } else if (fieldMode && range) {
        renderField({
          ctx,
          points,
          baseRect,
          range,
          state,
          colors,
          tokens,
          screen,
          screenPoint: sp,
        });
      } else if (heightStripMode && rampTokens && rampColors && range) {
        renderHeightStrip({
          ctx,
          points,
          baseRect,
          visible,
          range,
          state,
          tokens: rampTokens,
          colors: rampColors,
          baseColors: colors,
          baseTokens: tokens,
          screen,
          screenPoint: sp,
        });
      } else {
        drawCurve({
          ctx,
          points,
          metrics,
          visible,
          state,
          screen,
          colors,
          tokens,
          screenPoint: sp,
        });
      }
      // Edge-fade masks: 1D ramps composited over the content layer.
      // Both axes are applied so all four edges fade, regardless of
      // aspect ratio. The masks are cached and rebuilt only on resize /
      // token change. The bg layer (which includes the viewport quad) is
      // drawn separately and is NOT touched by the mask.
      const masks = fieldMode ? null : ensureEdgeMasks(screen, dpr);
      if (masks) applyEdgeMasks(ctx, masks, screen);
    } finally {
      ctx = realCtx;
    }
    // Refresh the cached composite: bg (with viewport quad) first, then
    // the masked content on top. The per-frame render() will blit this
    // single canvas instead of re-blitting bg+static on every frame.
    compositeCtx!.clearRect(0, 0, screen.width, screen.height);
    compositeCtx!.drawImage(bgCanvas!, 0, 0);
    compositeCtx!.drawImage(staticCanvas!, 0, 0);
    needsStaticRedraw = false;
  };

  const requestRender = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderer.render();
    });
  };

  // ---- public renderer ---------------------------------------------------

  const renderer: CurveRenderer = {
    mount(nextRoot) {
      root = nextRoot;
      colors = readColors(root);
      tokens = readTokens(root);
      effects = readEffects(root);
      // Pick up the live column count from the grid, if any, so the
      // first render() already skips labels at high counts. Falls back
      // to 1 (full UI) for views not inside a grid (compare tray).
      const grid = root.closest("[data-cols]");
      if (grid) {
        const c = parseInt(grid.getAttribute("data-cols") || "1", 10);
        if (c >= 1 && c <= 8) columnCount = c;
      }
      if (typeof ResizeObserver !== "undefined") {
        // Prime the cache before the observer's first callback so the
        // initial render() doesn't have to do a getBoundingClientRect().
        refreshRect();
        resizeObserver = new ResizeObserver(() => {
          refreshRect();
          // A size change invalidates the cached composite: the backing
          // store will be replaced in setCanvasSize, and the static +
          // bg canvases may also need resizing on the next renderStatic.
          liveCanvasClean = false;
          requestRender();
        });
        resizeObserver.observe(root);
      }
      onThemeChange = () => {
        colors = readColors(root);
        tokens = readTokens(root);
        effects = readEffects(root);
        // Tokens may have changed edgeFade; force a mask rebuild on the
        // next renderStatic.
        maskKey = null;
        needsStaticRedraw = true;
        // DPR clamps live in tokens; the cached rect's dpr may now be
        // stale, and the cached rect itself may be stale if a theme
        // change re-flowed the page. Refresh both. Theme change also
        // invalidates the composite (colors changed).
        refreshRect();
        liveCanvasClean = false;
        requestRender();
      };
      root.addEventListener(THEME_EVENT, onThemeChange);
      // Skip the synchronous requestRender on mount. The ResizeObserver
      // fires its first callback on the next frame, after layout, and
      // triggers a render then. A synchronous render here would call
      // setCanvasSize() which writes canvas.width/height (intrinsic
      // size), briefly destabilizing the card's box and contributing
      // to CLS. The very first paint is intentionally a no-op.
    },
    update(next) {
      state = next;
      visible = getVisibleWorldRect(baseRect, state);
      // No-op for off-viewport cards: the cached composite stays valid,
      // and the next in-viewport render() will pick up the new state
      // (visible + needsStaticRedraw are still set, so render() does the
      // full rebuild when the card scrolls back into view).
      if (!inViewport) return;
      needsStaticRedraw = true;
      liveCanvasClean = false;
      requestRender();
    },
    render() {
      // Off-viewport cards: skip per-frame work entirely. The cached
      // composite stays valid until the next in-viewport render (forced
      // by setViewportVisible(true) when the IntersectionObserver
      // re-fires). This is the audit §3 hot path: broadcastView calls
      // update() on every visible view, which sets needsStaticRedraw,
      // which would otherwise trigger a full renderStatic for every
      // off-screen card on every drag tick.
      if (!inViewport) return;
      const screen = setCanvasSize();
      visible = getVisibleWorldRect(baseRect, state);
      // Fast path: if the static layer is already on the live canvas and
      // nothing per-frame (probe, cursor, ramp) is in flight, skip the
      // full re-blit. The composite is only valid until something dirties
      // it: a size change, a state change, a theme change, or the
      // presence of a probe/cursor. We track that with liveCanvasClean
      // and clear it at every entry point below.
      if (liveCanvasClean && !needsStaticRedraw && !probe && !mouse) return;
      if (needsStaticRedraw) renderStatic(screen);
      ctx!.clearRect(0, 0, screen.width, screen.height);
      // Blit the cached composite (bg + static already combined). The
      // composite was rebuilt by renderStatic above when needsStaticRedraw
      // was set; otherwise it still matches the current size/state. Either
      // way, one drawImage replaces the previous two-step blit and avoids
      // re-touching bg+static on probe-fade frames where they haven't
      // changed.
      ctx!.drawImage(compositeCanvas!, 0, 0);
      // From here on, any probe/cursor draw invalidates the composite
      // (different pixels next frame). The composite is only reusable
      // after a clean blit with no probe and no mouse — which we just did.
      if (!probe && !mouse) {
        liveCanvasClean = true;
        needsStaticRedraw = false;
        return;
      }
      liveCanvasClean = false;
      if (probe) {
        // Advance the time-based appear / disappear ramp. If a ramp is
        // still in flight, schedule another frame so the animation keeps
        // going. Once hidden, drop the probe and strip the DOM classes.
        if (probe.curve) {
          const now = performance.now();
          const phase = computeProbePhase(
            probe.curve,
            now,
            tokens.probeAppearMs,
            tokens.probeDisappearMs,
          );
          probe.curve.fadeAlpha = computeProbeAlpha(
            probe.curve,
            now,
            tokens.probeAppearMs,
            tokens.probeDisappearMs,
          );
          if (phase === "hidden") {
            probe = null;
            root.classList.remove("has-probe", "is-probe-near");
            requestRender();
          } else {
            if (phase === "appearing" || phase === "disappearing") {
              requestRender();
            }
            // (liveCanvasClean already cleared above this branch.)
            const sp = (p: CurvePoint) => screenPoint(p, screen);
            updateProbeText({ root, probe });
            drawProbe({
              ctx: ctx!,
              root,
              probe,
              screen,
              colors,
              tokens,
              effects,
              screenPoint: sp,
            });
          }
        }
      }
      // Custom cursor last so it sits on top of the probe crosshair. Not
      // faded by the edge mask.
      if (mouse) {
        drawCursor({ ctx: ctx!, screenPt: mouse, colors, tokens });
      }
      // Probe/cursor are present, so the composite is dirty. Already
      // cleared liveCanvasClean above.
      needsStaticRedraw = false;
    },
    setProbe(clientX, clientY) {
      // Off-viewport cards don't render probe or cursor. The page-level
      // IntersectionObserver will mark the card in-viewport again on the
      // next intersection tick. Skipping here keeps the per-frame work
      // off the off-screen cards.
      if (!inViewport) return;
      // Mouse position relative to the canvas needs a live rect because
      // the canvas may have moved under the cursor (scroll, layout).
      // We use the cached size when fresh, but rect.left/top are only
      // accurate from a live read. Trade-off: one getBoundingClientRect
      // per mousemove (the existing cost) instead of zero. Acceptable —
      // mousemove already does far more work than this.
      const rect = canvas!.getBoundingClientRect();
      const hadMouse = mouse !== null;
      mouse = { x: clientX - rect.left, y: clientY - rect.top };
      // A new mouse position means the cursor overlay pixels change
      // next frame; the cached composite is no longer valid.
      if (!hadMouse) liveCanvasClean = false;
      // Dense grid: track the cursor (so the custom cursor still shows)
      // but suppress the probe entirely. No sample, no DOM text, no
      // canvas draw. Drop any active probe so it doesn't carry over when
      // the user scrolls back to a sparse layout.
      if (columnCount > PROBE_COL_THRESHOLD) {
        if (probe) {
          probe = null;
          clearProbeDom();
          liveCanvasClean = false;
        }
        requestRender();
        return;
      }
      visible = getVisibleWorldRect(baseRect, state);
      const screen = { width: rect.width, height: rect.height };
      const next = buildProbe({
        canvas: canvas!,
        clientX,
        clientY,
        baseRect,
        metrics,
        points,
        state,
        visible,
      });
      // Hit test: the probe is "near" only when the cursor is within
      // `probeNearRadius` of the curve. Outside that radius, treat the
      // probe as gone — start the disappear ramp if there was one, or
      // stay hidden. Without this gate, every mousemove inside the
      // viewport would keep the probe visible.
      const cursorPt = worldToScreen(
        { x: next.worldX, y: next.worldY },
        visible,
        screen,
      );
      const near =
        !!next.curve &&
        Math.hypot(
          cursorPt.x - worldToScreen(next.curve.world, visible, screen).x,
          cursorPt.y - worldToScreen(next.curve.world, visible, screen).y,
        ) <= tokens.probeNearRadius;
      const now = performance.now();
      if (!near) {
        if (probe?.curve) probe.curve.disappearedAt = now;
        requestRender();
        return;
      }
      // Probe appears/changes — composite is dirty next frame.
      liveCanvasClean = false;
      // Reuse the appear-ramp timestamp so a continuous hover doesn't
      // restart the animation on every mousemove. The sample is rebuilt
      // on each call, so we only need the timing from the previous one.
      if (!next.curve) {
        requestRender();
        return;
      }
      // Probe path with a curve sample — composite is dirty.
      liveCanvasClean = false;
      const wasActive = probe?.curve;
      if (wasActive && wasActive.disappearedAt === null) {
        // Continuous hover: keep the appear ramp timestamp so the probe
        // doesn't re-fade-in on every mousemove.
        next.curve.appearedAt = wasActive.appearedAt;
        next.curve.near = wasActive.near;
        next.curve.disappearedAt = null;
      } else if (wasActive) {
        // Mid-disappear (or post-disappear, pre-clear): the cursor
        // re-entered the radius while the old probe was still fading.
        // Follow the new position but keep the old ramp state so the
        // fade continues smoothly from the current alpha — don't snap
        // back to appearing.
        next.curve.appearedAt = wasActive.appearedAt;
        next.curve.disappearedAt = wasActive.disappearedAt;
        next.curve.near = wasActive.near;
      } else {
        // Fresh appear.
        next.curve.appearedAt = now;
        next.curve.disappearedAt = null;
      }
      probe = next;
      requestRender();
    },
    clearProbe() {
      mouse = null;
      if (probe?.curve) probe.curve.disappearedAt = performance.now();
      clearProbeDom();
      requestRender();
    },
    setViewportVisible,
    setViewGridMode(mode: ViewGridMode) {
      if (mode === viewGridMode) return;
      viewGridMode = mode;
      needsStaticRedraw = true;
      liveCanvasClean = false;
      if (!inViewport) return;
      requestRender();
    },
    setColumnCount(c: number) {
      if (c === columnCount) return;
      const wasDense = columnCount > PROBE_COL_THRESHOLD;
      const isDense = c > PROBE_COL_THRESHOLD;
      columnCount = c;
      // Column count change affects the static layer (labels on/off).
      // Force a rebuild so the next render() blits the new state.
      needsStaticRedraw = true;
      liveCanvasClean = false;
      // If we just became dense and there's a probe sitting around (the
      // cursor hasn't moved, so setProbe() hasn't been called), drop it
      // so it doesn't suddenly appear on the next frame. The cursor
      // itself stays — only the probe (crosshair + readout + dot) goes.
      if (isDense && !wasDense && probe) {
        probe = null;
        clearProbeDom();
      }
      requestRender();
    },
    notifyViewModeChanged() {
      // The view mode is read off the root element on every
      // renderStatic, so a mode change only needs to invalidate the
      // cached static layer and request a redraw. Off-viewport cards
      // skip the redraw; the next in-viewport render() will pick up
      // the new mode (needsStaticRedraw is still set).
      if (!inViewport) {
        needsStaticRedraw = true;
        liveCanvasClean = false;
        return;
      }
      needsStaticRedraw = true;
      liveCanvasClean = false;
      requestRender();
    },
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      if (onThemeChange) root.removeEventListener(THEME_EVENT, onThemeChange);
      staticCanvas = null;
      staticCtx = null;
      bgCanvas = null;
      bgCtx = null;
      compositeCanvas = null;
      compositeCtx = null;
      maskPair = null;
      maskKey = null;
    },
  };

  renderer.update(state);
  return renderer;
};

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

const parseInterval = (attr: string | null): [number, number] | null => {
  if (!attr) return null;
  // Accept exponent notation (1e10) as well as plain decimals. The literal
  // strings "Infinity" / "-Infinity" / "NaN" are also accepted and mapped
  // via Number(), which returns the appropriate non-finite / NaN value.
  const m = attr.match(
    /^\s*\[\s*([+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?|Infinity|-Infinity|NaN)\s*,\s*([+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?|Infinity|-Infinity|NaN)\s*\]\s*$/,
  );
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[4]);
  // Allow Infinity / -Infinity through (Number.isFinite would reject them).
  // NaN is still rejected because zero-line + label math can't make sense
  // of an undefined axis.
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return [a, b];
};
