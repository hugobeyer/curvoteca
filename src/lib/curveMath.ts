// ---------------------------------------------------------------------------
// curveMath.ts
// Curve kernel functions and sampler. Adding a curve = adding a kernel in
// `lib/curves/` and a new entry in the switch below.
// ---------------------------------------------------------------------------

import type { CurvePoint, CurveRect } from "./curveViewportMath";

/**
 * Number of samples drawn across each curve's domain at build time.
 * Also surfaced to the runtime renderer so both sides agree. Bump
 * for sharper curves (bounce, elastic) at the cost of larger
 * `data-curve-points` payloads.
 */
export const SAMPLE_RESOLUTION = 256;

/**
 * A single sampled point on a curve. 2D for the current renderer; the optional
 * `z` slot is a non-breaking seam for a future 3D projection.
 */
export type CurveSamplePoint = CurvePoint & { z?: number };

export type AnalyticKernel = {
  readonly id: string;
  readonly domain: [number, number];
  readonly range: [number, number];
  evaluate(t: number): CurveSamplePoint;
};

/**
 * Future union: AnalyticKernel | BezierKernel | BSplineKernel. The renderer
 * only needs `evaluate(t)`; new kernel types just need to implement it.
 */
export type CurveKernel = AnalyticKernel;

export type SamplingHint = {
  strategy: "uniform";
  resolution: number;
};

export type ProjectionStrategy = (
  points: CurveSamplePoint[],
  viewBox: CurveRect,
  domain: [number, number],
  range: [number, number],
) => CurveSamplePoint[];

const pt = (x: number, y: number): CurveSamplePoint => ({ x, y });

// ---------- per-curve kernels (math is the source of truth) ----------

export const linearKernel: AnalyticKernel = {
  id: "linear",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t),
};

export const smoothstepKernel: AnalyticKernel = {
  id: "smoothstep",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t * (3 - 2 * t)),
};

export const smootherstepKernel: AnalyticKernel = {
  id: "smootherstep",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const t3 = t * t * t;
    return pt(t, t3 * (t * (t * 6 - 15) + 10));
  },
};

export const powerKernel = (p = 2): AnalyticKernel => ({
  id: "power",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.pow(Math.max(0, t), p)),
});

export const biasKernel = (b = 0.5): AnalyticKernel => {
  const exp = b > 0 ? Math.log(b) / Math.log(0.5) : 1;
  return {
    id: "bias",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => pt(t, Math.pow(Math.max(0, t), exp)),
  };
};

export const gainKernel = (b = 0.5): AnalyticKernel => {
  const exp = b > 0 ? Math.log(b) / Math.log(0.5) : 1;
  return {
    id: "gain",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      const y =
        t < 0.5 ? Math.pow(2 * t, exp) / 2 : 1 - Math.pow(2 - 2 * t, exp) / 2;
      return pt(t, y);
    },
  };
};

export const logisticKernel = (k = 10, x0 = 0.5): AnalyticKernel => ({
  id: "logistic",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 / (1 + Math.exp(-k * (t - x0)))),
});

export const inversePowerKernel = (p = 2): AnalyticKernel => ({
  id: "inverse-power",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.pow(1 - t, p)),
});

export const signedScaleKernel = (p = 2): AnalyticKernel => ({
  id: "signed-scale",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => {
    if (t === 0) return pt(0, 0);
    const s = t < 0 ? -1 : 1;
    return pt(t, s * Math.pow(Math.abs(t), p));
  },
});

export const sineEaseKernel: AnalyticKernel = {
  id: "sine-ease",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.sin((t * Math.PI) / 2)),
};

export const deadZoneKernel = (d = 0.2): AnalyticKernel => ({
  id: "dead-zone",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => {
    if (Math.abs(t) < d) return pt(t, 0);
    const s = t < 0 ? -1 : 1;
    return pt(t, (s * (Math.abs(t) - d)) / (1 - d));
  },
});

export const expKernel = (k = 2): AnalyticKernel => {
  const denom = Math.exp(k) - 1;
  return {
    id: "exp",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => pt(t, (Math.exp(k * t) - 1) / denom),
  };
};

/**
 * 7th-degree smoothstep (Perlin's septic). C6-continuous: zero
 * 1st–6th derivatives at t=0 and t=1. Mirror of `smootherstepKernel`
 * one polynomial degree higher.
 */
export const septicKernel: AnalyticKernel = {
  id: "septic-smoothstep",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    // y = t^7 * (35 - 84t + 70t^2 - 20t^3)
    const t2 = t * t;
    const t3 = t2 * t;
    return pt(t, t3 * t2 * t2 * (35 - 84 * t + 70 * t2 - 20 * t3));
  },
};

export const cosineEaseKernel: AnalyticKernel = {
  id: "cosine-ease",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.cos((t * Math.PI) / 2)),
};

export const circularInKernel: AnalyticKernel = {
  id: "circular-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.sqrt(Math.max(0, 1 - t * t))),
};

export const circularOutKernel: AnalyticKernel = {
  id: "circular-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const u = 1 - t;
    return pt(t, Math.sqrt(Math.max(0, 1 - u * u)));
  },
};

/**
 * Linear fit clamped to [lo, hi]. lo=0, hi=1 is the identity; lo=0.2,
 * hi=0.8 flattens the shoulders and remaps the active range.
 */
export const clampKernel = (lo = 0, hi = 1): AnalyticKernel => ({
  id: "clamp",
  domain: [0, 1],
  range: [lo, hi],
  evaluate: (t) => {
    if (t <= lo) return pt(t, lo);
    if (t >= hi) return pt(t, hi);
    return pt(t, t);
  },
});

/**
 * Soft dead zone: smoothstep-shouldered remap around |x| < d. Unlike
 * `deadZoneKernel` (which is C0-discontinuous at the band edges), this
 * is C1-continuous — the linear segment is replaced by a smoothstep
 * ramp from 0 at |x|=d to 1 at |x|=1.
 */
export const softDeadZoneKernel = (d = 0.2): AnalyticKernel => {
  // smoothstep edge values: at t=d, shoulder y=0; at t=1, shoulder y=1
  const span = 1 - d;
  return {
    id: "soft-dead-zone",
    domain: [-1, 1],
    range: [-1, 1],
    evaluate: (t) => {
      const a = Math.abs(t);
      if (a < d) return pt(t, 0);
      const u = (a - d) / span;
      // smoothstep(0, 1, u)
      const y = u * u * (3 - 2 * u);
      return pt(t, t < 0 ? -y : y);
    },
  };
};

/**
 * Signed quintic. Same shape as `signedScaleKernel`; named separately
 * so the registry can carry both a "general signed power" and a
 * "default p=5" entry without one being an alias of the other.
 */
