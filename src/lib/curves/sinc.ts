import { DEFAULT_SAMPLING, sincKernel, type CurveKernel } from "../curveMath";
import type { CurveDefinition } from "../../data/curves";

export const defaultParams = {} as const;
export type SincParams = typeof defaultParams;

export function sincCurve(
  _params: SincParams = defaultParams,
): CurveDefinition {
  const kernel: CurveKernel = sincKernel;
  return {
    id: "sinc",
    name: "Sinc",
    aliases: ["normalized sinc", "sinc function", "sin(x)/x"],
    family: "distribution",
    summary: "Normalized sinc function",
    formula: "y = sin(pi*x) / (pi*x)",
    continuity: "C3+",
    domain: [-4, 4],
    range: [-0.5, 1],
    tags: ["sinc", "dsp", "fourier", "signal"],
    useCases: ["spectral-analysis", "reconstruction", "dsp", "fourier"],
    snippets: {
      equation: "y = sin(pi*x) / (pi*x)",
      js: "function sinc(x) { if (x === 0) return 1; return Math.sin(Math.PI * x) / (Math.PI * x); }",
      glsl: "float sinc(float x) { if (x == 0.0) return 1.0; return sin(3.14159265 * x) / (3.14159265 * x); }",
      vex: "float sinc(float x) { if (x == 0) return 1; return sin(M_PI * x) / (M_PI * x); }",
      ts: "function sinc(x: number): number { if (x === 0) return 1; return Math.sin(Math.PI * x) / (Math.PI * x); }",
      csharp:
        "float Sinc(float x) { if (x == 0) return 1.0f; return MathF.Sin(MathF.PI * x) / (MathF.PI * x); }",
      rust: "fn sinc(x: f64) -> f64 { if x == 0.0 { return 1.0; } let pi = std::f64::consts::PI; (pi * x).sin() / (pi * x) }",
      hlsl: "float sinc(float x) { if (x == 0.0) return 1.0; return sin(3.14159265 * x) / (3.14159265 * x); }",
      wgsl: "fn sinc(x: f32) -> f32 { if (x == 0.0) { return 1.0; } return sin(3.14159265 * x) / (3.14159265 * x); }",
      python:
        "def sinc(x): return 1 if x == 0 else math.sin(math.pi * x) / (math.pi * x)",
      cpp: "float sinc(float x) { if (x == 0.0f) return 1.0f; return std::sin(M_PI * x) / (M_PI * x); }",
      lua: "function sinc(x) if x == 0 then return 1 end; return math.sin(math.pi * x) / (math.pi * x) end",
      gdscript:
        "func sinc(x: float) -> float: if x == 0.0: return 1.0; return sin(PI * x) / (PI * x)",
      cuda: "__device__ float sinc(float x) { if (x == 0.0f) return 1.0f; return sinf(3.14159265f * x) / (3.14159265f * x); }",
      c: "double sinc(double x) { if (x == 0.0) return 1.0; return sin(M_PI * x) / (M_PI * x); }",
      json: '{"name": "Sinc", "formula": "y = sin(pi*x) / (pi*x)", "params": {}}',
      metal:
        "float sinc(float x) { if (x == 0.0) return 1.0; return sin(3.14159265 * x) / (3.14159265 * x); }",
      opencl:
        "float sinc(float x) { if (x == 0.0f) return 1.0f; return sin(3.14159265f * x) / (3.14159265f * x); }",
      unity:
        "public static float Sinc(float x) { if (x == 0) return 1.0f; return Mathf.Sin(3.14159265f * x) / (3.14159265f * x); }",
      matlab: "y = @(x) 1 * (x == 0) + sin(pi * x) / (pi * x) * (x ~= 0);",
    },
    kernel,
    sampling: DEFAULT_SAMPLING,
    related: ["gaussian", "bell-curve", "window-hann", "sine-ease"],
    factory: {
      paramNames: Object.keys(defaultParams) as readonly string[],
      produce: (params) => sincCurve(params as SincParams),
    },
  };
}
