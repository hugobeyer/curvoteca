import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const sdfBoxMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  bounded: true,
  centerY: true,
  zeroAxis: true
} satisfies CurveViewHints,
  params: {
  width: {
    label: "Width",
    default: 0.3,
    step: 0.01
  },
  cx: {
    label: "Cx",
    default: 0.5,
    step: 0.01
  }
} satisfies CurveParamSchema,
  roleTags: ["sdf", "mask"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    params: true,
    bindings: true,
    clamp: false,
    fit: false,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