export const signedQuinticKernel = (p = 5): AnalyticKernel => ({
  id: "signed-quintic",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => {
    if (t === 0) return pt(0, 0);
    const s = t < 0 ? -1 : 1;
    return pt(t, s * Math.pow(Math.abs(t), p));
  },
});

/**
 * Signed logistic, centered at x=0. 2 / (1 + e^(-k*x)) - 1, mapped to
 * [-1, 1] range. Compare to `logisticKernel` which lives on [0,1].
 */
export const signedLogisticKernel = (k = 10): AnalyticKernel => ({
  id: "signed-logistic",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, 2 / (1 + Math.exp(-k * t)) - 1),
});

// ---------- sine/cosine/circular in-out variants ----------

/** sine-in: mirror of sine-ease (which is sine-out). */
export const sineInKernel: AnalyticKernel = {
  id: "sine-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.cos((t * Math.PI) / 2)),
};

/** sine-in-out: full Hermite sine, C1 with zero derivative at both ends. */
export const sineInOutKernel: AnalyticKernel = {
  id: "sine-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 0.5 - 0.5 * Math.cos(t * Math.PI)),
};

/** cosine-in: mirror of cosine-ease. */
export const cosineInKernel: AnalyticKernel = {
  id: "cosine-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.sin((t * Math.PI) / 2)),
};

/** cosine-in-out: half-period of cosine, centered. */
export const cosineInOutKernel: AnalyticKernel = {
  id: "cosine-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 0.5 - 0.5 * Math.cos(t * Math.PI)),
};

/**
 * circular-in-out: symmetric S-curve. For x<0.5, mirror of circular-out
 * scaled to [0, 0.5]; for x>0.5, circular-out scaled to [0.5, 1]. The
 * closed form is `(1 - cos(pi * x)) / 2` for both halves, which avoids
 * a branch and is the canonical formulation.
 */
export const circularInOutKernel: AnalyticKernel = {
  id: "circular-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, (1 - Math.cos(t * Math.PI)) / 2),
};

// ---------- back (anticipation) easings ----------

/**
 * back-in: overshoots below 0 before settling. y = x^2 * ((s+1)*x - s)
 * with s=1.70158 (Penner's constant — gives ~10% overshoot).
 */
export const backInKernel = (s = 1.70158): AnalyticKernel => ({
  id: "back-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t * ((s + 1) * t - s)),
});

/** back-out: mirror of back-in around x=0.5. y = 1 - back_in(1 - x). */
export const backOutKernel = (s = 1.70158): AnalyticKernel => ({
  id: "back-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const u = 1 - t;
    return pt(t, 1 - u * u * ((s + 1) * u - s));
  },
});

/**
 * back-in-out: piecewise, with the standard s-in = 1.70158 and
 * s-out = 2 * s-in (Penner).
 */
export const backInOutKernel = (s = 1.70158): AnalyticKernel => ({
  id: "back-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const sOut = 2 * s;
    if (t < 0.5) {
      const u = 2 * t;
      return pt(t, 0.5 * u * u * ((sOut + 1) * u - sOut));
    }
    const u = 2 * t - 2;
    return pt(t, 0.5 * (u * u * ((sOut + 1) * u + sOut) + 2));
  },
});

// ---------- bounce easing ----------

/**
 * bounce-out: classic decaying bounce settle. y = 1 - (1-t)^k * (1 + cos(2*pi*n*t)) / 2.
 * The curve oscillates with `n` cycles whose amplitude decays as
 * `(1-t)^k`. At t=0, y=0 (factor (1+cos(0)) = 2, envelope 1). At
 * t=1, y=1 (envelope 0). Peaks between zero-crossings grow toward 1
 * as t approaches 1. This is the damped-oscillation bounce shape.
 */
export const bounceOutKernel = (n = 4, k = 2): AnalyticKernel => ({
  id: "bounce-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t <= 0) return pt(t, 0);
    if (t >= 1) return pt(t, 1);
    const env = Math.pow(1 - t, k);
    const osc = (1 + Math.cos(2 * Math.PI * n * t)) / 2;
    return pt(t, 1 - env * osc);
  },
});

/** bounce-in: 1 - bounce_out(1 - x). */
export const bounceInKernel = (n = 4, k = 2): AnalyticKernel => {
  const out = bounceOutKernel(n, k);
  return {
    id: "bounce-in",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      if (t <= 0) return pt(t, 0);
      if (t >= 1) return pt(t, 1);
      return pt(t, 1 - out.evaluate(1 - t).y);
    },
  };
};

/**
 * bounce-in-out: first half mirrors bounce-out (in reverse), second
 * half mirrors bounce-out. Symmetric at x=0.5.
 */
export const bounceInOutKernel = (n = 4, k = 2): AnalyticKernel => {
  const out = bounceOutKernel(n, k);
  return {
    id: "bounce-in-out",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      if (t <= 0) return pt(t, 0);
      if (t >= 1) return pt(t, 1);
      if (t < 0.5) return pt(t, 0.5 * (1 - out.evaluate(1 - 2 * t).y));
      return pt(t, 0.5 * (1 + out.evaluate(2 * t - 1).y));
    },
  };
};

// ---------- elastic easing ----------

/**
 * elastic-out: damped sine wave. 2^(-10x) * sin((x*10 - 0.75) * 2pi/3).
 * Standard Penner formulation.
 */
export const elasticOutKernel = (
  amplitude = 1,
  period = 0.3,
): AnalyticKernel => {
  const a = Math.max(1, amplitude);
  const s = (period / (2 * Math.PI)) * Math.asin(1 / a);
  return {
    id: "elastic-out",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) =>
      pt(
        t,
        t === 0 || t === 1
          ? t
          : a *
              Math.pow(2, -10 * t) *
              Math.sin(((t - s) * 2 * Math.PI) / period) +
              1,
      ),
  };
};

/** elastic-in: 1 - elastic_out(1 - x) with phase flipped. */
export const elasticInKernel = (
  amplitude = 1,
  period = 0.3,
): AnalyticKernel => {
  const a = Math.max(1, amplitude);
  const s = (period / (2 * Math.PI)) * Math.asin(1 / a);
  return {
    id: "elastic-in",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) =>
      pt(
        t,
        t === 0 || t === 1
          ? t
          : -(
              a *
              Math.pow(2, 10 * t - 10) *
              Math.sin(((t - 1 - s) * 2 * Math.PI) / period)
            ),
      ),
  };
};

