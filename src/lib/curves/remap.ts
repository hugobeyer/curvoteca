import { DEFAULT_SAMPLING, remapKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {
  loIn: 0.2,
  hiIn: 0.8,
  loOut: 0,
  hiOut: 1,
} as const;
export type RemapParams = {
  loIn: number;
  hiIn: number;
  loOut: number;
  hiOut: number;
};

export function remapCurve(
  params: RemapParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = remapKernel(
    params.loIn,
    params.hiIn,
    params.loOut,
    params.hiOut,
  );
  return {
    id: "remap",
    name: "Remap",
    aliases: ["range remap", "value remap", "range mapping"],
    family: "utility",
    summary: "Remap value from one range to another",
    formula: "y = loOut + (t - loIn) * (hiOut - loOut) / (hiIn - loIn)",
    continuity: "C3+",
    domain: [0, 1],
    range: [0, 1],
    tags: ["utility", "mapping", "range", "remapping", "fit"],
    useCases: ["value-remapping", "range-adjustment", "parameter-mapping"],
    snippets: {
      equation: "y = loOut + (t - loIn) * (hiOut - loOut) / (hiIn - loIn)",
      js: "function remap(x, loIn, hiIn, loOut, hiOut) { loIn = loIn == null ? 0.2 : loIn; hiIn = hiIn == null ? 0.8 : hiIn; loOut = loOut == null ? 0 : loOut; hiOut = hiOut == null ? 1 : hiOut; return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      ts: "function remap(x: number, loIn: number = 0.2, hiIn: number = 0.8, loOut: number = 0, hiOut: number = 1): number { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      glsl: "float remap(float x, float loIn, float hiIn, float loOut, float hiOut) { loIn = (loIn > hiIn) ? 0.2 : loIn; hiIn = (hiIn < loIn) ? 0.8 : hiIn; return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      vex: "float remap(float x; float loIn; float hiIn; float loOut; float hiOut) { if (loIn > hiIn) loIn = 0.2; if (hiIn < loIn) hiIn = 0.8; return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      csharp:
        "float Remap(float x, float loIn = 0.2f, float hiIn = 0.8f, float loOut = 0, float hiOut = 1) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      rust: "fn remap(x: f64, lo_in: f64, hi_in: f64, lo_out: f64, hi_out: f64) -> f64 { lo_out + (x - lo_in) * (hi_out - lo_out) / (hi_in - lo_in) }",
      hlsl: "float remap(float x, float loIn, float hiIn, float loOut, float hiOut) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      wgsl: "fn remap(x: f32, lo_in: f32, hi_in: f32, lo_out: f32, hi_out: f32) -> f32 { return lo_out + (x - lo_in) * (hi_out - lo_out) / (hi_in - lo_in); }",
      python:
        "def remap(x, lo_in=0.2, hi_in=0.8, lo_out=0, hi_out=1): return lo_out + (x - lo_in) * (hi_out - lo_out) / (hi_in - lo_in)",
      cpp: "float remap(float x, float loIn = 0.2f, float hiIn = 0.8f, float loOut = 0.0f, float hiOut = 1.0f) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      lua: "function remap(x, loIn, hiIn, loOut, hiOut) loIn = loIn or 0.2; hiIn = hiIn or 0.8; loOut = loOut or 0; hiOut = hiOut or 1; return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn) end",
      gdscript:
        "func remap(x: float, loIn: float = 0.2, hiIn: float = 0.8, loOut: float = 0.0, hiOut: float = 1.0) -> float: return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn)",
      cuda: "__device__ float remap(float x, float loIn, float hiIn, float loOut, float hiOut) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      c: "double remap(double x, double loIn, double hiIn, double loOut, double hiOut) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      metal:
        "float remap(float x, float loIn, float hiIn, float loOut, float hiOut) { loIn = (loIn > hiIn) ? 0.2 : loIn; hiIn = (hiIn < loIn) ? 0.8 : hiIn; return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      opencl:
        "float remap(float x, float loIn, float hiIn, float loOut, float hiOut) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
      unity:
        "public static float Remap(float x, float loIn = 0.2f, float hiIn = 0.8f, float loOut = 0, float hiOut = 1) { return loOut + (x - loIn) * (hiOut - loOut) / (hiIn - loIn); }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["inverse-lerp", "clamp", "linear", "signed-scale"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => remapCurve(p as RemapParams),
    },
  };
}
