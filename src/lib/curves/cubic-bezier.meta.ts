import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const cubicBezierMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  x1: {
    label: "X1",
    default: 0.25,
    step: 0.01
  },
  y1: {
    label: "Y1",
    default: 0.1,
    step: 0.01
  },
  x2: {
    label: "X2",
    default: 0.25,
    step: 0.01
  },
  y2: {
    label: "Y2",
    default: 1,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["interpolation", "easing"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
