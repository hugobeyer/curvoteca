import { readFileSync } from "node:fs";
const r = JSON.parse(readFileSync("./lh.json", "utf8"));
const cat = r.categories.performance;
const a = r.audits;
console.log("score:", Math.round(cat.score * 100));
console.log("FCP:", a["first-contentful-paint"].displayValue);
console.log("LCP:", a["largest-contentful-paint"].displayValue);
console.log("CLS:", a["cumulative-layout-shift"].displayValue);
console.log("TBT:", a["total-blocking-time"].displayValue);
console.log("SI:", a["speed-index"].displayValue);

// network requests
const nr = a["network-requests"];
if (nr && nr.details && nr.details.items) {
  console.log("\n--- top network requests ---");
  const items = [...nr.details.items]
    .sort((x, y) => (y.transferSize || 0) - (x.transferSize || 0))
    .slice(0, 12);
  for (const it of items) {
    console.log(
      (it.url || "").slice(-60).padEnd(60),
      (it.transferSize || 0).toString().padStart(7),
      it.resourceType || "",
    );
  }
}

// render-blocking
const rb = a["render-blocking-resources"];
if (rb && rb.details && rb.details.items) {
  console.log("\n--- render-blocking ---");
  for (const it of rb.details.items) {
    console.log(it.url, "wastedMs=" + Math.round(it.wastedMs || 0));
  }
}
const cls = a["cumulative-layout-shift"];
if (cls.details && cls.details.items) {
  console.log("\n--- CLS items ---");
  for (const it of cls.details.items) {
    console.log(it.node && it.node.nodeLabel, "->", it.score);
  }
}
const ls = a["layout-shifts"] || a["layout-shift-elements"];
if (ls && ls.details && ls.details.items) {
  console.log("\n--- layout shift elements ---");
  for (const it of ls.details.items.slice(0, 25)) {
    const n = it.node || {};
    console.log(
      (n.nodeLabel || "?").slice(0, 80),
      "score=",
      (it.score || 0).toFixed(3),
    );
  }
}
