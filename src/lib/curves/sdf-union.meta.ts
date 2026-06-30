import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const sdfUnionMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  bounded: true
} satisfies CurveViewHints,
  params: {
  radius1: {
    label: "Radius1",
    default: 0.3,
    step: 0.01
  },
  cx1: {
    label: "Cx1",
    default: 0.3,
    step: 0.01
  },
  radius2: {
    label: "Radius2",
    default: 0.3,
    step: 0.01
  },
  cx2: {
    label: "Cx2",
    default: 0.7,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["sdf", "mask"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: false,
    fit: false,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
