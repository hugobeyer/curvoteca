import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const biasMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  b: {
    label: "B",
    default: 0.3,
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
