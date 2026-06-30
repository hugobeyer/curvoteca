import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const springMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  periodic: true
} satisfies CurveViewHints,
  params: {
  damping: {
    label: "Damping",
    default: 0.5,
    step: 0.01
  },
  mass: {
    label: "Mass",
    default: 1,
    step: 1
  },
  stiffness: {
    label: "Stiffness",
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
