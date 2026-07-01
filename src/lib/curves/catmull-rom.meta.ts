import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const catmullRomMeta = {
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
    default: 0.5,
    step: 0.01
  },
  p2: {
    label: "P2",
    default: 1,
    step: 1
  },
  p3: {
    label: "P3",
    default: 0.8,
    step: 0.01
  },
  alpha: {
    label: "Alpha",
    default: 0.5,
    step: 0.01
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
