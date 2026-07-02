// ---------------------------------------------------------------------------
// detailCodeField.ts
// Code display + copy button for the detail overlay. Consumed via
// window.__detailOverlay from inline scripts.
// ---------------------------------------------------------------------------

const textNode = (value: string): Text => document.createTextNode(value);

export function showCode(codeEl: HTMLElement, copyEl: HTMLElement, code: string): void {
  codeEl.textContent = "";
  const lines = code.split(/\r?\n/);
  const codeWrap = document.createElement("code");
  codeWrap.className = "detail-code-lines";
  lines.forEach((line, index) => {
    const row = document.createElement("span");
    row.className = "detail-code-line";
    const number = document.createElement("span");
    number.className = "detail-code-line-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1);
    const text = document.createElement("span");
    text.className = "detail-code-line-text";
    text.appendChild(textNode(line || " "));
    row.appendChild(number);
    row.appendChild(text);
    codeWrap.appendChild(row);
  });
  codeEl.appendChild(codeWrap);
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
