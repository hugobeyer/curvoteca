import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const lfoShapesMeta = {
  views: ["graph", "motion", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  periodic: true
} satisfies CurveViewHints,
  params: {
  shape: {
    label: "Shape",
    default: 0,
    step: 1
  },
  freq: {
    label: "Freq",
    default: 4,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["wave"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
