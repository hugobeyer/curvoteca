import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const sdfSphereMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  signed: true,
  bounded: true,
  centerY: true,
  zeroAxis: true,
  bipolar: true,
  centerQuadY: true
} satisfies CurveViewHints,
  params: {
  radius: {
    label: "Radius",
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
