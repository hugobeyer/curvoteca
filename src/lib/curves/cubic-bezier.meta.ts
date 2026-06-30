import type {
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const cubicBezierMeta = {
  views: ["graph", "ramp"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
    monotonic: true,
    bounded: true,
    preferredPreview: "ramp",
  } satisfies CurveViewHints,
  roleTags: ["interpolation", "easing"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
