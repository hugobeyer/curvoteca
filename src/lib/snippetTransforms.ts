// ---------------------------------------------------------------------------
// snippetTransforms.ts
// Additive display-time snippet transforms for the detail overlay.
// Raw snippets stay as the registry source of truth; this module only builds
// the copy/display text from the selected language plus active option chips.
// ---------------------------------------------------------------------------

export type SnippetOptionKey =
  | "constants"
  | "params"
  | "bindings"
  | "clamp"
  | "fit"
  | "function"
  | "comments"
  | "uniforms";

export type SnippetOptionState = Partial<Record<SnippetOptionKey, boolean>>;

export interface SnippetParam {
  label?: string;
  default?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
}

export interface SnippetCurveEntry {
  id: string;
  name: string;
  summary?: string;
  equation?: string;
  domain?: [number, number];
  range?: [number, number];
  params?: Record<string, SnippetParam>;
  snippetOptions?: SnippetOptionState;
}

export interface SnippetTransformInput {
  code: string;
  lang: string;
  entry: SnippetCurveEntry;
  activeOptions?: SnippetOptionState;
  availableOptions?: SnippetOptionState;
}

const OPTION_KEYS: SnippetOptionKey[] = [
  "constants",
  "params",
  "bindings",
  "clamp",
  "fit",
  "function",
  "comments",
  "uniforms",
];

const SHADER_LANGS = new Set([
  "glsl",
  "hlsl",
  "metal",
  "opencl",
  "cuda",
  "vex",
  "shadertoy",
]);

const HOUDINI_VEX_LANGS = new Set(["vex"]);
const HOUDINI_OPENCL_LANGS = new Set(["opencl"]);

