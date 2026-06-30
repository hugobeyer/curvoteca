import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const remapMeta = {
  views: ["graph", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  bounded: true
} satisfies CurveViewHints,
  params: {
  loIn: {
    label: "Lo In",
    default: 0.2,
    step: 0.01
  },
  hiIn: {
    label: "Hi In",
    default: 0.8,
    step: 0.01
  },
  loOut: {
    label: "Lo Out",
    default: 0,
    step: 1
  },
  hiOut: {
    label: "Hi Out",
    default: 1,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["remap"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
