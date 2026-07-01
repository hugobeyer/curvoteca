export type RendererViewHints = {
  signed?: boolean;
  bipolar?: boolean;
  centerY?: boolean;
  centerQuadY?: boolean;
  zeroAxis?: boolean;
};

export const parseRendererViewHints = (
  value: string | null,
): RendererViewHints => {
  if (!value) return {};
  try {
    const raw = JSON.parse(value);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out: RendererViewHints = {};
    (["signed", "bipolar", "centerY", "centerQuadY", "zeroAxis"] as const).forEach(
      (key) => {
        if (raw[key] === true || raw[key] === false) out[key] = raw[key];
      },
    );
    return out;
  } catch {
    return {};
  }
};

export const wantsCenteredY = (hints: RendererViewHints = {}) =>
  hints.centerY === true || (hints.centerY !== false && hints.signed === true);

export const wantsCenteredQuadY = (hints: RendererViewHints = {}) =>
  hints.centerQuadY === true ||
  (hints.centerQuadY !== false && hints.bipolar === true);

export const wantsZeroAxis = (hints: RendererViewHints = {}) =>
  hints.zeroAxis === true || (hints.zeroAxis !== false && hints.signed === true);
