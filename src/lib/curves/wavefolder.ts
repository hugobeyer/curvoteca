import { DEFAULT_SAMPLING, wavefolderKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = { fold: 2 } as const;
export type WavefolderParams = { fold: number };

export function wavefolderCurve(
  params: WavefolderParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = wavefolderKernel(params.fold);
  return {
    id: "wavefolder",
    name: "Wavefolder",
    aliases: [],
    family: "distortion",
    summary: "Wavefolding distortion",
    formula: "y = |((t * fold + 1) % 2 - 1)| * 2 - 1",
    continuity: "C0",
    domain: [-1, 1],
    range: [-1, 1],
    tags: ["audio", "distortion", "wavefolding", "synthesis", "modular"],
    useCases: [
      "audio-synthesis",
      "wave-shaping",
      "modular-patching",
      "distortion",
    ],
    snippets: {
      equation: "y = |((t * fold + 1) % 2 - 1)| * 2 - 1",
      js: "function wavefolder(x, fold) { fold = fold == null ? 2 : fold; var v = x * fold; return Math.abs(((v + 1) % 2 - 1)) * 2 - 1; }",
      ts: "function wavefolder(x: number, fold: number = 2): number { const v = x * fold; return Math.abs(((v + 1) % 2 - 1)) * 2 - 1; }",
      glsl: "float wavefolder(float x, float fold) { fold = (fold == 0.0) ? 2.0 : fold; float v = x * fold; return abs(mod(v + 1.0, 2.0) - 1.0) * 2.0 - 1.0; }",
      vex: "float wavefolder(float x; float fold) { if (fold == 0) fold = 2; float v = x * fold; return abs(((v + 1) % 2 - 1)) * 2 - 1; }",
      csharp: "float Wavefolder(float x, float fold = 2) { float v = x * fold; return Math.Abs((v + 1) % 2 - 1) * 2 - 1; }",
      rust: "fn wavefolder(x: f64, fold: f64) -> f64 { let fold = if fold == 0.0 { 2.0 } else { fold }; let v = x * fold; ((v + 1.0).rem_euclid(2.0) - 1.0).abs() * 2.0 - 1.0 }",
      hlsl: "float wavefolder(float x, float fold) { fold = (fold == 0.0) ? 2.0 : fold; float v = x * fold; return abs(fmod(v + 1.0, 2.0) - 1.0) * 2.0 - 1.0; }",
      wgsl: "fn wavefolder(x: f32, fold: f32) -> f32 { let fold = select(2.0, fold, fold != 0.0); let v = x * fold; return abs(((v + 1.0) % 2.0) - 1.0) * 2.0 - 1.0; }",
      python: "def wavefolder(x, fold=2): fold = fold or 2; v = x * fold; return abs(((v + 1) % 2 - 1)) * 2 - 1",
      cpp: "float wavefolder(float x, float fold = 2.0f) { float v = x * fold; return std::abs(std::fmod(v + 1.0f, 2.0f) - 1.0f) * 2.0f - 1.0f; }",
      lua: "function wavefolder(x, fold) fold = fold or 2 local v = x * fold return math.abs(((v + 1) % 2 - 1)) * 2 - 1 end",
      gdscript: "func wavefolder(x: float, fold: float = 2.0) -> float: var v = x * fold; return abs(fmod(v + 1.0, 2.0) - 1.0) * 2.0 - 1.0",
      cuda: "__device__ float wavefolder(float x, float fold) { if (fold == 0.0f) fold = 2.0f; float v = x * fold; return fabsf(fmodf(v + 1.0f, 2.0f) - 1.0f) * 2.0f - 1.0f; }",
      c: "double wavefolder(double x, double fold) { if (fold == 0.0) fold = 2.0; double v = x * fold; return fabs(fmod(v + 1.0, 2.0) - 1.0) * 2.0 - 1.0; }",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["soft-clip", "cubic-distortion", "chebyshev"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (p) => wavefolderCurve(p as WavefolderParams),
    },
  };
}
