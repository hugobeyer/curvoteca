import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const bellCurveMeta = {
  views: ["graph", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  mu: {
    label: "Mu",
    default: 0.5,
    step: 0.01
  },
  sigma: {
    label: "Sigma",
    default: 0.2,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["falloff", "mask"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
