import type { APIRoute } from "astro";
import { curves } from "../data/curves";
import { SITE_URL, curveUrl, escapeXml } from "../lib/curveSeo";

export const GET: APIRoute = () => {
  const urls = [SITE_URL, ...curves.map((curve) => curveUrl(curve.id))];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
