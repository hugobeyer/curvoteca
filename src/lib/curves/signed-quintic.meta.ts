import type {
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const signedQuinticMeta = {
  views: ["graph", "ramp"] as readonly CurveViewMode[],
  defaultView: "ramp" as CurveViewMode,
  viewHints: {
    signed: true,
    bipolar: true,
    monotonic: true,
    bounded: true,
    preferredPreview: "ramp",
  } satisfies CurveViewHints,
  roleTags: ["easing", "remap"] as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    clamp: true,
    fit: true,
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
