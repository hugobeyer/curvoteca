import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const arMeta = {
  views: ["graph", "motion", "field", "heightStrip"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  attack: {
    label: "Attack",
    default: 0.3,
    step: 0.01
  },
  release: {
    label: "Release",
    default: 0.4,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["dynamics"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    params: true,
    bindings: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
