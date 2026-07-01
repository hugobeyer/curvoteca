import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("..", import.meta.url));
const curvesDir = join(root, "src", "lib", "curves");
const registryPath = join(root, "src", "data", "curves.ts");

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function commandExists(command) {
  const result = spawnSync(command, ["--version"], {
    encoding: "utf8",
    stdio: "pipe",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

function collectSnippetTargets() {
  if (!existsSync(registryPath)) {
    fail(`Missing ${relative(root, registryPath)}.`);
    return new Set();
  }

  const source = readText(registryPath);
  const match = source.match(/export\s+type\s+SnippetTarget\s*=([\s\S]*?);/);
  if (!match) {
    fail("Could not find SnippetTarget union in src/data/curves.ts.");
    return new Set();
  }

  const targets = new Set();
  for (const item of match[1].matchAll(/"([^"]+)"/g)) {
    targets.add(item[1]);
  }

  if (targets.size === 0) {
    fail("SnippetTarget union exists but no targets were parsed.");
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
      fail(`Could not parse ${target} snippet literal: ${error.message}`);
    }
  }

  return entries;
}

function hasSuspiciousHtml(code) {
  return /<\s*script\b|<\s*\/\s*script\b|<\s*iframe\b|\bon\w+\s*=|\bjavascript\s*:|\bsrcdoc\s*=|\bdocument\.write\s*\(|\.innerHTML\b/i.test(
    code,
  );
}

function validateByTarget(file, curveId, target, code, knownTargets) {
  const where = `${relative(root, file)} ${curveId}.${target}`;

  if (!knownTargets.has(target)) {
    fail(`${where}: unknown SnippetTarget "${target}".`);
  }

  if (typeof code !== "string") {
    fail(`${where}: snippet is not a string.`);
    return;
  }

  if (!code.trim()) {
    fail(`${where}: snippet is empty.`);
    return;
  }

  if (hasSuspiciousHtml(code)) {
    fail(`${where}: suspicious HTML/script token in snippet.`);
  }

  if (target === "json") {
    try {
      JSON.parse(code);
    } catch (error) {
      fail(`${where}: invalid JSON snippet: ${error.message}`);
    }
  }

  if (target === "css") {
    if (/\burl\s*\(|\bexpression\s*\(|\bjavascript\s*:|@import\b/i.test(code)) {
      fail(`${where}: unsafe CSS token in snippet.`);
    }
  }

  if (target === "equation") {
    if (/[;{}<>]/.test(code)) {
      warn(`${where}: equation contains code-like punctuation.`);
    }
  }

  if (target === "vex") {
    if (/\buniform\s+float\b/.test(code)) {
      fail(`${where}: VEX snippet contains GLSL-style uniform.`);
    }
  }

  if (target === "opencl") {
    if (/\buniform\s+float\b/.test(code)) {
      fail(`${where}: OpenCL snippet contains GLSL-style uniform.`);
    }
    if (/;\s*float\s+\w+\s*\)/.test(code)) {
      fail(`${where}: OpenCL function args look like VEX semicolon args.`);
    }
  }
}

function validateOptionalJsSyntax(snippets) {
  if (!commandExists("node")) return;

  for (const item of snippets) {
    if (item.target !== "js") continue;

    const result = spawnSync(process.execPath, ["--input-type=module", "-e", item.code], {
    encoding: "utf8",
    stdio: "pipe",
  });

    if (result.status !== 0) {
      fail(`${item.where}: node --check failed:\n${result.stderr.trim()}`);
    }
  }
}

function main() {
  const knownTargets = collectSnippetTargets();

  if (!existsSync(curvesDir)) {
    fail(`Missing ${relative(root, curvesDir)}.`);
  }

  const files = existsSync(curvesDir)
    ? readdirSync(curvesDir)
        .filter((file) => file.endsWith(".ts"))
        .filter((file) => !file.endsWith(".meta.ts"))
        .filter((file) => file !== "index.ts")
        .sort()
        .map((file) => join(curvesDir, file))
    : [];

  const allSnippets = [];

  for (const file of files) {
    const source = readText(file);
    const id = source.match(/\bid:\s*"([^"]+)"/)?.[1] ?? "unknown";
    const snippetsSource = findBalancedObject(source, "snippets:");

    if (!snippetsSource) {
      fail(`${relative(root, file)}: missing snippets object.`);
      continue;
    }

    const entries = extractSnippetEntries(snippetsSource);

    if (entries.length === 0) {
      fail(`${relative(root, file)}: no static snippet entries parsed.`);
      continue;
    }

    for (const entry of entries) {
      validateByTarget(file, id, entry.target, entry.code, knownTargets);
      allSnippets.push({
        ...entry,
        where: `${relative(root, file)} ${id}.${entry.target}`,
      });
    }
  }

  validateOptionalJsSyntax(allSnippets);

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (failures.length > 0) {
    console.error("Snippet check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(
    `Snippet check passed: ${allSnippets.length} snippets across ${files.length} curve files.`,
  );
}

main();
