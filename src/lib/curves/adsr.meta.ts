import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const adsrMeta = {
  views: ["graph", "motion", "field", "heightStrip"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  attack: {
    label: "Attack",
    default: 0.1,
    step: 0.01
  },
  decay: {
    label: "Decay",
    default: 0.2,
    step: 0.01
  },
  sustain: {
    label: "Sustain",
    default: 0.5,
    step: 0.01
  },
  release: {
    label: "Release",
    default: 0.3,
    step: 0.01
  },
  sustainLevel: {
    label: "Sustain Level",
    default: 0.6,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["dynamics"] as readonly CurveRoleTag[],
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
