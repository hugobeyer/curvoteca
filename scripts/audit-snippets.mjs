// scripts/audit-snippets.mjs
// Read-only audit of snippet objects in src/lib/curves/*.ts plus matching *.meta.ts.
// Prints warnings to stdout. Exits 0 for warnings. Does not execute snippets,
// import curve files, write files, or modify generated metadata.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const curvesDir = join(root, "src", "lib", "curves");
const registryPath = join(root, "src", "data", "curves.ts");

const SNIPPET_OPTION_KEYS = new Set([
  "constants",
  "params",
  "bindings",
  "clamp",
  "fit",
  "function",
  "comments",
  "uniforms",
]);

const SHADER_UNIFORM_TARGETS = new Set(["glsl", "hlsl", "metal"]);
const LOW_SIGNAL_TARGETS = new Set([
  "equation",
  "json",
  "svg",
  "css",
  "excel",
  "desmos",
]);
const SEV_ORDER = { high: 0, medium: 1, low: 2 };

function readText(path) {
  return readFileSync(path, "utf8");
}

function collectKnownTargets() {
  if (!existsSync(registryPath)) return new Set();

  const source = readText(registryPath);
  const match = source.match(/export\s+type\s+SnippetTarget\s*=([\s\S]*?);/);
  if (!match) return new Set();

  const targets = new Set();
  for (const item of match[1].matchAll(/"([^"]+)"/g)) {
    targets.add(item[1]);
  }

  return targets;
}

function findBalancedObject(source, label) {
  const labelIndex = source.indexOf(label);
  if (labelIndex === -1) return null;

  const start = source.indexOf("{", labelIndex);
  if (start === -1) return null;

  let depth = 0;
  let quote = "";
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = "";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") depth += 1;

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  return null;
}

function parseStringLiteral(literal) {
  const quote = literal[0];

  if (quote === '"') {
    return JSON.parse(literal);
  }

  return literal
    .slice(1, -1)
    .replaceAll("\\n", "\n")
    .replaceAll("\\t", "\t")
    .replaceAll("\\'", "'")
    .replaceAll('\\"', '"')
    .replaceAll("\\`", "`")
    .replaceAll("\\\\", "\\");
}

function extractSnippetEntries(snippetsObjectSource) {
  const entries = [];
  const body = snippetsObjectSource.slice(1, -1);

  const re =
    /([A-Za-z_$][\w$-]*)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

  for (const match of body.matchAll(re)) {
    const target = match[1];
    const literal = match[2];

    try {
      entries.push({
        target,
        code: parseStringLiteral(literal),
      });
    } catch (error) {
      entries.push({
        target,
        code: "",
        parseError: error.message,
      });
    }
  }

  return entries;
}

function extractDefaultParamKeys(source) {
  const match = source.match(
    /export\s+const\s+defaultParams\s*=\s*\{([\s\S]*?)\}\s+as\s+const/,
  );

  if (!match || !match[1].trim()) return [];

  const keys = [];
  for (const item of match[1].matchAll(/([A-Za-z_$][\w$]*)\s*:/g)) {
    keys.push(item[1]);
  }

  return [...new Set(keys)];
}

function extractMetaParamKeys(metaSource) {
  const object = findBalancedObject(metaSource, "params:");
  if (!object) return [];

  const keys = [];
  const body = object.slice(1, -1);

  let depth = 0;
  let quote = "";
  let escaped = false;
  let token = "";

  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];

    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      token = "";
      continue;
    }

    if (ch === "}") {
      depth -= 1;
      token = "";
      continue;
    }

    if (depth === 0) {
      if (/[A-Za-z0-9_$]/.test(ch)) {
        token += ch;
        continue;
      }

      if (ch === ":" && /^[A-Za-z_$][\w$]*$/.test(token)) {
        keys.push(token);
      }

      if (!/\s/.test(ch)) token = "";
    }
  }

  return [...new Set(keys)];
}

function extractSnippetOptions(source) {
  const object = findBalancedObject(source, "snippetOptions:");
  if (!object) return null;

  const options = {};
  for (const item of object.matchAll(
    /([A-Za-z_$][\w$]*)\s*:\s*(true|false)/g,
  )) {
    options[item[1]] = item[2] === "true";
  }

  return options;
}

