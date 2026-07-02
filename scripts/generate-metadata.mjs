import fs from "node:fs";
import path from "node:path";

const CURVES_DIR = path.join(process.cwd(), "src/lib/curves");
const REGISTRY_FILE = path.join(process.cwd(), "src/data/curves.ts");

const FAMILY_MAPS = {
  adjustment: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["remap"],
    viewHints: { bounded: true },
  },
  bezier: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["interpolation", "easing"],
    viewHints: { bounded: true },
  },
  chaos: {
    views: ["graph", "motion", "field", "heightStrip"],
    roleTags: ["dsp"],
    viewHints: {},
  },
  distortion: {
    views: ["graph", "motion", "field", "heightStrip"],
    roleTags: ["dsp"],
    viewHints: {},
  },
  distribution: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["falloff", "mask"],
    viewHints: { bounded: true },
  },
  dsp: {
    views: ["graph", "motion", "field", "heightStrip"],
    roleTags: ["dsp"],
    viewHints: {},
  },
  dynamics: {
    views: ["graph", "motion", "field", "heightStrip"],
    roleTags: ["dynamics"],
    viewHints: {},
  },
  easing: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["easing"],
    viewHints: { bounded: true },
  },
  envelope: {
    views: ["graph", "motion", "field", "heightStrip"],
    roleTags: ["dynamics"],
    viewHints: { bounded: true },
  },
  interpolation: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["interpolation"],
    viewHints: { bounded: true },
  },
  linear: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["remap", "interpolation"],
    viewHints: { monotonic: true, bounded: true },
  },
  "log-exp": {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["falloff", "remap"],
    viewHints: { bounded: true },
  },
  noise: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["noise"],
    viewHints: {},
  },
  "procedural-3d": {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d"],
    viewHints: {},
  },
  noise3d: {
    views: ["graph"],
    roleTags: ["noise", "procedural", "renderer3d"],
    viewHints: {},
  },
  terrain: {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d", "terrain"],
    viewHints: {},
  },
  field: {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d", "field"],
    viewHints: {},
  },
  pointcloud: {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d", "pointcloud"],
    viewHints: {},
  },
  volume: {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d", "volume"],
    viewHints: {},
  },
  lsystem: {
    views: ["graph"],
    roleTags: ["procedural", "renderer3d", "lsystem"],
    viewHints: {},
  },
  oscillator: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["wave"],
    viewHints: { periodic: true },
  },
  physics: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["easing"],
    viewHints: {},
  },
  polynomial: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["easing", "remap"],
    viewHints: { bounded: true },
  },
  power: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["easing", "remap"],
    viewHints: { bounded: true },
  },
  remap: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["remap"],
    viewHints: { bounded: true },
  },
  sdf: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["sdf", "mask"],
    viewHints: { signed: true, bounded: true },
  },
  sigmoid: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["sigmoid", "remap"],
    viewHints: { bounded: true },
  },
  signed: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["remap"],
    viewHints: { signed: true, bipolar: true },
  },
  smoothstep: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["smoothstep", "easing"],
    viewHints: { bounded: true },
  },
  "tone-mapping": {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["tonemap"],
    viewHints: { bounded: true },
  },
  trigonometric: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["easing"],
    viewHints: { bounded: true },
  },
  utility: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["remap"],
    viewHints: { bounded: true },
  },
  wave: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["wave"],
    viewHints: { periodic: true },
  },
  window: {
    views: ["graph", "motion", "field", "heightStrip", "ramp"],
    roleTags: ["window", "mask"],
    viewHints: { bounded: true },
  },
};

const DEFAULT_META = {
  views: ["graph"],
  roleTags: ["remap"],
  viewHints: {},
};

const CURVE_HINT_OVERRIDES = {
  // Per-curve escape hatch for semantic display hints. Keep this small:
  // family hints + literal range detection should handle the normal cases.
  // Renderer3D previews are intentionally not generated here yet. Add
  // `preview: { kind: "renderer3d", ... }` manually when a procedural entry
  // is approved, then update this generator once that entry shape is stable.
};

function asConstArray(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function formatObject(value) {
  return JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, "$1:");
}