/** elastic-in-out: mirror of elastic-out across x=0.5. */
export const elasticInOutKernel = (
  amplitude = 1,
  period = 0.3,
): AnalyticKernel => {
  const a = Math.max(1, amplitude);
  const s = (period / (2 * Math.PI)) * Math.asin(1 / a);
  return {
    id: "elastic-in-out",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      if (t === 0 || t === 1) return pt(t, t);
      const u = 2 * t - 1;
      return pt(
        t,
        u < 0
          ? -0.5 *
              (a *
                Math.pow(2, 10 * u) *
                Math.sin(((u - s) * 2 * Math.PI) / period))
          : 0.5 *
              a *
              Math.pow(2, -10 * u) *
              Math.sin(((u - s) * 2 * Math.PI) / period) +
              1,
      );
    },
  };
};

// ---------- exp falloff ----------

/**
 * exp-falloff: 1 - e^(-k*x), normalized so y(1) = 1 - e^(-k) (not 1).
 * Domain [0, 1] maps to [0, 1 - e^(-k)]; the curve "approaches but
 * never quite reaches" full. Useful for distance falloff where
 * asymptotic behavior is the feature.
 */
export const expFalloffKernel = (k = 3): AnalyticKernel => {
  const denom = 1 - Math.exp(-k);
  return {
    id: "exp-falloff",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => pt(t, (1 - Math.exp(-k * t)) / denom),
  };
};

// ---------- noise kernels (deterministic, seeded) ----------

/**
 * Mulberry32 — small, fast, deterministic 32-bit PRNG. Seeded once per
 * kernel closure so the same kernel instance always produces the same
 * noise. Used by the noise family (value/perlin/simplex/worley/fbm).
 */
const makeRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Smoothstep-ish fade used by Perlin/Simplex. */
const fade = (t: number) => t * t * (3 - 2 * t);

/** 1D value noise: random values at integer lattice points, smoothstep-interpolated. */
const valueNoise1D = (seed: number) => {
  const rng = makeRng(seed);
  const table = new Float32Array(257);
  for (let i = 0; i < 257; i++) table[i] = rng() * 2 - 1;
  return (x: number) => {
    const xi = Math.floor(x);
    const xf = x - xi;
    const a = table[((xi % 256) + 256) % 256];
    const b = table[(((xi + 1) % 256) + 256) % 256];
    return a + (b - a) * fade(xf);
  };
};

/** 1D Perlin noise: gradient = ±1, smoothstep fade. */
const perlin1D = (seed: number) => {
  const rng = makeRng(seed);
  const grad = new Float32Array(256);
  for (let i = 0; i < 256; i++) grad[i] = rng() < 0.5 ? -1 : 1;
  return (x: number) => {
    const xi = Math.floor(x);
    const xf = x - xi;
    const g0 = grad[((xi % 256) + 256) % 256];
    const g1 = grad[(((xi + 1) % 256) + 256) % 256];
    const d0 = g0 * xf;
    const d1 = g1 * (xf - 1);
    return (d0 + (d1 - d0) * fade(xf)) * 0.5;
  };
};

/** 1D simplex-style noise: a single 1D simplex cell, no lattice array. */
const simplex1D = (seed: number) => {
  const rng = makeRng(seed);
  // Two pseudo-random offsets + amplitudes per "cell" of width 1.
  const skew = (n: number) => (Math.sqrt(1 + n * n) - 1) / n;
  return (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = rng() * 2 - 1;
    const b = rng() * 2 - 1;
    const t0 = 1 - Math.abs(f);
    const t1 = 1 - Math.abs(f - 1);
    const c0 = t0 * t0 * t0 * t0 * a;
    const c1 = t1 * t1 * t1 * t1 * b;
    return (c0 + c1) * 8;
  };
};

/**
 * value-noise-1d: smoothstep-interpolated random samples on a unit
 * lattice, scaled to roughly [-1, 1]. Seeded so a given kernel is
 * reproducible. Use domain [0, 8] to get ~8 visible features.
 */
export const valueNoiseKernel = (seed = 1337, scale = 4): AnalyticKernel => {
  const n = valueNoise1D(seed);
  return {
    id: "value-noise-1d",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => pt(t, n(t * scale)),
  };
};

/** perlin-noise-1d: classic 1D Perlin gradient noise. */
export const perlinNoiseKernel = (seed = 1337, scale = 4): AnalyticKernel => {
  const n = perlin1D(seed);
  return {
    id: "perlin-noise-1d",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => pt(t, n(t * scale)),
  };
};

/** simplex-noise-1d: 1D simplex noise (lattice-free, fast). */
export const simplexNoiseKernel = (seed = 1337, scale = 4): AnalyticKernel => {
  const n = simplex1D(seed);
  return {
    id: "simplex-noise-1d",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => pt(t, n(t * scale)),
  };
};

/**
 * fbm-1d: fractal Brownian motion — sum of N octaves of value noise,
 * each at 2x frequency and 0.5x amplitude. The workhorse for natural
 * textures. Range stays [-1, 1] (normalized).
 */
export const fbmKernel = (
  seed = 1337,
  octaves = 4,
  lacunarity = 2,
  gain = 0.5,
): AnalyticKernel => {
  const n = valueNoise1D(seed);
  const ampSum = (() => {
    let s = 0;
    let a = 1;
    for (let i = 0; i < octaves; i++) {
      s += a;
      a *= gain;
    }
    return s;
  })();
  return {
    id: "fbm-1d",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => {
      let v = 0;
      let a = 1;
      let f = 1;
      for (let i = 0; i < octaves; i++) {
        v += a * n(t * f);
        a *= gain;
        f *= lacunarity;
      }
      return pt(t, v / ampSum);
    },
  };
};

/** turbulence-1d: |fbm|, ridge-style noise. Always non-negative, range [0, 1]. */
export const turbulenceKernel = (seed = 1337, octaves = 4): AnalyticKernel => {
  const n = valueNoise1D(seed);
  return {
    id: "turbulence-1d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      let v = 0;
      let a = 1;
      let f = 1;
      const g = 0.5;
      for (let i = 0; i < octaves; i++) {
        v += a * Math.abs(n(t * f));
        a *= g;
        f *= 2;
      }
      return pt(t, v);
    },
  };
};

/**
 * worley-noise-1d: cellular noise. For each x, find distance to the
 * nearest of N randomly-placed feature points within a wrapping window.
 * Output is the nearest distance, normalized. Cheap proxy for
 * Voronoi/Worley in 1D.
 */
export const worleyNoiseKernel = (seed = 1337, cells = 6): AnalyticKernel => {
  const rng = makeRng(seed);
  const pts: number[] = [];
  for (let i = 0; i < cells; i++) pts.push(rng());
  return {
    id: "worley-noise-1d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      let best = 1;
      for (let i = 0; i < cells; i++) {
        let d = Math.abs(t - pts[i]);
        d = Math.min(d, 1 - d); // wrap
        if (d < best) best = d;
      }
      return pt(t, best * cells);
    },
  };
};

