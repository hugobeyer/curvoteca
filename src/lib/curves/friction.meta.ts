import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const frictionMeta = {
  views: ["graph", "motion", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  mass: {
    label: "Mass",
    default: 1,
    step: 1
  },
  friction: {
    label: "Friction",
    default: 2,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["easing"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
