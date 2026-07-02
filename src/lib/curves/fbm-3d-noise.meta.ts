import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const fbm3dNoiseMeta = {
  views: ["graph"] as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: {} satisfies CurveViewHints,
  params: {
  seed: {
    label: "Seed",
    default: 1337,
    step: 1
  },
  scale: {
    label: "Scale",
    default: 4,
    step: 1
  },
  octaves: {
    label: "Octaves",
    default: 5,
    step: 1
  },
  lacunarity: {
    label: "Lacunarity",
    default: 2,
    step: 1
  },
  gain: {
    label: "Gain",
    default: 0.5,
    step: 0.01
  },
  gridSize: {
    label: "Grid Size",
    default: 64,
    step: 1
  }
} satisfies CurveParamSchema,
  roleTags: ["noise", "procedural", "renderer3d"] as readonly CurveRoleTag[],
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