/** white-noise-1d: per-sample uniform random, clamped to [-1, 1]. */
export const whiteNoiseKernel = (seed = 1337): AnalyticKernel => {
  const rng = makeRng(seed);
  return {
    id: "white-noise-1d",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => pt(t, rng() * 2 - 1),
  };
};

// ---------- utility kernels (steps, waves, windows, distributions) ----------

/** step: hard threshold at edge. y = x < edge ? 0 : 1. C0 discontinuous. */
export const stepKernel = (edge = 0.5): AnalyticKernel => ({
  id: "step",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t < edge ? 0 : 1),
});

/** smoothstep-edge: smoothstep with arbitrary edges a..b. */
export const smoothstepEdgeKernel = (a = 0.2, b = 0.8): AnalyticKernel => ({
  id: "smoothstep-edge",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t <= a) return pt(t, 0);
    if (t >= b) return pt(t, 1);
    const x = (t - a) / (b - a);
    return pt(t, x * x * (3 - 2 * x));
  },
});

/** pulse: periodic square wave, frequency `freq` cycles across [0,1]. Range [-1, 1]. */
export const pulseKernel = (freq = 4): AnalyticKernel => ({
  id: "pulse",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => {
    const phase = (t * freq) % 1;
    return pt(t, phase < 0.5 ? 1 : -1);
  },
});

/** triangle-wave: 2*|2f - floor(2f + 0.5)| - 1 style. Range [-1, 1]. */
export const triangleWaveKernel = (freq = 4): AnalyticKernel => ({
  id: "triangle-wave",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => {
    const f = (t * freq) % 1;
    return pt(t, 2 * Math.abs(2 * f - Math.floor(2 * f + 0.5)) - 1);
  },
});

/** sawtooth-wave: t*freq - floor(t*freq). Range [-1, 1]. */
export const sawtoothWaveKernel = (freq = 4): AnalyticKernel => ({
  id: "sawtooth-wave",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, (t * freq) % 1),
});

/** square-wave: sign(sin(2*pi*freq*t)). Range [-1, 1]. */
export const squareWaveKernel = (freq = 4): AnalyticKernel => ({
  id: "square-wave",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, Math.sin(2 * Math.PI * freq * t) < 0 ? -1 : 1),
});

/** window-hann: 0.5 - 0.5*cos(2*pi*x). Taper from 0 to 1 to 0 across [0,1]. */
export const windowHannKernel: AnalyticKernel = {
  id: "window-hann",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 0.5 - 0.5 * Math.cos(2 * Math.PI * t)),
};

/** window-hamming: 0.54 - 0.46*cos(2*pi*x). */
export const windowHammingKernel: AnalyticKernel = {
  id: "window-hamming",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 0.54 - 0.46 * Math.cos(2 * Math.PI * t)),
};

/** window-triangle: triangular taper. 1 - |2x - 1|. */
export const windowTriangleKernel: AnalyticKernel = {
  id: "window-triangle",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.abs(2 * t - 1)),
};

/**
 * cubic-bezier (CSS): evaluates a parametric cubic bezier with the two
 * control points (x1,y1) and (x2,y2) at parameter `t` (Newton's method
 * is used at *produce* time to map t->u so that x(u) = the input `t`).
 * The kernel here is a thin wrapper that calls `bezierAt(x, t)` from
 * the factory's closed-over `evaluateX`/`evaluateY` functions.
 */
const bezierComponent =
  (p1: number, p2: number, evaluate: (t: number) => number) => (t: number) => {
    // Newton-Raphson to find u such that x(u) = t.
    let u = t;
    for (let i = 0; i < 8; i++) {
      const x =
        3 * (1 - u) * (1 - u) * u * p1 + 3 * (1 - u) * u * u * p2 + u * u * u;
      const dx =
        3 * (1 - u) * (1 - u) * p1 +
        6 * (1 - u) * u * (p2 - p1) +
        3 * u * u * (1 - p2);
      if (Math.abs(dx) < 1e-6) break;
      const u1 = u - (x - t) / dx;
      if (Math.abs(u1 - u) < 1e-7) {
        u = u1;
        break;
      }
      u = u1;
    }
    return evaluate(u);
  };

export const cubicBezierKernel = (
  x1 = 0.25,
  y1 = 0.1,
  x2 = 0.25,
  y2 = 1,
): AnalyticKernel => {
  const evalY = (u: number) =>
    3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  const solve = bezierComponent(x1, x2, evalY);
  return {
    id: "cubic-bezier",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => pt(t, solve(t)),
  };
};

/** parabola: simple y = x^2. Different from `power` family in spirit (single shape). */
export const parabolaKernel: AnalyticKernel = {
  id: "parabola",
  domain: [-1, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t),
};

/** quadratic-ease: y = x^2 over [0,1] (CSS `easeInQuad`). */
export const quadraticEaseKernel: AnalyticKernel = {
  id: "quadratic-ease",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t),
};

/**
 * gaussian / bell-curve: y = exp(-((x - mu)/sigma)^2 / 2). Range [0, 1].
 * `mu=0.5, sigma=0.25` gives a unit-tall bell centered at x=0.5 over [0,1].
 */
export const gaussianKernel = (mu = 0.5, sigma = 0.25): AnalyticKernel => ({
  id: "gaussian",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const z = (t - mu) / sigma;
    return pt(t, Math.exp(-0.5 * z * z));
  },
});

/** bell-curve: alias of gaussian with different default sigma. Same formula. */
export const bellCurveKernel = (mu = 0.5, sigma = 0.2): AnalyticKernel => ({
  id: "bell-curve",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const z = (t - mu) / sigma;
    return pt(t, Math.exp(-0.5 * z * z));
  },
});

/** sinc: sin(pi*x) / (pi*x), with sinc(0)=1. Range ~[-0.22, 1]. */
export const sincKernel: AnalyticKernel = {
  id: "sinc",
  domain: [-4, 4],
  range: [-0.5, 1],
  evaluate: (t) => {
    if (t === 0) return pt(0, 1);
    const px = Math.PI * t;
    return pt(t, Math.sin(px) / px);
  },
};

// ---------- CSS easing set (quadratic / cubic / quartic / quintic / exponential) ----------

/** quadratic-in: y = x^2. */
export const quadraticInKernel: AnalyticKernel = {
  id: "quadratic-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t),
};

/** quadratic-out: y = 1 - (1-x)^2. */
export const quadraticOutKernel: AnalyticKernel = {
  id: "quadratic-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - (1 - t) * (1 - t)),
};

