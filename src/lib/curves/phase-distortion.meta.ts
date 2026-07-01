import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const phaseDistortionMeta = {
  views: ["graph", "motion", "field", "heightStrip", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
  periodic: true,
  signed: true,
  centerY: true,
  zeroAxis: true,
  bipolar: true,
  centerQuadY: true
} satisfies CurveViewHints,
  params: {
  distortion: {
    label: "Distortion",
    default: 0.5,
    step: 0.01
  },
  asymmetry: {
    label: "Asymmetry",
    default: 0,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["wave"] as readonly CurveRoleTag[],
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
