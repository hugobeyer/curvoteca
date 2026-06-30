import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const hysteresisMeta = {
  views: ["graph", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  threshold: {
    label: "Threshold",
    default: 0.3,
    step: 0.01
  },
  width: {
    label: "Width",
    default: 0.1,
    step: 0.01
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