/** quadratic-in-out: piecewise. */
export const quadraticInOutKernel: AnalyticKernel = {
  id: "quadratic-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

/** cubic-in: y = x^3. */
export const cubicInKernel: AnalyticKernel = {
  id: "cubic-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t * t * t),
};

/** cubic-out: y = 1 - (1-x)^3. */
export const cubicOutKernel: AnalyticKernel = {
  id: "cubic-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const u = 1 - t;
    return pt(t, 1 - u * u * u);
  },
};

/** cubic-in-out. */
export const cubicInOutKernel: AnalyticKernel = {
  id: "cubic-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) =>
    pt(t, t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

/** quartic-in/out/in-out. */
export const quarticInKernel: AnalyticKernel = {
  id: "quartic-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t ** 4),
};
export const quarticOutKernel: AnalyticKernel = {
  id: "quartic-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const u = 1 - t;
    return pt(t, 1 - u ** 4);
  },
};
export const quarticInOutKernel: AnalyticKernel = {
  id: "quartic-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) =>
    pt(t, t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
};

/** quintic-in/out/in-out. */
export const quinticInKernel: AnalyticKernel = {
  id: "quintic-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t ** 5),
};
export const quinticOutKernel: AnalyticKernel = {
  id: "quintic-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const u = 1 - t;
    return pt(t, 1 - u ** 5);
  },
};
export const quinticInOutKernel: AnalyticKernel = {
  id: "quintic-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) =>
    pt(t, t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
};

/** exponential-in: 2^(10x - 10) (CSS spec). */
export const exponentialInKernel: AnalyticKernel = {
  id: "exponential-in",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
};

/** exponential-out: 1 - 2^(-10x). */
export const exponentialOutKernel: AnalyticKernel = {
  id: "exponential-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/** exponential-in-out: piecewise. */
export const exponentialInOutKernel: AnalyticKernel = {
  id: "exponential-in-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t === 0) return pt(0, 0);
    if (t === 1) return pt(1, 1);
    return pt(
      t,
      t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2,
    );
  },
};

/** sine-out: 1 - sine-ease(1 - x) — mirror of sine-in. */
export const sineOutKernel: AnalyticKernel = {
  id: "sine-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.sin(((1 - t) * Math.PI) / 2)),
};

/** cosine-out: 1 - cosine-ease(1 - x) — mirror of cosine-in. */
export const cosineOutKernel: AnalyticKernel = {
  id: "cosine-out",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.sin(((1 - t) * Math.PI) / 2)),
};

/**
 * anticipate: classic game-feel ease — small anticipation, then settle.
 * Built as `1 - elasticOut(1 - x)` truncated to [0,1].
 */
export const anticipateKernel: AnalyticKernel = {
  id: "anticipate",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    // 1 - bounceOut(1 - x) clamped, gives a soft "wind up then settle"
    const u = 1 - t;
    const env = u * u;
    const osc = (1 + Math.cos(2 * Math.PI * 2 * u)) / 2;
    return pt(t, 1 - (1 - env * osc));
  },
};

// ---------- tier 2: simple new kernels ----------

/** spring: damped harmonic oscillator. */
export const springKernel = (
  damping = 0.5,
  mass = 1,
  stiffness = 4,
): AnalyticKernel => {
  const omega = Math.sqrt(stiffness / mass);
  const omegaD = omega * Math.sqrt(1 - damping * damping);
  const c1 = (damping * omega) / omegaD;
  return {
    id: "spring",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) =>
      pt(
        t,
        1 -
          Math.exp(-damping * omega * t) *
            (Math.cos(omegaD * t) + c1 * Math.sin(omegaD * t)),
      ),
  };
};

/** steps-easing: staircase quantisation; smoothness > 0 smooths the transitions. */
export const stepsEasingKernel = (steps = 4, smoothness = 0): AnalyticKernel => ({
  id: "steps-easing",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const x = t * steps;
    const i = Math.floor(x);
    if (i >= steps) return pt(t, 1);
    if (smoothness <= 0) return pt(t, i / steps);
    const f = x - i;
    const sf = f * f * (3 - 2 * f);
    return pt(t, (i + sf) / steps);
  },
});

/** smoothmin: -log(e^(-k*t) + e^(-k*(1-t))) / k. */
export const smoothminKernel = (k = 1): AnalyticKernel => ({
  id: "smoothmin",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, -Math.log(Math.exp(-k * t) + Math.exp(-k * (1 - t))) / k),
});

/** smoothmax: log(e^(k*t) + e^(k*(1-t))) / k. */
export const smoothmaxKernel = (k = 1): AnalyticKernel => ({
  id: "smoothmax",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.log(Math.exp(k * t) + Math.exp(k * (1 - t))) / k),
});

/** remap: remap t from [loIn, hiIn] to [loOut, hiOut]. */
export const remapKernel = (
  loIn = 0.2,
  hiIn = 0.8,
  loOut = 0,
  hiOut = 1,
): AnalyticKernel => ({
  id: "remap",
  domain: [0, 1],
  range: [loOut, hiOut],
  evaluate: (t) =>
    pt(t, loOut + ((t - loIn) * (hiOut - loOut)) / (hiIn - loIn || 1)),
});

/** inverse-lerp: (t - lo) / (hi - lo). Maps [lo,hi] to [0,1]. */
export const inverseLerpKernel = (lo = 0.2, hi = 0.8): AnalyticKernel => ({
  id: "inverse-lerp",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, (t - lo) / (hi - lo || 1)),
});

/** fresnel: bias + (1 - bias)*(1 - t)^power. Classic Fresnel approximation. */
export const fresnelKernel = (power = 5, bias = 0): AnalyticKernel => ({
  id: "fresnel",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, bias + (1 - bias) * Math.pow(1 - t, power)),
});

/** adsr: classic attack-decay-sustain-release envelope over [0,1]. */
export const adsrKernel = (
  attack = 0.1,
  decay = 0.2,
  sustain = 0.5,
  release = 0.3,
  sustainLevel = 0.6,
): AnalyticKernel => ({
  id: "adsr",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < attack) return pt(t, t / attack);
    const t1 = attack + decay;
    if (t < t1) return pt(t, 1 - (1 - sustainLevel) * (t - attack) / decay);
    const t2 = t1 + sustain;
    if (t < t2) return pt(t, sustainLevel);
    return pt(t, sustainLevel * (1 - (t - t2) / release));
  },
});

/** friction: deceleration via y = 1 - (1 - t) / (1 + (friction/mass)*t). */
export const frictionKernel = (mass = 1, friction = 2): AnalyticKernel => ({
  id: "friction",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - (1 - t) / (1 + (friction / mass) * t)),
});