const FUNCTION_LIKE: Record<string, RegExp> = {
  js: /\bfunction\b|=>/,
  ts: /\bfunction\b|=>/,
  glsl: /\b(float|vec[234]|int|void)\s+\w+\s*\(/,
  hlsl: /\b(float|float[234]|int|void)\s+\w+\s*\(/,
  metal: /\b(float|float[234]|half|void)\s+\w+\s*\(/,
  opencl: /\b(float|float[234]|void)\s+\w+\s*\(/,
  cuda: /\b(float|double|void)\s+\w+\s*\(/,
  vex: /\b(float|vector|int|void)\s+\w+\s*\(/,
  python: /\bdef\s+\w+\s*\(/,
  lua: /\bfunction\s+\w+\s*\(/,
  rust: /\bfn\s+\w+\s*\(/,
  c: /\b(float|double|void)\s+\w+\s*\(/,
  cpp: /\b(float|double|auto|void)\s+\w+\s*\(/,
  csharp: /\b(float|double|void)\s+\w+\s*\(/,
  gdscript: /\bfunc\s+\w+\s*\(/,
};

const commentPrefix = (lang: string): string => {
  if (lang === "python") return "#";
  if (lang === "lua") return "--";
  return "//";
};

const safeName = (value: string): string =>
  value
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/^([0-9])/, "_$1");

const upperName = (value: string): string => safeName(value).toUpperCase();

const n = (value: unknown, shader = false): string => {
  const num = typeof value === "number" && Number.isFinite(value) ? value : 0;
  if (!shader) return String(num);
  if (Number.isInteger(num)) return `${num}.0`;
  return String(num);
};

const normalizeOptions = (
  active: SnippetOptionState | undefined,
  available: SnippetOptionState | undefined,
): Required<SnippetOptionState> => {
  const out = {} as Required<SnippetOptionState>;
  OPTION_KEYS.forEach((key) => {
    out[key] = !!(active && active[key] && (!available || available[key]));
  });
  return out;
};

const hasFunctionShape = (lang: string, code: string): boolean => {
  const re = FUNCTION_LIKE[lang];
  return re ? re.test(code) : /\w+\s*\([^)]*\)\s*[{=]/.test(code);
};

const commentBlock = (entry: SnippetCurveEntry, lang: string): string => {
  const p = commentPrefix(lang);
  const lines = [`${p} Curvoteca: ${entry.name}`];
  if (entry.summary) lines.push(`${p} ${entry.summary}`);
  return lines.join("\n");
};

const constantsBlock = (entry: SnippetCurveEntry, lang: string): string => {
  const shader = SHADER_LANGS.has(lang);
  const domain = entry.domain || [0, 1];
  const range = entry.range || [0, 1];
  const params = entry.params || {};
  const rows: string[] = [];

  if (lang === "python") {
    rows.push(`DOMAIN_MIN = ${n(domain[0])}`);
    rows.push(`DOMAIN_MAX = ${n(domain[1])}`);
    rows.push(`RANGE_MIN = ${n(range[0])}`);
    rows.push(`RANGE_MAX = ${n(range[1])}`);
    Object.keys(params).forEach((key) => {
      rows.push(`${upperName(key)} = ${n(params[key].default)}`);
    });
    return rows.join("\n");
  }

  if (lang === "lua") {
    rows.push(`local DOMAIN_MIN = ${n(domain[0])}`);
    rows.push(`local DOMAIN_MAX = ${n(domain[1])}`);
    rows.push(`local RANGE_MIN = ${n(range[0])}`);
    rows.push(`local RANGE_MAX = ${n(range[1])}`);
    Object.keys(params).forEach((key) => {
      rows.push(`local ${upperName(key)} = ${n(params[key].default)}`);
    });
    return rows.join("\n");
  }

  if (lang === "rust") {
    rows.push(`const DOMAIN_MIN: f64 = ${n(domain[0])};`);
    rows.push(`const DOMAIN_MAX: f64 = ${n(domain[1])};`);
    rows.push(`const RANGE_MIN: f64 = ${n(range[0])};`);
    rows.push(`const RANGE_MAX: f64 = ${n(range[1])};`);
    Object.keys(params).forEach((key) => {
      rows.push(`const ${upperName(key)}: f64 = ${n(params[key].default)};`);
    });
    return rows.join("\n");
  }

  const type = shader ? "float " : "";
  rows.push(`const ${type}DOMAIN_MIN = ${n(domain[0], shader)};`);
  rows.push(`const ${type}DOMAIN_MAX = ${n(domain[1], shader)};`);
  rows.push(`const ${type}RANGE_MIN = ${n(range[0], shader)};`);
  rows.push(`const ${type}RANGE_MAX = ${n(range[1], shader)};`);
  Object.keys(params).forEach((key) => {
    rows.push(
      `const ${type}${upperName(key)} = ${n(params[key].default, shader)};`,
    );
  });
  return rows.join("\n");
};

const uniformsBlock = (entry: SnippetCurveEntry, lang: string): string => {
  // VEX and OpenCL use their own binding/param styles, not GLSL uniforms
  if (HOUDINI_VEX_LANGS.has(lang) || HOUDINI_OPENCL_LANGS.has(lang)) return "";
  if (!SHADER_LANGS.has(lang)) return "";
  const params = entry.params || {};
  const rows = [
    "uniform float u_domainMin;",
    "uniform float u_domainMax;",
    "uniform float u_rangeMin;",
    "uniform float u_rangeMax;",
  ];
  Object.keys(params).forEach((key) => {
    rows.push(`uniform float u_${safeName(key)};`);
  });
  return rows.join("\n");
};

// VEX parameter block: reads Houdini wrangle parameters via chf()/chi()/chv()/chs()
const vexParamsBlock = (entry: SnippetCurveEntry): string => {
  const params = entry.params || {};
  const rows: string[] = [];

  rows.push(`float domain_min = chf("domain_min");`);
  rows.push(`float domain_max = chf("domain_max");`);
  rows.push(`float range_min = chf("range_min");`);
  rows.push(`float range_max = chf("range_max");`);
  Object.keys(params).forEach((key) => {
    const paramName = safeName(key).toLowerCase();
    rows.push(`float ${paramName} = chf("${paramName}");`);
  });
  return rows.join("\n");
};

// Houdini OpenCL binding block: uses #bind parm + @KERNEL + @name style
const openclBindingsBlock = (
  entry: SnippetCurveEntry,
  helperCode: string,
): string => {
  const params = entry.params || {};
  const bindRows: string[] = [];
  const kernelRows: string[] = [];

  bindRows.push(`#bind parm domain_min float`);
  bindRows.push(`#bind parm domain_max float`);
  bindRows.push(`#bind parm range_min float`);
  bindRows.push(`#bind parm range_max float`);

  kernelRows.push(`    float domain_min = @domain_min;`);
  kernelRows.push(`    float domain_max = @domain_max;`);
  kernelRows.push(`    float range_min = @range_min;`);
  kernelRows.push(`    float range_max = @range_max;`);

  Object.keys(params).forEach((key) => {
    const paramName = safeName(key).toLowerCase();
    bindRows.push(`#bind parm ${paramName} float`);
    kernelRows.push(`    float ${paramName} = @${paramName};`);
  });

  kernelRows.push("");
  kernelRows.push(
    "    // Bind geometry or sample input above, then call the curve helper.",
  );
  kernelRows.push("    // Example: float y = curve(x);");

  const helpers = helperCode.trim();

  return [
    bindRows.join("\n"),
    helpers,
    `@KERNEL\n{\n${kernelRows.join("\n")}\n}`,
  ]
    .filter(Boolean)
    .join("\n\n");
};

const clampBlock = (lang: string): string => {
  if (lang === "python")
    return "def saturate(v):\n    return max(0.0, min(1.0, v))";
  if (lang === "lua")
    return "function saturate(v) return math.max(0, math.min(1, v)) end";
  if (lang === "rust")
    return "fn saturate(v: f64) -> f64 { v.max(0.0).min(1.0) }";
  if (lang === "gdscript")
    return "func saturate(v: float) -> float:\n    return clamp(v, 0.0, 1.0)";
  if (SHADER_LANGS.has(lang))
    return "float saturate(float v) { return clamp(v, 0.0, 1.0); }";
  return "const saturate = (v) => Math.max(0, Math.min(1, v));";
};

const fitBlock = (lang: string): string => {
  if (lang === "python") {
    return "def fit01(v, in_min, in_max):\n    return saturate((v - in_min) / (in_max - in_min))";
  }
  if (lang === "lua") {
    return "function fit01(v, inMin, inMax) return saturate((v - inMin) / (inMax - inMin)) end";
  }
  if (lang === "rust") {
    return "fn fit01(v: f64, in_min: f64, in_max: f64) -> f64 { saturate((v - in_min) / (in_max - in_min)) }";
  }
  if (lang === "gdscript") {
    return "func fit01(v: float, in_min: float, in_max: float) -> float:\n    return saturate((v - in_min) / (in_max - in_min))";
  }
  if (SHADER_LANGS.has(lang)) {
    return "float fit01(float v, float inMin, float inMax) { return saturate((v - inMin) / (inMax - inMin)); }";
  }
  return "const fit01 = (v, inMin, inMax) => saturate((v - inMin) / (inMax - inMin));";
};

const wrapExpressionAsFunction = (
  code: string,
  entry: SnippetCurveEntry,
  lang: string,
): string => {
  const body = code.trim();
  if (!body || lang === "equation" || hasFunctionShape(lang, body)) return body;
  const name = safeName(entry.id || entry.name || "curve") || "curve";
  if (lang === "python") return `def ${name}(x):\n    return ${body}`;
  if (lang === "lua") return `function ${name}(x) return ${body} end`;
  if (lang === "rust") return `fn ${name}(x: f64) -> f64 { ${body} }`;
  if (lang === "gdscript")
    return `func ${name}(x: float) -> float:\n    return ${body}`;
  if (SHADER_LANGS.has(lang))
    return `float ${name}(float x) { return ${body}; }`;
  return `function ${name}(x) { return ${body}; }`;
};

const formatCompactCode = (code: string, lang: string): string => {
  const trimmed = code.trim();
  if (
    !trimmed ||
    lang === "equation" ||
    trimmed.includes("\n") ||
    trimmed.length < 90 ||
    !/[{};]/.test(trimmed)
  ) {
    return trimmed;
  }

  let out = "";
  let indent = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  const pad = () => "  ".repeat(Math.max(0, indent));

  for (let i = 0; i < trimmed.length; i += 1) {
    const ch = trimmed[i];
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === "{") {
      out = out.trimEnd() + " {\n";
      indent += 1;
      out += pad();
      continue;
    }
    if (ch === "}") {
      indent -= 1;
      out = out.trimEnd() + "\n" + pad() + "}";
      if (trimmed[i + 1] && trimmed[i + 1] !== ";") out += "\n" + pad();
      continue;
    }
    if (ch === ";") {
      out = out.trimEnd() + ";\n" + pad();
      continue;
    }
    out += ch;
  }

  return out
    .replace(/}\n\s*else/g, "} else")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export function transformSnippet(input: SnippetTransformInput): string {
  const lang = input.lang || "text";
  const options = normalizeOptions(input.activeOptions, input.availableOptions);

  if (HOUDINI_OPENCL_LANGS.has(lang) && options.bindings) {
    const blocks: string[] = [];

    if (options.comments) blocks.push(commentBlock(input.entry, lang));

    const helperBlocks: string[] = [];
    if (options.clamp) helperBlocks.push(clampBlock(lang));
    if (options.fit) {
      if (!options.clamp) helperBlocks.push(clampBlock(lang));
      helperBlocks.push(fitBlock(lang));
    }

    const helperBody = formatCompactCode(
      wrapExpressionAsFunction(input.code, input.entry, lang),
      lang,
    );

    helperBlocks.push(helperBody);
    blocks.push(
      openclBindingsBlock(
        input.entry,
        helperBlocks.filter(Boolean).join("\n\n"),
      ),
    );

    return blocks.filter(Boolean).join("\n\n");
  }

  const blocks: string[] = [];

  if (options.comments) blocks.push(commentBlock(input.entry, lang));

  if (HOUDINI_VEX_LANGS.has(lang) && options.params) {
    blocks.push(vexParamsBlock(input.entry));
  } else if (options.constants) {
    blocks.push(constantsBlock(input.entry, lang));
  }

  if (options.uniforms) {
    const uniforms = uniformsBlock(input.entry, lang);
    if (uniforms) blocks.push(uniforms);
  }

  if (options.clamp) blocks.push(clampBlock(lang));
  if (options.fit) {
    if (!options.clamp) blocks.push(clampBlock(lang));
    blocks.push(fitBlock(lang));
  }

  const body = options.function
    ? wrapExpressionAsFunction(input.code, input.entry, lang)
    : input.code.trim();
  blocks.push(formatCompactCode(body, lang));

  return blocks.filter(Boolean).join("\n\n");
}
