import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const stepsEasingMeta = {
  views: ["graph", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  steps: {
    label: "Steps",
    default: 4,
    step: 1
  },
  smoothness: {
    label: "Smoothness",
    default: 0,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["remap"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