/** hermite: cubic Hermite interpolation between p0/p1 with tangents m0/m1. */
export const hermiteKernel = (p0 = 0, p1 = 1, m0 = 0, m1 = 0): AnalyticKernel => ({
  id: "hermite",
  domain: [0, 1],
  range: [
    Math.min(p0, p1, p0 + m0 / 3, p1 - m1 / 3),
    Math.max(p0, p1, p0 + m0 / 3, p1 - m1 / 3),
  ],
  evaluate: (t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return pt(t, h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1);
  },
});

/** overshoot-settle: t + overshoot * t * (1-t) * e^(-settle * t). */
export const overshootSettleKernel = (overshoot = 0.2, settle = 0.5): AnalyticKernel => ({
  id: "overshoot-settle",
  domain: [0, 1],
  range: [0, 1.2],
  evaluate: (t) => pt(t, t + overshoot * t * (1 - t) * Math.exp(-settle * t)),
});

// ---------- tier 3: medium complexity ----------

/** s-curve-contrast: contrast adjustment via power curve above/below 0.5. */
export const sCurveContrastKernel = (contrast = 1): AnalyticKernel => ({
  id: "s-curve-contrast",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) =>
    pt(
      t,
      t > 0.5 ? 1 - Math.pow(1 - t, contrast * 2) : Math.pow(t, contrast * 2),
    ),
});

/** reinhard: Reinhard tone mapping with white point adaptation. */
export const reinhardKernel = (whitePoint = 1): AnalyticKernel => ({
  id: "reinhard",
  domain: [0, 10],
  range: [0, 1],
  evaluate: (t) =>
    pt(t, (t * (1 + t / (whitePoint * whitePoint))) / (1 + t)),
});

/** filmic: ACES filmic tone-mapping approximation (a,b,c,d,e). */
export const filmicKernel = (
  a = 0.22,
  b = 0.3,
  c = 0.1,
  d = 0.2,
  e = 0.01,
): AnalyticKernel => ({
  id: "filmic",
  domain: [0, 10],
  range: [0, 1],
  evaluate: (t) => pt(t, (t * (a * t + b)) / (t * (c * t + d) + e)),
});

/** wavefolder: |((t*fold+1)%2 - 1)|*2 - 1. Domain/range [-1,1]. */
export const wavefolderKernel = (fold = 2): AnalyticKernel => ({
  id: "wavefolder",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, Math.abs(((t * fold + 1) % 2) - 1) * 2 - 1),
});

/** soft-clip: tanh-based soft clipping distortion. */
export const softClipKernel = (threshold = 0.5): AnalyticKernel => ({
  id: "soft-clip",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => {
    const absT = Math.abs(t);
    if (absT < threshold) return pt(t, t);
    const sign = t < 0 ? -1 : 1;
    return pt(
      t,
      sign *
        (threshold +
          (1 - threshold) * Math.tanh((absT - threshold) / (1 - threshold))),
    );
  },
});

/** cubic-distortion: t - drive * t^3 / 3. */
export const cubicDistortionKernel = (drive = 1): AnalyticKernel => ({
  id: "cubic-distortion",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, t - (drive * t * t * t) / 3),
});

/** compressor: classic compressor knee response curve. */
export const compressorKernel = (
  threshold = 0.5,
  ratio = 4,
  knee = 0.1,
): AnalyticKernel => ({
  id: "compressor",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t <= threshold - knee / 2) return pt(t, t);
    if (t <= threshold + knee / 2) {
      const diff = t - threshold;
      const k2 = knee / 2;
      return pt(
        t,
        t + ((k2 - diff) * (k2 - diff)) / (2 * knee) * (1 / ratio - 1),
      );
    }
    return pt(t, threshold + (t - threshold) / ratio);
  },
});

/** lfo-shapes: blend between LFO shapes (0=sine, 1=tri, 2=saw, 3=sq, 4=random). */
export const lfoShapesKernel = (shape = 0, freq = 4): AnalyticKernel => {
  const rng = makeRng(1337);
  const shTable = new Float32Array(256);
  for (let i = 0; i < 256; i++) shTable[i] = rng() * 2 - 1;
  return {
    id: "lfo-shapes",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => {
      const phase = (t * freq) % 1;
      const sine = Math.sin(2 * Math.PI * phase);
      const tri =
        2 * Math.abs(2 * phase - Math.floor(2 * phase + 0.5)) - 1;
      const saw = 2 * phase - 1;
      const sq = phase < 0.5 ? 1 : -1;
      const cycle = (Math.floor(t * freq) % 256 + 256) % 256;
      const sh = shTable[cycle];
      const shapes = [sine, tri, saw, sq, sh];
      const s = Math.max(0, Math.min(shapes.length - 1, shape));
      const idx = Math.floor(s);
      const frac = s - idx;
      if (frac === 0) return pt(t, shapes[idx]);
      const next = shapes[Math.min(idx + 1, shapes.length - 1)];
      return pt(t, shapes[idx] + (next - shapes[idx]) * frac);
    },
  };
};

/** worley-f2-f1: 1D cellular noise — second minus first nearest distance. */
export const worleyF2F1Kernel = (seed = 1337, cells = 6): AnalyticKernel => {
  const rng = makeRng(seed);
  const pts: number[] = [];
  for (let i = 0; i < cells; i++) pts.push(rng());
  return {
    id: "worley-f2-f1",
    domain: [0, 1],
    range: [-0.5, 0.5],
    evaluate: (t) => {
      let best = 1;
      let second = 1;
      for (let i = 0; i < cells; i++) {
        let d = Math.abs(t - pts[i]);
        d = Math.min(d, 1 - d);
        if (d < best) {
          second = best;
          best = d;
        } else if (d < second) {
          second = d;
        }
      }
      return pt(t, (second - best) * cells - 0.5);
    },
  };
};

/** voronoi-jitter-1d: 1D Voronoi with jittered feature points. */
export const voronoiJitterKernel = (
  seed = 1337,
  cells = 6,
  jitter = 0.5,
): AnalyticKernel => {
  const rng = makeRng(seed);
  const pts: number[] = [];
  for (let i = 0; i < cells; i++) {
    const cc = (i + 0.5) / cells;
    pts.push(cc + (rng() - 0.5) * jitter * (1 / cells));
  }
  return {
    id: "voronoi-jitter-1d",
    domain: [0, 1],
    range: [0, 1],
    evaluate: (t) => {
      let best = 1;
      for (let i = 0; i < cells; i++) {
        const d = Math.abs(t - pts[i]);
        if (d < best) best = d;
      }
      return pt(t, best * cells);
    },
  };
};

