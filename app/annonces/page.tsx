import type { Metadata } from "next";
import { AnnonceCard } from "@/components/annonce-card";
import { getCoverImageUrl } from "@/lib/annonces/get-cover-image-url";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Toutes les annonces | Superentreprise",
  description:
    "Parcourez l'ensemble des annonces de cession et d'acquisition d'entreprises, commerces et fonds de commerce diffusées sur Superentreprise.",
};

export default async function AnnoncesPage() {
  const supabase = await createClient();
  const { data: annonces } = await supabase
    .from("annonces")
    .select("*, annonce_images(*)")
    .eq("status", "publiee")
    .order("created_at", { ascending: false });

  const results = annonces ?? [];

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-12">
      <h1 className="font-semibold text-2xl">
        {results.length} {results.length > 1 ? "annonces" : "annonce"}
      </h1>

      {results.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border p-8 text-center text-muted-foreground text-sm">
          Aucune annonce n&apos;est publiée pour le moment.
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
