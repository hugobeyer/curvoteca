import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const compressorMeta = {
  views: ["graph", "motion", "field", "heightStrip"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  threshold: {
    label: "Threshold",
    default: 0.5,
    step: 0.01
  },
  ratio: {
    label: "Ratio",
    default: 4,
    step: 1
  },
  knee: {
    label: "Knee",
    default: 0.1,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["dynamics"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