/** sdf-sphere: 1D SDF of an interval — |t - cx| - radius. */
export const sdfSphereKernel = (radius = 0.3, cx = 0.5): AnalyticKernel => ({
  id: "sdf-sphere",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => pt(t, Math.abs(t - cx) - radius),
});

/** sdf-box: 1D SDF of a box — |t - cx| - width/2. */
export const sdfBoxKernel = (width = 0.3, cx = 0.5): AnalyticKernel => ({
  id: "sdf-box",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => pt(t, Math.abs(t - cx) - width / 2),
});

/** sdf-round-box: 1D SDF of a rounded box. */
export const sdfRoundBoxKernel = (
  width = 0.3,
  cx = 0.5,
  r = 0.05,
): AnalyticKernel => ({
  id: "sdf-round-box",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => {
    const d = Math.abs(t - cx) - (width / 2 - r);
    const inside = Math.max(d, 0) - r;
    return pt(t, inside);
  },
});

/** sdf-torus: 1D SDF of two intervals (torus cross-section). */
export const sdfTorusKernel = (
  majorR = 0.3,
  minorR = 0.1,
  cx = 0.5,
): AnalyticKernel => ({
  id: "sdf-torus",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => {
    const d1 = Math.abs(t - (cx - majorR)) - minorR;
    const d2 = Math.abs(t - (cx + majorR)) - minorR;
    return pt(t, Math.min(d1, d2));
  },
});

/** biquad: biquad filter magnitude response over [0,pi]. */
export const biquadKernel = (
  a0 = 1,
  a1 = 0,
  a2 = 0,
  b1 = 0,
  b2 = 0,
): AnalyticKernel => ({
  id: "biquad",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) => {
    const w = t * Math.PI;
    const cw = Math.cos(w);
    const c2w = Math.cos(2 * w);
    const sw = Math.sin(w);
    const s2w = Math.sin(2 * w);
    const numR = a0 + a1 * cw + a2 * c2w;
    const numI = a1 * sw + a2 * s2w;
    const denR = 1 + b1 * cw + b2 * c2w;
    const denI = b1 * sw + b2 * s2w;
    const mag = Math.sqrt(
      (numR * numR + numI * numI) / (denR * denR + denI * denI),
    );
    return pt(t, mag);
  },
});

/** resonant-filter: 2nd-order resonant filter magnitude response. */
export const resonantFilterKernel = (
  cutoff = 0.3,
  resonance = 0.5,
): AnalyticKernel => ({
  id: "resonant-filter",
  domain: [0, 1],
  range: [0, 10],
  evaluate: (t) => {
    const wr = cutoff > 1e-10 ? t / cutoff : t * 1e10;
    const r2 = 2 * resonance * wr;
    return pt(
      t,
      1 / Math.sqrt((1 - wr * wr) * (1 - wr * wr) + r2 * r2),
    );
  },
});

/** domain-warp: Perlin noise with domain warping. */
export const domainWarpKernel = (
  warp = 0.1,
  freq = 4,
  seed = 1337,
): AnalyticKernel => {
  const n = perlin1D(seed);
  return {
    id: "domain-warp",
    domain: [0, 1],
    range: [-1, 1],
    evaluate: (t) => pt(t, n(t + n(t * freq) * warp)),
  };
};

// ---------- tier 4: niche / complex ----------

/** rubber-band: t + overshoot * e^(-damping*t) * sin(stiffness*t). */
export const rubberBandKernel = (
  stiffness = 3,
  damping = 0.5,
  overshoot = 0.2,
): AnalyticKernel => ({
  id: "rubber-band",
  domain: [0, 1],
  range: [-0.5, 1.5],
  evaluate: (t) =>
    pt(
      t,
      t +
        overshoot *
          Math.exp(-damping * t) *
          Math.sin(stiffness * t),
    ),
});

/** snap-grid: round(t / snap) * snap — quantization. */
export const snapGridKernel = (snap = 0.1): AnalyticKernel => ({
  id: "snap-grid",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, Math.round(t / snap) * snap),
});

/** catmull-rom: Catmull-Rom spline through four control points. */
export const catmullRomKernel = (
  p0 = 0,
  p1 = 0.5,
  p2 = 1,
  p3 = 0.8,
  alpha = 0.5,
): AnalyticKernel => ({
  id: "catmull-rom",
  domain: [0, 1],
  range: [Math.min(p0, p1, p2, p3), Math.max(p0, p1, p2, p3)],
  evaluate: (t) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const s = 1 - alpha;
    const m0 = (s * (p2 - p0)) / 2;
    const m1 = (s * (p3 - p1)) / 2;
    return pt(
      t,
      (2 * t3 - 3 * t2 + 1) * p1 +
        (t3 - 2 * t2 + t) * m0 +
        (-2 * t3 + 3 * t2) * p2 +
        (t3 - t2) * m1,
    );
  },
});

/** fm-feedback: sin(2*pi*cf*t + mi * sin(2*pi*mf*t)). */
export const fmFeedbackKernel = (
  modIndex = 1,
  modFreq = 3,
  carrierFreq = 5,
): AnalyticKernel => ({
  id: "fm-feedback",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) =>
    pt(
      t,
      Math.sin(
        2 * Math.PI * carrierFreq * t +
          modIndex * Math.sin(2 * Math.PI * modFreq * t),
      ),
    ),
});

/** phase-distortion: cos(2*pi*(t + distortion * sin(2*pi*t*(1+asymmetry)))). */
export const phaseDistortionKernel = (
  distortion = 0.5,
  asymmetry = 0,
): AnalyticKernel => ({
  id: "phase-distortion",
  domain: [0, 1],
  range: [-1, 1],
  evaluate: (t) =>
    pt(
      t,
      Math.cos(
        2 *
          Math.PI *
          (t + distortion * Math.sin(2 * Math.PI * t * (1 + asymmetry))),
      ),
    ),
});

/** chebyshev: Chebyshev polynomials of the first kind. T0=1, T1=x, Tn=2x*T_{n-1}-T_{n-2}. */
export const chebyshevKernel = (order = 3): AnalyticKernel => ({
  id: "chebyshev",
  domain: [-1, 1],
  range: [-1, 1],
  evaluate: (t) => {
    if (order === 0) return pt(t, 1);
    if (order === 1) return pt(t, t);
    let t0 = 1;
    let t1 = t;
    for (let i = 2; i <= order; i++) {
      const tn = 2 * t * t1 - t0;
      t0 = t1;
      t1 = tn;
    }
    return pt(t, t1);
  },
});

