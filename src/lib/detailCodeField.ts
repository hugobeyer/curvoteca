// ---------------------------------------------------------------------------
// detailCodeField.ts
// Reusable code display + copy button for the detail overlay.
// Consumed via window.__detailOverlay from inline index.astro scripts.
// ---------------------------------------------------------------------------

export function showCode(codeEl: HTMLElement, copyEl: HTMLElement, code: string): void {
  codeEl.textContent = code;
  copyEl.setAttribute("data-copy", code);
}

export function copyDetailCode(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta);
  return Promise.resolve();
}

const FLASH_MS = 800;

const flashTimers = new WeakMap<HTMLElement, number>();

export function flashCopied(el: HTMLElement): void {
  const prev = flashTimers.get(el);
  if (prev) clearTimeout(prev);
  el.classList.add("is-copied");
  flashTimers.set(el, window.setTimeout(() => {
    el.classList.remove("is-copied");
    flashTimers.delete(el);
  }, FLASH_MS));
}
