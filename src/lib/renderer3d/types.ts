import type { Renderer3DColors } from "./colors3d";
import type { Renderer3DTokens } from "./tokens3d";

export type Renderer3DViewId = "noise3d" | "pointcloud";

export type Renderer3DRenderMode =
  | "shaded"
  | "wireframe"
  | "points"
  | "graph"
  | "ramp"
  | "field"
  | "heightstrip"
  | "motion";

export type Renderer3DUseCase =
  | "fbm-terrain"
  | "domain-warp"
  | "ridged-rock"
  | "scatter-volume"
  | "density-shell";

export type Renderer3DQuality = "card" | "detail" | "high";

export type Renderer3DParams = {
  seed?: number;
  scale?: number;
  octaves?: number;
  lacunarity?: number;
  gain?: number;
  pointCount?: number;
  gridSize?: number;
  lod?: number;
  animate?: boolean;
};

export type Renderer3DData = {
  id: string;
  viewId: Renderer3DViewId;
  useCase?: Renderer3DUseCase;
  renderMode?: Renderer3DRenderMode;
  quality?: Renderer3DQuality;
  gridMode?: "full" | "lines" | "axis";
  params?: Renderer3DParams;
};

export type Renderer3DGeometry = {
  mesh: number[];
  ghost: number[];
  wire: number[];
  points: number[];
};

export type Renderer3DViewBuildArgs = {
  data: Renderer3DData;
  time: number;
  colors: Renderer3DColors;
  tokens: Renderer3DTokens;
};

export type Renderer3DView = {
  id: Renderer3DViewId;
  defaultUseCase: Renderer3DUseCase;
  defaultRenderMode: Renderer3DRenderMode;
  supportedRenderModes: readonly Renderer3DRenderMode[];
  build: (args: Renderer3DViewBuildArgs) => Renderer3DGeometry;
};

export type Renderer3DHandle = {
  destroy: () => void;
  resize: () => void;
  setData: (data: Partial<Renderer3DData>) => void;
  setView: (viewId: Renderer3DViewId, data?: Partial<Renderer3DData>) => void;
  setUseCase: (useCase: Renderer3DUseCase) => void;
  setRenderMode: (mode: Renderer3DRenderMode) => void;
  setQuality: (quality: Renderer3DQuality) => void;
  setGridMode: (mode: "full" | "lines" | "axis") => void;
  resetView: () => void;
};

export type Renderer3DMountOptions = {
  data: Renderer3DData;
  canvas?: HTMLCanvasElement;
  views?: readonly Renderer3DView[];
};