function hasSuspiciousHtml(code) {
  return /<\s*script\b|<\s*\/\s*script\b|<\s*iframe\b|\bon\w+\s*=|\bjavascript\s*:|\bsrcdoc\s*=|\bdocument\.write\s*\(|\.innerHTML\b/i.test(
    code,
  );
}

function checkEquationProse(code) {
  const words = code.match(/\b[a-z]{3,}\b/gi) || [];
  const hasMathSignal =
    /[=+\-*/^|<>()[\]{}]|\\frac|\\sqrt|\\sin|\\cos|\\tan|lim|sum|pow|abs/i.test(
      code,
    );
  return words.length > 5 && !hasMathSignal;
}

function findUndefinedImplCalls(code) {
  const calls = new Set();
  for (const item of code.matchAll(/\b([A-Za-z_$][\w$]*Impl)\s*\(/g)) {
    calls.add(item[1]);
  }

  if (calls.size === 0) return [];

  const missing = [];
  for (const fn of calls) {
    const escaped = fn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const definition = new RegExp(
      String.raw`\b(?:float|double|int|void|fn|def|function|auto|const|let|var)\s+${escaped}\s*\(|\b${escaped}\s*=\s*(?:function|\([^)]*\)\s*=>)`,
    );

    if (!definition.test(code)) missing.push(fn);
  }

  return missing;
}

function checkPythonPatterns(code) {
  const issues = [];
  const lines = code.split("\n");

  for (const line of lines) {
    if (/^\s*def\s+\w+.*:\s*#/.test(line)) {
      issues.push(
        "def line has inline comment after colon; body formatting may be weak",
      );
    }

    if (/^\s*def\s+\w+.*:.*;\s*\w+/.test(line)) {
      issues.push("def line uses semicolon-style compact statements");
    }

    if (
      /^\s+return\b/.test(line) &&
      !/^ {4,}return\b/.test(line) &&
      !/^\t+return\b/.test(line)
    ) {
      issues.push("return line appears indented with fewer than 4 spaces");
    }
  }

  return [...new Set(issues)];
}

function checkRawExpression(target, code) {
  const shaderTargets = new Set([
    "glsl",
    "hlsl",
    "metal",
    "opencl",
    "wgsl",
    "cuda",
    "shadertoy",
  ]);
  if (!shaderTargets.has(target)) return false;

  const hasReturn = /\breturn\b/.test(code);
  const hasFunctionDecl =
    /\b(?:float|void|int|double|half|vec[234]|float[234])\s+\w+\s*\(/.test(
      code,
    ) || /\bfn\s+\w+\s*\(/.test(code);

  return hasReturn && !hasFunctionDecl;
}

function parseSimpleFunctionSignature(target, code) {
  const patterns = [
    /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/,
    /\bdef\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/,
    /\bfn\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/,
    /\bfunc\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/,
    /\b(?:float|double|int|void|auto|vec[234]|float[234]|half|vector)\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (!match) continue;

    const argsText = match[2].trim();
    if (!argsText) return { name: match[1], args: [] };

    const separator = target === "vex" && argsText.includes(";") ? ";" : ",";
    const args = argsText
      .split(separator)
      .map((arg) => arg.trim())
      .filter(Boolean)
      .map((arg) => {
        const defaultStripped = arg.split("=")[0].trim();
        const colonStripped = defaultStripped.split(":")[0].trim();
        const words = colonStripped.match(/[A-Za-z_$][\w$]*/g) || [];
        return words[words.length - 1] || "";
      })
      .filter(Boolean);

    return { name: match[1], args };
  }

  return null;
}

function hasExampleCall(code, functionName) {
  if (!functionName) return false;
  const escaped = functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withoutLikelyDefinition = code.replace(
    new RegExp(
      String.raw`\b(?:float|double|int|void|auto|function|def|fn|func|vector)\s+${escaped}\s*\([^)]*\)`,
      "g",
    ),
    "",
  );
  return new RegExp(String.raw`\b${escaped}\s*\(`).test(
    withoutLikelyDefinition,
  );
}

function auditFile(file, knownTargets) {
  const rel = relative(root, file);
  const source = readText(file);
  const baseName = rel
    .replace(/^src[\\/]+lib[\\/]+curves[\\/]+/, "")
    .replace(/\.ts$/, "");
  const metaPath = join(curvesDir, `${baseName}.meta.ts`);
  const metaSource = existsSync(metaPath) ? readText(metaPath) : "";

  const id = source.match(/\bid:\s*"([^"]+)"/)?.[1] ?? baseName;
  const warnings = [];

  const warn = (target, type, severity, reason) => {
    warnings.push({ target, type, severity, reason });
  };

  const snippetsSource = findBalancedObject(source, "snippets:");
  if (!snippetsSource) {
    warn("—", "missing-snippets", "high", "No snippets object found");
    return { rel, id, warnings };
  }

  const entries = extractSnippetEntries(snippetsSource);
  if (entries.length === 0) {
    warn(
      "—",
      "empty-snippets",
      "high",
      "snippets object is present but no entries were parsed",
    );
    return { rel, id, warnings };
  }

  const seenTargets = new Set(entries.map((entry) => entry.target));

  const curveParamKeys = extractDefaultParamKeys(source);
  const metaParamKeys = metaSource ? extractMetaParamKeys(metaSource) : [];
  const effectiveParamKeys = metaParamKeys.length
    ? metaParamKeys
    : curveParamKeys;

  const rawSnippetOptions = extractSnippetOptions(source);
  const metaSnippetOptions = metaSource
    ? extractSnippetOptions(metaSource)
    : null;
  const effectiveSnippetOptions = metaSnippetOptions || rawSnippetOptions;

  if (!metaSource) {
    warn(
      "—",
      "missing-meta-file",
      "low",
      "No matching .meta.ts file found for effective metadata checks",
    );
  }

  for (const { target, code, parseError } of entries) {
    if (parseError) {
      warn(
        target,
        "parse-error",
        "high",
        `Could not parse snippet string: ${parseError}`,
      );
      continue;
    }

    if (!knownTargets.has(target)) {
      warn(
        target,
        "unknown-target",
        "high",
        `"${target}" is not in SnippetTarget union`,
      );
    }

    if (!code.trim()) {
      warn(target, "empty-snippet", "high", "Snippet code is empty");
      continue;
    }

    if (hasSuspiciousHtml(code)) {
      warn(
        target,
        "suspicious-html",
        "high",
        "Snippet contains suspicious HTML/script token",
      );
    }

    if (target === "json") {
      try {
        JSON.parse(code);
      } catch (error) {
        warn(
          target,
          "invalid-json",
          "high",
          `JSON parse failed: ${error.message}`,
        );
      }
    }

    if (target === "css") {
      if (
        /\burl\s*\(|\bexpression\s*\(|\bjavascript\s*:|@import\b/i.test(code)
      ) {
        warn(
          target,
          "unsafe-css",
          "high",
          "Unsafe CSS token: url/expression/javascript:/@import",
        );
      }
    }

    if (target === "equation" && checkEquationProse(code)) {
      warn(
        target,
        "equation-prose",
        "low",
        "Equation looks like prose rather than a formula",
      );
    }

    if (target === "vex") {
      if (/\buniform\s+float\b/.test(code)) {
        warn(
          target,
          "vex-glsl-uniform",
          "high",
          "VEX snippet contains GLSL-style uniform",
        );
      }

      if (/#bind\s+parm\b/.test(code)) {
        warn(
          target,
          "vex-opencl-bind",
          "high",
          "VEX snippet contains OpenCL #bind parm syntax",
        );
      }

      if (/\b@KERNEL\b/.test(code)) {
        warn(
          target,
          "vex-opencl-kernel",
          "high",
          "VEX snippet contains OpenCL @KERNEL syntax",
        );
      }
    }

    if (target === "opencl") {
      if (/\buniform\s+float\b/.test(code)) {
        warn(
          target,
          "opencl-glsl-uniform",
          "high",
          "OpenCL snippet contains GLSL-style uniform",
        );
      }

      if (/\bchf\s*\(|\bchi\s*\(|\bchv\s*\(|\bchs\s*\(/.test(code)) {
        warn(
          target,
          "opencl-vex-chf",
          "high",
          "OpenCL snippet contains VEX chf/chi/chv/chs",
        );
      }

      if (/;\s*float\s+\w+\s*\)/.test(code)) {
        warn(
          target,
          "opencl-vex-semicolon-args",
          "medium",
          "OpenCL function args look VEX-style semicolon-separated",
        );
      }
    }

    if (target === "shadertoy" && /\buniform\s+float\b/.test(code)) {
      warn(
        target,
        "shadertoy-uniform",
        "medium",
        "Shadertoy snippet contains uniform float",
      );
    }

    const missingImpls = findUndefinedImplCalls(code);
    if (missingImpls.length > 0) {
      warn(
        target,
        "reference-helper-call",
        "low",
        `Calls ${missingImpls.map((fn) => `${fn}()`).join(", ")} which is not defined in the snippet; likely a compact reference helper`,
      );
    }

    if (target === "python") {
      for (const issue of checkPythonPatterns(code)) {
        warn(target, "python-format", "low", issue);
      }
    }

    if (checkRawExpression(target, code)) {
      warn(
        target,
        "raw-expression",
        "low",
        "Snippet has return/expression shape that may be unsafe to auto-wrap",
      );
    }

    if (effectiveParamKeys.length > 0 && !LOW_SIGNAL_TARGETS.has(target)) {
      const signature = parseSimpleFunctionSignature(target, code);
      const paramArgs = signature
        ? signature.args
            .slice(1)
            .filter((arg) => effectiveParamKeys.includes(arg))
        : [];

      if (
        signature &&
        paramArgs.length > 0 &&
        !hasExampleCall(code, signature.name)
      ) {
        warn(
          target,
          "param-call-example-missing",
          "low",
          `Function "${signature.name}" takes params (${paramArgs.join(", ")}) but snippet has no obvious example call`,
        );
      }
    }
  }

  for (const paramKey of effectiveParamKeys) {
    const referenced = entries
      .filter((entry) => entry.target !== "equation")
      .some((entry) => entry.code.includes(paramKey));

    if (!referenced) {
      warn(
        "—",
        "param-unreferenced",
        "low",
        `Param "${paramKey}" is not referenced in any non-equation snippet`,
      );
    }
  }

  if (effectiveSnippetOptions) {
    for (const optionKey of Object.keys(effectiveSnippetOptions)) {
      if (!SNIPPET_OPTION_KEYS.has(optionKey)) {
        warn(
          "—",
          "unknown-snippet-option",
          "medium",
          `snippetOptions key "${optionKey}" is not known`,
        );
      }
    }

    if (effectiveSnippetOptions.params === true && !seenTargets.has("vex")) {
      warn(
        "—",
        "option-params-no-vex",
        "medium",
        "params=true but no VEX snippet exists",
      );
    }

    if (
      effectiveSnippetOptions.bindings === true &&
      !seenTargets.has("opencl")
    ) {
      warn(
        "—",
        "option-bindings-no-opencl",
        "medium",
        "bindings=true but no OpenCL snippet exists",
      );
    }

    if (effectiveSnippetOptions.uniforms === true) {
      const hasUniformTarget = [...SHADER_UNIFORM_TARGETS].some((target) =>
        seenTargets.has(target),
      );
      if (!hasUniformTarget) {
        warn(
          "—",
          "option-uniforms-no-shader",
          "medium",
          "uniforms=true but no GLSL/HLSL/Metal snippet exists",
        );
      }
    }
  }

  if (effectiveParamKeys.length > 0 && seenTargets.has("vex")) {
    if (!effectiveSnippetOptions || effectiveSnippetOptions.params !== true) {
      warn(
        "vex",
        "missing-params-opt-in",
        "low",
        `Params exist (${effectiveParamKeys.join(", ")}) but params option is not true`,
      );
    }
  }

  if (effectiveParamKeys.length > 0) {
    const hasUniformTarget = [...SHADER_UNIFORM_TARGETS].some((target) =>
      seenTargets.has(target),
    );
    if (
      hasUniformTarget &&
      (!effectiveSnippetOptions || effectiveSnippetOptions.uniforms !== true)
    ) {
      warn(
        "glsl/hlsl/metal",
        "missing-uniforms-opt-in",
        "low",
        `Params exist (${effectiveParamKeys.join(", ")}) but uniforms option is not true`,
      );
    }
  }

  return { rel, id, warnings };
}

function main() {
  const knownTargets = collectKnownTargets();
  if (knownTargets.size === 0) {
    console.error(
      "ERROR: Could not parse SnippetTarget from src/data/curves.ts",
    );
    process.exit(1);
  }

  if (!existsSync(curvesDir)) {
    console.error(`ERROR: ${relative(root, curvesDir)} not found`);
    process.exit(1);
  }

  const files = readdirSync(curvesDir)
    .filter((file) => file.endsWith(".ts"))
    .filter((file) => !file.endsWith(".meta.ts"))
    .filter((file) => file !== "index.ts")
    .sort()
    .map((file) => join(curvesDir, file));

  const results = files.map((file) => auditFile(file, knownTargets));

  let totalWarnings = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  for (const { rel, id, warnings } of results) {
    if (warnings.length === 0) continue;

    const sorted = [...warnings].sort(
      (a, b) => (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9),
    );

    console.log(`\n── ${rel}  [${id}]`);
    for (const warning of sorted) {
      const severity =
        warning.severity === "high"
          ? "HIGH  "
          : warning.severity === "medium"
            ? "MED   "
            : "LOW   ";

      console.log(
        `   ${severity}  ${warning.target.padEnd(16)}  ${warning.type.padEnd(32)}  ${warning.reason}`,
      );

      totalWarnings += 1;
      if (warning.severity === "high") highCount += 1;
      else if (warning.severity === "medium") mediumCount += 1;
      else lowCount += 1;
    }
  }

  console.log(`\n${"─".repeat(80)}`);
  console.log(
    `Audit complete: ${files.length} files, ${totalWarnings} warnings`,
  );
  console.log(`  HIGH: ${highCount}  MED: ${mediumCount}  LOW: ${lowCount}`);
  console.log(`${"─".repeat(80)}`);
}

main();
