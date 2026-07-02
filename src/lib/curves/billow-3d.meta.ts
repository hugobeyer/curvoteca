import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const billow3dMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  seed: {
    label: "Seed",
    default: 1337,
    step: 1
  },
  octaves: {
    label: "Octaves",
    default: 5,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["noise"] as readonly CurveRoleTag[],
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
