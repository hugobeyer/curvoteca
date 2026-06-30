import type {
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const sdfSphereMeta = {
  views: ["graph", "field"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {
    signed: true,
    bounded: true,
  } satisfies CurveViewHints,
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
