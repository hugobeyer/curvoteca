import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const fmFeedbackMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  periodic: true
} satisfies CurveViewHints,
  params: {
  modIndex: {
    label: "Mod Index",
    default: 1,
    step: 1
  },
  modFreq: {
    label: "Mod Freq",
    default: 3,
    step: 1
  },
  carrierFreq: {
    label: "Carrier Freq",
    default: 5,
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
