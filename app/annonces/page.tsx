import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnnonceCard } from "@/components/annonce-card";
import { getCoverImageUrl } from "@/lib/annonces/get-cover-image-url";
import { getRegion, regions } from "@/lib/annonces/regions";
import { sectorUniverses } from "@/lib/annonces/sectors";
import { getFavoriteIds } from "@/lib/favoris/get-favorite-ids";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Toutes les annonces | Superentreprise",
  description:
    "Parcourez l'ensemble des annonces de cession et d'acquisition d'entreprises, commerces et fonds de commerce diffusées sur Superentreprise.",
};

function buildHref(
  params: { region?: string; sector?: string },
  changes: { region?: string; sector?: string },
) {
  const next = { ...params, ...changes };
  const query = new URLSearchParams();
  if (next.region) query.set("region", next.region);
  if (next.sector) query.set("sector", next.sector);
  const qs = query.toString();
  return qs ? `/annonces?${qs}` : "/annonces";
}

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{
    region?: string | string[];
    sector?: string | string[];
  }>;
}) {
  const rawParams = await searchParams;
  const rawRegion = Array.isArray(rawParams.region)
    ? rawParams.region[0]
    : rawParams.region;
  const rawSector = Array.isArray(rawParams.sector)
    ? rawParams.sector[0]
    : rawParams.sector;

  // N'accepter que des valeurs de filtre connues : sinon, n'importe quelle
  // combinaison inventée (fuzzing de bots) déclencherait une vraie requête
  // Supabase. On redirige vers l'URL canonique avant tout appel base de
  // données, ce qui rend ces tentatives quasi gratuites à rejeter.
  const validRegion = rawRegion && regions.includes(rawRegion) ? rawRegion : undefined;
  const validSector =
    rawSector && sectorUniverses.some((sector) => sector.value === rawSector)
      ? rawSector
      : undefined;

  if (
    rawRegion !== validRegion ||
    rawSector !== validSector ||
    Array.isArray(rawParams.region) ||
    Array.isArray(rawParams.sector)
  ) {
    const canonicalQuery = new URLSearchParams();
    if (validRegion) canonicalQuery.set("region", validRegion);
    if (validSector) canonicalQuery.set("sector", validSector);
    const qs = canonicalQuery.toString();
    redirect(qs ? `/annonces?${qs}` : "/annonces");
  }

  const params = { region: validRegion, sector: validSector };
  const activeRegion = validRegion ?? "";
  const activeSector = validSector ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("annonces")
    .select("*, annonce_images(*)")
    .eq("status", "publiee");

  if (activeSector) {
    query = query.eq("sector", activeSector);
  }

  const { data: annonces } = await query.order("created_at", {
    ascending: false,
  });

  const results = (annonces ?? []).filter(
    (annonce) => !activeRegion || getRegion(annonce.postal_code) === activeRegion,
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const favoriteIds = await getFavoriteIds(supabase, user?.id);

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(params, { region: undefined })}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              !activeRegion
                ? "border-foreground bg-foreground text-background"
                : "border-input hover:bg-muted",
            )}
          >
            Toutes les régions
          </Link>
          {regions.map((region) => (
            <Link
              key={region}
              href={buildHref(params, {
                region: activeRegion === region ? undefined : region,
              })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                activeRegion === region
                  ? "border-foreground bg-foreground text-background"
                  : "border-input hover:bg-muted",
              )}
            >
              {region}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(params, { sector: undefined })}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              !activeSector
                ? "border-foreground bg-foreground text-background"
                : "border-input hover:bg-muted",
            )}
          >
            Toutes les activités
          </Link>
          {sectorUniverses.map((sector) => (
            <Link
              key={sector.value}
              href={buildHref(params, {
                sector: activeSector === sector.value ? undefined : sector.value,
              })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                activeSector === sector.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-input hover:bg-muted",
              )}
            >
              {sector.label}
            </Link>
          ))}
        </div>
      </div>

      <h1 className="mt-6 font-medium text-muted-foreground text-sm">
        {results.length} {results.length > 1 ? "annonces" : "annonce"}
      </h1>

      {results.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border p-8 text-center text-muted-foreground text-sm">
          Aucune annonce ne correspond à ces critères.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {results.map((annonce) => (
            <AnnonceCard
              key={annonce.id}
              annonce={annonce}
              imageUrl={getCoverImageUrl(supabase, annonce.annonce_images ?? [])}
              isFavorite={favoriteIds.has(annonce.id)}
              favoriteNext="/annonces"
            />
          ))}
        </div>
      )}
    </div>
  );
}
