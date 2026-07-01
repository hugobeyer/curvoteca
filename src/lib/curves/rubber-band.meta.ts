import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const rubberBandMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  centerY: true,
  zeroAxis: true
} satisfies CurveViewHints,
  params: {
  stiffness: {
    label: "Stiffness",
    default: 3,
    step: 1
  },
  damping: {
    label: "Damping",
    default: 0.5,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["easing"] as readonly CurveRoleTag[],
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
