import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const hermiteMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  p0: {
    label: "P0",
    default: 0,
    step: 1
  },
  p1: {
    label: "P1",
    default: 1,
    step: 1
  },
  m0: {
    label: "M0",
    default: 0,
    step: 1
  },
  m1: {
    label: "M1",
    default: 0,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["interpolation"] as readonly CurveRoleTag[],
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
