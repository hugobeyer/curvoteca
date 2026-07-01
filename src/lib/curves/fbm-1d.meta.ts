import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const fbm1dMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  centerY: true,
  zeroAxis: true,
  bipolar: true,
  centerQuadY: true
} satisfies CurveViewHints,
  params: {
  seed: {
    label: "Seed",
    default: 1337,
    step: 1
  },
  octaves: {
    label: "Octaves",
    default: 4,
    step: 1
  },
  lacunarity: {
    label: "Lacunarity",
    default: 2,
    step: 1
  },
  gain: {
    label: "Gain",
    default: 0.5,
    step: 0.01
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
