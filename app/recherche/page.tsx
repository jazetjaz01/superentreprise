import Link from "next/link";
import { AnnonceCard } from "@/components/annonce-card";
import { budgets } from "@/lib/annonces/budgets";
import { getCoverImageUrl } from "@/lib/annonces/get-cover-image-url";
import {
  parseBudgetRange,
  resolveSectorMatches,
  sanitizeForFilter,
} from "@/lib/annonces/search";
import { createClient } from "@/lib/supabase/server";

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    localisation?: string;
    budget?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params.type?.trim() ?? "";
  const localisation = params.localisation?.trim() ?? "";
  const budget = params.budget?.trim() ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("annonces")
    .select("*, annonce_images(*)")
    .eq("status", "publiee");

  if (type) {
    const safeType = sanitizeForFilter(type);
    const { sectors, activities } = resolveSectorMatches(type);
    const orParts = [
      `title.ilike.%${safeType}%`,
      `description_short.ilike.%${safeType}%`,
    ];
    if (sectors.length > 0) orParts.push(`sector.in.(${sectors.join(",")})`);
    if (activities.length > 0)
      orParts.push(`activity.in.(${activities.join(",")})`);
    query = query.or(orParts.join(","));
  }

  if (localisation) {
    const safeLocation = sanitizeForFilter(localisation);
    query = query.or(
      `city.ilike.%${safeLocation}%,postal_code.ilike.${safeLocation}%`,
    );
  }

  if (budget) {
    const { min, max } = parseBudgetRange(budget);
    if (min != null) query = query.gte("price", min);
    if (max != null) query = query.lte("price", max);
  }

  const { data: annonces } = await query.order("created_at", {
    ascending: false,
  });
  const results = annonces ?? [];

  const budgetLabel = budgets.find((item) => item.value === budget)?.label;
  const filterSummary = [
    type && `« ${type} »`,
    localisation && `à ${localisation}`,
    budgetLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl">
          {results.length}{" "}
          {results.length > 1 ? "annonces trouvées" : "annonce trouvée"}
        </h1>
        {filterSummary && (
          <p className="text-muted-foreground text-sm">
            {filterSummary}
            {" — "}
            <Link
              href="/recherche"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Réinitialiser
            </Link>
          </p>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border p-8 text-center text-muted-foreground text-sm">
          Aucune annonce ne correspond à votre recherche. Essayez d&apos;élargir
          vos critères.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((annonce) => (
            <AnnonceCard
              key={annonce.id}
              annonce={annonce}
              imageUrl={getCoverImageUrl(supabase, annonce.annonce_images ?? [])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
