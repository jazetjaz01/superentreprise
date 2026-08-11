import { sectorUniverses, type SectorItem } from "@/lib/annonces/sectors";

/**
 * PostgREST's `or=(...)` filter syntax uses `,`, `(`, `)` and `%` as
 * structural characters. Strip them from free-text search input so a
 * search term can't alter the shape of the filter we build.
 */
export function sanitizeForFilter(value: string) {
  return value.replace(/[,()%]/g, " ").trim();
}

/**
 * Finds every universe/activity whose label contains the given free-text
 * query, so a search for "restaurant" also matches annonces tagged with
 * the "restaurant_italien" activity, etc.
 */
export function resolveSectorMatches(query: string) {
  const q = query.trim().toLowerCase();
  const sectors = new Set<string>();
  const activities = new Set<string>();

  if (!q) return { sectors: [] as string[], activities: [] as string[] };

  function walk(universeValue: string, nodes: SectorItem[]) {
    for (const node of nodes) {
      if (node.label.toLowerCase().includes(q)) {
        sectors.add(universeValue);
        activities.add(node.value);
      }
      if (node.children) walk(universeValue, node.children);
    }
  }

  for (const universe of sectorUniverses) {
    if (universe.label.toLowerCase().includes(q)) {
      sectors.add(universe.value);
    }
    walk(universe.value, universe.categories);
  }

  return { sectors: [...sectors], activities: [...activities] };
}

export function parseBudgetRange(budget: string) {
  const [minRaw, maxRaw] = budget.split("-");
  const min = Number(minRaw);
  const max = maxRaw ? Number(maxRaw) : null;

  return {
    min: Number.isFinite(min) ? min : null,
    max: max != null && Number.isFinite(max) ? max : null,
  };
}
