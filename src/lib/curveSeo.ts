import type { CurveDefinition } from "../data/curves";

export const SITE_URL = "https://curvoteca.com";

export type CurveSeo = {
  id: string;
  name: string;
  aliases: string[];
  family: string;
  summary: string;
  formula: string;
  continuity: string | null;
  domain: [number, number];
  range: [number, number];
  tags: string[];
  useCases: string[];
  previewKind: NonNullable<CurveDefinition["preview"]>["kind"];
};

export function toCurveSeo(curve: CurveDefinition): CurveSeo {
  return {
    id: curve.id,
    name: curve.name,
    aliases: curve.aliases ?? [],
    family: curve.family,
    summary: curve.summary,
    formula: curve.formula,
    continuity: curve.continuity ?? null,
    domain: curve.domain,
    range: curve.range,
    tags: curve.tags,
    useCases: curve.useCases,
    previewKind: curve.preview?.kind ?? "canvas2d",
  };
}

export function curveUrl(id: string): string {
  return `${SITE_URL}/curve/${id}`;
}

export function curveTitle(curve: CurveSeo): string {
  if (curve.previewKind === "renderer3d") {
    return `${curve.name} 3D Procedural Reference | Curvoteca`;
  }
  return `${curve.name} Curve Visualization | Curvoteca`;
}

export function curveDescription(curve: CurveSeo): string {
  const useCase = curve.useCases[0] ? ` for ${curve.useCases[0]}` : "";
  if (curve.previewKind === "renderer3d") {
    return `Interactive 3D ${curve.name} procedural reference${useCase}. Includes formula, tags and technical renderer metadata.`;
  }
  return `Interactive ${curve.name} curve visualization${useCase}. Includes formula, tags and technical curve metadata.`;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
