import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const siteUrl = "https://curvoteca.com";
const curvesDir = join(root, "src", "lib", "curves");
const distDir = join(root, "dist");
const sitemapPath = join(distDir, "sitemap.xml");
const robotsPath = join(distDir, "robots.txt");
const indexPath = join(distDir, "index.html");

const failures = [];

function fail(message) {
  failures.push(message);
}

function assertFile(path) {
  if (!existsSync(path)) {
    fail(`Missing ${relative(root, path)}. Run npm.cmd run build first.`);
    return false;
  }
  return true;
}

function collectCurveIds() {
  if (!existsSync(curvesDir)) {
    fail(`Missing ${relative(root, curvesDir)}.`);
    return [];
  }

  const ids = new Set();
  const files = readdirSync(curvesDir)
    .filter((file) => file.endsWith(".ts"))
    .filter((file) => !file.endsWith(".meta.ts"))
    .filter((file) => file !== "index.ts");

  for (const file of files) {
    const source = readFileSync(join(curvesDir, file), "utf8");
    const match = source.match(/\bid:\s*"([^"]+)"/);
    if (match) ids.add(match[1]);
  }

  return [...ids].sort();
}

const hasIndex = assertFile(indexPath);
const hasSitemap = assertFile(sitemapPath);
const hasRobots = assertFile(robotsPath);
const curveIds = collectCurveIds();

if (curveIds.length === 0) {
  fail("No curve ids found in src/lib/curves/*.ts.");
}

if (hasSitemap) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  const requiredUrls = [siteUrl, ...curveIds.map((id) => `${siteUrl}/curve/${id}`)];

  for (const url of requiredUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      fail(`Sitemap missing ${url}.`);
    }
  }

  if (!sitemap.includes("http://www.sitemaps.org/schemas/sitemap/0.9")) {
    fail("Sitemap is missing the sitemap.org urlset namespace.");
  }

  if (!sitemap.includes(`${siteUrl}/curve/smoothstep`)) {
    fail("Sitemap missing smoothstep smoke-test URL.");
  }
}

for (const id of curveIds) {
  const curvePagePath = join(distDir, "curve", id, "index.html");
  if (!existsSync(curvePagePath)) {
    fail(`Missing generated curve page ${relative(root, curvePagePath)}.`);
  }
}

const smoothstepPath = join(distDir, "curve", "smoothstep", "index.html");
if (existsSync(smoothstepPath)) {
  const smoothstepHtml = readFileSync(smoothstepPath, "utf8");
  const requiredSnippets = [
    "Smoothstep Curve Visualization | Curvoteca",
    "https://curvoteca.com/curve/smoothstep",
    "C1 soft mask",
    "y = 3x^2 - 2x^3",
    'data-active-curve-id="smoothstep"',
  ];

  for (const snippet of requiredSnippets) {
    if (!smoothstepHtml.includes(snippet)) {
      fail(`Smoothstep route missing ${snippet}.`);
    }
  }
}

if (hasRobots) {
  const robots = readFileSync(robotsPath, "utf8");
  if (!robots.includes("User-agent: *")) fail("robots.txt missing User-agent.");
  if (!robots.includes("Allow: /")) fail("robots.txt missing Allow: /.");
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    fail("robots.txt missing sitemap pointer.");
  }
}

if (hasIndex) {
  const index = readFileSync(indexPath, "utf8");
  if (!index.includes("Curvoteca")) fail("dist/index.html missing Curvoteca text.");
}

if (failures.length > 0) {
  console.error("SEO check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO check passed: ${curveIds.length} curve URLs verified.`);
