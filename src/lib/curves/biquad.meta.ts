import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const biquadMeta = {
  views: ["graph", "motion", "field", "heightStrip"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  centerY: true,
  zeroAxis: true,
  bipolar: true,
  centerQuadY: true
} satisfies CurveViewHints,
  params: {
  a0: {
    label: "A0",
    default: 1,
    step: 1
  },
  a1: {
    label: "A1",
    default: 0,
    step: 1
  },
  a2: {
    label: "A2",
    default: 0,
    step: 1
  },
  b1: {
    label: "B1",
    default: 0,
    step: 1
  },
  b2: {
    label: "B2",
    default: 0,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["dsp"] as readonly CurveRoleTag[],
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
