import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const svfMeta = {
  views: ["graph", "field", "heightStrip"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  cutoff: {
    label: "Cutoff",
    default: 0.3,
    step: 0.01
  },
  resonance: {
    label: "Resonance",
    default: 0.5,
    step: 0.01
  },
  mode: {
    label: "Mode",
    default: 0,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["dsp"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
