import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const worleyNoise1dMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  seed: {
    label: "Seed",
    default: 1337,
    step: 1
  },
  cells: {
    label: "Cells",
    default: 6,
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
