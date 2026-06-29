// ---------------------------------------------------------------------------
// searchIndex.ts
// Builds and queries the in-memory search index used by the home
// page's search box. `buildSearchHaystack` flattens a curve's id,
// name, family, formula, continuity and aliases into a single
// lowercased string; `matchesCurve` does a whitespace-AND substring
// match against that haystack.
// ---------------------------------------------------------------------------

import type { CurveDefinition } from "../data/curves";

const SEPARATOR = " ";

export function buildSearchHaystack(curve: CurveDefinition): string {
  const parts: string[] = [
    curve.id,
    curve.name,
    curve.family,
    curve.formula,
    curve.continuity ?? "",
    ...(curve.aliases ?? []),
  ];
  return parts
    .filter((part) => typeof part === "string" && part.length > 0)
    .join(SEPARATOR)
    .toLowerCase();
}
