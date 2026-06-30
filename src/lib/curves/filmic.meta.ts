import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const filmicMeta = {
  views: ["graph", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  a: {
    label: "A",
    default: 0.22,
    step: 0.01
  },
  b: {
    label: "B",
    default: 0.3,
    step: 0.01
  },
  c: {
    label: "C",
    default: 0.1,
    step: 0.01
  },
  d: {
    label: "D",
    default: 0.2,
    step: 0.01
  },
  e: {
    label: "E",
    default: 0.01,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["tonemap"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
