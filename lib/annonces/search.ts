import { activities as presetActivities } from "@/lib/annonces/activities";
import { sectorUniverses } from "@/lib/annonces/sectors";

/**
 * PostgREST's `or=(...)` filter syntax uses `,`, `(`, `)` and `%` as
 * structural characters. Strip them from free-text search input so a
 * search term can't alter the shape of the filter we build.
 */
export function sanitizeForFilter(value: string) {
  return value.replace(/[,()%]/g, " ").trim();
}

/**
 * Finds every preset activity/universe whose label contains the given
 * free-text query, so a search for "boulangerie" also matches annonces
 * tagged with the "boulangerie" activity even if the title doesn't
 * literally contain that word.
 */
export function resolveSectorMatches(query: string) {
  const q = query.trim().toLowerCase();
  const sectors = new Set<string>();
  const activities = new Set<string>();

  if (!q) return { sectors: [] as string[], activities: [] as string[] };

  for (const universe of sectorUniverses) {
    if (universe.label.toLowerCase().includes(q)) {
      sectors.add(universe.value);
    }
  }

  for (const activity of presetActivities) {
    if (activity.label.toLowerCase().includes(q)) {
      activities.add(activity.value);
      sectors.add(activity.sector);
    }
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