function labelForParam(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractParams(content) {
  const match = content.match(
    /export\s+const\s+defaultParams\s*=\s*\{([\s\S]*?)\}\s+as\s+const/,
  );
  if (!match || !match[1].trim()) return null;

  const params = {};
  for (const entry of match[1].matchAll(
    /([A-Za-z_$][\w$]*)\s*:\s*(-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\b/gi,
  )) {
    const name = entry[1];
    const value = Number(entry[2]);
    params[name] = {
      label: labelForParam(name),
      default: value,
      step: Number.isInteger(value) ? 1 : 0.01,
    };
  }

  return Object.keys(params).length ? params : null;
}

function extractLiteralInterval(content, key) {
  const numberPattern = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`;
  const match = content.match(
    new RegExp(
      String.raw`${key}:\s*\[\s*(${numberPattern})\s*,\s*(${numberPattern})\s*\]`,
      "i",
    ),
  );
  if (!match) return null;
  const min = Number(match[1]);
  const max = Number(match[2]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return [min, max];
}

function isSignedRange(range) {
  return !!range && range[0] < 0 && range[1] > 0;
}

function isBipolarRange(range) {
  return isSignedRange(range) && Math.abs(range[0] + range[1]) < 1e-9;
}

function deriveViewHints(baseHints, range) {
  const hints = { ...baseHints };
  const signed = hints.signed || isSignedRange(range);
  const bipolar = hints.bipolar || isBipolarRange(range);

  if (signed) {
    hints.signed = true;
    // Renderer hint: center Y-sensitive chrome around y=0.
    hints.centerY = true;
    // Renderer hint: draw/show zero-axis chrome as semantic reference.
    hints.zeroAxis = true;
  }
  if (bipolar) {
    hints.bipolar = true;
    // Renderer hint: center the canonical quad vertically around y=0.
    hints.centerQuadY = true;
  }

  return hints;
}

function extractCurveInfo(fileName) {
  const filePath = path.join(CURVES_DIR, fileName);
  const content = fs.readFileSync(filePath, "utf8");
  const baseName = fileName.replace(/\.ts$/, "");
  const family = content.match(/family:\s*["']([^"']+)["']/)?.[1];
  const curveFuncName = content.match(
    /export\s+function\s+([A-Za-z_$][\w$]*Curve)\s*\(/,
  )?.[1];

  if (!family || !curveFuncName) {
    throw new Error(`Could not read curve metadata from ${fileName}`);
  }

  return {
    baseName,
    curveFuncName,
    family,
    metaName: `${curveFuncName.slice(0, -"Curve".length)}Meta`,
    params: extractParams(content),
    range: extractLiteralInterval(content, "range"),
  };
}

function createMetaContent(info) {
  const mapped = FAMILY_MAPS[info.family] || DEFAULT_META;
  const viewHints = {
    ...deriveViewHints(mapped.viewHints, info.range),
    ...(CURVE_HINT_OVERRIDES[info.baseName] || {}),
  };
  const paramsBlock = info.params
    ? `\n  params: ${formatObject(info.params)} satisfies CurveParamSchema,`
    : "";

  return `import type {
  CurveParamSchema,
  CurveRoleTag,
  CurveSnippetOptions,
  CurveViewHints,
  CurveViewMode,
} from "../../data/curves";

export const ${info.metaName} = {
  views: ${asConstArray(mapped.views)} as readonly CurveViewMode[],
  defaultView: "graph" as CurveViewMode,
  viewHints: ${formatObject(viewHints)} satisfies CurveViewHints,${paramsBlock}
  roleTags: ${asConstArray(mapped.roleTags)} as readonly CurveRoleTag[],
  snippetOptions: {
    constants: true,
    params: true,
    bindings: true,
    clamp: ${info.family !== "sdf"},
    fit: ${info.family !== "sdf"},
    function: true,
    comments: true,
    uniforms: true,
  } satisfies CurveSnippetOptions,
};
`;
}

function getCurveOrder(registryContent, infosByFunc) {
  const arrayMatch = registryContent.match(
    /export\s+const\s+curves:\s*CurveDefinition\[\]\s*=\s*\[([\s\S]*?)\];\s*$/m,
  );
  const ordered = [];
  const seen = new Set();

  if (arrayMatch) {
    for (const match of arrayMatch[1].matchAll(
      /\b([A-Za-z_$][\w$]*Curve)\s*\(/g,
    )) {
      const curveFuncName = match[1];
      if (infosByFunc.has(curveFuncName) && !seen.has(curveFuncName)) {
        ordered.push(infosByFunc.get(curveFuncName));
        seen.add(curveFuncName);
      }
    }
  }

  for (const info of infosByFunc.values()) {
    if (!seen.has(info.curveFuncName)) ordered.push(info);
  }

  return ordered;
}

function rewriteRegistry(registryContent, orderedInfos) {
  const firstImportIndex = registryContent.indexOf("import ");
  const typeImport =
    'import type { CurveKernel, SamplingHint } from "../lib/curveMath";';
  const typeImportIndex = registryContent.indexOf(typeImport);

  if (firstImportIndex === -1 || typeImportIndex === -1) {
    throw new Error("Could not find registry import block.");
  }

  const preamble = registryContent.slice(0, firstImportIndex);
  const afterTypeImport = registryContent.slice(
    typeImportIndex + typeImport.length,
  );
  const imports = orderedInfos
    .map(
      (info) =>
        `import { ${info.curveFuncName} } from "../lib/curves/${info.baseName}";\n` +
        `import { ${info.metaName} } from "../lib/curves/${info.baseName}.meta";`,
    )
    .join("\n");

  const withoutOldImports = `${preamble}${imports}\n${typeImport}${afterTypeImport}`;
  const arrayEntries = orderedInfos
    .map((info) => `  { ...${info.curveFuncName}(), ...${info.metaName} },`)
    .join("\n");
  const curvesArray = `export const curves: CurveDefinition[] = [\n${arrayEntries}\n];\n`;

  return withoutOldImports.replace(
    /export\s+const\s+curves:\s*CurveDefinition\[\]\s*=\s*\[[\s\S]*?\];\s*$/,
    curvesArray,
  );
}

function main() {
  const curveFiles = fs
    .readdirSync(CURVES_DIR)
    .filter(
      (fileName) =>
        fileName.endsWith(".ts") &&
        !fileName.endsWith(".meta.ts") &&
        fileName !== "index.ts",
    )
    .sort((a, b) => a.localeCompare(b));

  const infosByFunc = new Map();
  for (const fileName of curveFiles) {
    const info = extractCurveInfo(fileName);
    infosByFunc.set(info.curveFuncName, info);
    fs.writeFileSync(
      path.join(CURVES_DIR, `${info.baseName}.meta.ts`),
      createMetaContent(info),
      "utf8",
    );
  }

  const registryContent = fs.readFileSync(REGISTRY_FILE, "utf8");
  const orderedInfos = getCurveOrder(registryContent, infosByFunc);
  fs.writeFileSync(
    REGISTRY_FILE,
    rewriteRegistry(registryContent, orderedInfos),
    "utf8",
  );

  console.log(`Generated ${curveFiles.length} metadata files.`);
  console.log(
    `Registered ${orderedInfos.length} curves in src/data/curves.ts.`,
  );
}

main();