/** hysteresis: Schmitt-trigger-style transition with dead zone. */
export const hysteresisKernel = (threshold = 0.3, width = 0.1): AnalyticKernel => ({
  id: "hysteresis",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < threshold - width / 2) return pt(t, 0);
    if (t > threshold + width / 2) return pt(t, 1);
    const x = (t - (threshold - width / 2)) / width;
    return pt(t, x);
  },
});

/** logistic-map: x_{n+1} = r * x_n * (1 - x_n) iterated `iterations` times. */
export const logisticMapKernel = (r = 3.8, iterations = 100): AnalyticKernel => ({
  id: "logistic-map",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    let x = t;
    for (let i = 0; i < iterations; i++) {
      x = r * x * (1 - x);
    }
    return pt(t, x);
  },
});

/** svf: state-variable filter response. mode 0=lowpass, 1=highpass, 2=bandpass. */
export const svfKernel = (
  cutoff = 0.3,
  resonance = 0.5,
  mode = 0,
): AnalyticKernel => ({
  id: "svf",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    const wr = cutoff > 1e-10 ? t / cutoff : t * 1e10;
    const denom = Math.sqrt(
      (1 - wr * wr) * (1 - wr * wr) +
        (2 * resonance * wr) * (2 * resonance * wr),
    );
    if (mode >= 1) {
      if (mode >= 2) return pt(t, (2 * resonance * wr) / denom);
      return pt(t, (wr * wr) / denom);
    }
    return pt(t, 1 / denom);
  },
});

/** portamento: 1 - e^(-t/speed) — exponential glide. */
export const portamentoKernel = (speed = 0.5): AnalyticKernel => ({
  id: "portamento",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => pt(t, 1 - Math.exp(-t / speed)),
});

/** ad: attack-decay envelope (no sustain). */
export const adKernel = (attack = 0.3, decay = 0.4): AnalyticKernel => ({
  id: "ad",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < attack) return pt(t, t / attack);
    if (t < attack + decay) return pt(t, 1 - (t - attack) / decay);
    return pt(t, 0);
  },
});

/** ar: attack-release envelope (exponential release). */
export const arKernel = (attack = 0.3, release = 0.4): AnalyticKernel => ({
  id: "ar",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < attack) return pt(t, t / attack);
    return pt(t, Math.exp(-(t - attack) / release));
  },
});

/** dadsr: delay-attack-decay-sustain-release envelope. */
export const dadsrKernel = (
  delay = 0.1,
  attack = 0.2,
  decay = 0.2,
  sustain = 0.3,
  release = 0.2,
  sustainLevel = 0.6,
): AnalyticKernel => ({
  id: "dadsr",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < delay) return pt(t, 0);
    const t1 = delay + attack;
    if (t < t1) return pt(t, (t - delay) / attack);
    const t2 = t1 + decay;
    if (t < t2) return pt(t, 1 - (1 - sustainLevel) * (t - t1) / decay);
    const t3 = t2 + sustain;
    if (t < t3) return pt(t, sustainLevel);
    return pt(t, sustainLevel * (1 - (t - t3) / release));
  },
});

/** asr: attack-sustain-release envelope. */
export const asrKernel = (
  attack = 0.2,
  sustain = 0.5,
  release = 0.3,
  sustainLevel = 0.7,
): AnalyticKernel => ({
  id: "asr",
  domain: [0, 1],
  range: [0, 1],
  evaluate: (t) => {
    if (t < attack) return pt(t, sustainLevel * (t / attack));
    if (t < attack + sustain) return pt(t, sustainLevel);
    return pt(t, sustainLevel * (1 - (t - attack - sustain) / release));
  },
});

/** sdf-union: min(sdf1, sdf2) — boolean union. */
export const sdfUnionKernel = (
  radius1 = 0.3,
  cx1 = 0.3,
  radius2 = 0.3,
  cx2 = 0.7,
): AnalyticKernel => ({
  id: "sdf-union",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => {
    const d1 = Math.abs(t - cx1) - radius1;
    const d2 = Math.abs(t - cx2) - radius2;
    return pt(t, Math.min(d1, d2));
  },
});

/** sdf-intersect: max(sdf1, sdf2) — boolean intersection. */
export const sdfIntersectKernel = (
  radius1 = 0.3,
  cx1 = 0.3,
  radius2 = 0.3,
  cx2 = 0.7,
): AnalyticKernel => ({
  id: "sdf-intersect",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => {
    const d1 = Math.abs(t - cx1) - radius1;
    const d2 = Math.abs(t - cx2) - radius2;
    return pt(t, Math.max(d1, d2));
  },
});

/** sdf-subtract: max(sdf1, -sdf2) — boolean subtraction. */
export const sdfSubtractKernel = (
  radius1 = 0.3,
  cx1 = 0.3,
  radius2 = 0.3,
  cx2 = 0.7,
): AnalyticKernel => ({
  id: "sdf-subtract",
  domain: [0, 1],
  range: [-1, 0.5],
  evaluate: (t) => {
    const d1 = Math.abs(t - cx1) - radius1;
    const d2 = Math.abs(t - cx2) - radius2;
    return pt(t, Math.max(d1, -d2));
  },
});

// ---------- sampler ----------

export const sampleKernel = (
  kernel: CurveKernel,
  hint: SamplingHint,
): CurveSamplePoint[] => {
  if (hint.strategy !== "uniform") {
    throw new Error(`Unknown sampling strategy: ${hint.strategy as string}`);
  }
  const [t0, t1] = kernel.domain;
  const n = Math.max(2, Math.floor(hint.resolution));
  const out: CurveSamplePoint[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = t0 + ((t1 - t0) * i) / (n - 1);
    out[i] = kernel.evaluate(t);
  }
  return out;
};

// ---------- projection ----------

/**
 * Maps kernel-domain points to viewBox coordinates. Uses the kernel's
 * `domain` and `range` (not the sample min/max) so the curve always
 * spans the full viewBox in both axes, regardless of its actual values.
 * Y is inverted (math up, screen down).
 */
export const projectToViewBox = (
  points: CurveSamplePoint[],
  viewBox: CurveRect,
  domain: [number, number],
  range: [number, number],
): CurveSamplePoint[] => {
  const tSpan = domain[1] - domain[0] || 1;
  const ySpan = range[1] - range[0] || 1;
  return points.map((p) => ({
    x: viewBox.x + ((p.x - domain[0]) / tSpan) * viewBox.w,
    y: viewBox.y + (1 - (p.y - range[0]) / ySpan) * viewBox.h,
    z: p.z,
  }));
};

// ---------- default sampling ----------

export const DEFAULT_SAMPLING: SamplingHint = {
  strategy: "uniform",
  resolution: SAMPLE_RESOLUTION,
};
