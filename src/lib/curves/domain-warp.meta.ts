import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const domainWarpMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  warp: {
    label: "Warp",
    default: 0.1,
    step: 0.01
  },
  freq: {
    label: "Freq",
    default: 4,
    step: 1
  },
  seed: {
    label: "Seed",
    default: 1337,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["noise"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
