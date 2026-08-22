import { AnnonceCard } from "@/components/annonce-card";
import { getCoverImageUrl } from "@/lib/annonces/get-cover-image-url";
import { getFavoriteIds } from "@/lib/favoris/get-favorite-ids";
import { createClient } from "@/lib/supabase/server";

export async function AnnoncesSection() {
  const supabase = await createClient();
  const { data: annonces } = await supabase
    .from("annonces")
    .select("*, annonce_images(*)")
    .eq("status", "publiee")
    .order("created_at", { ascending: false })
    .limit(10);

  if (!annonces || annonces.length === 0) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const favoriteIds = await getFavoriteIds(supabase, user?.id);

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-16">
      <h2 className="font-semibold text-2xl">Dernières annonces</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {annonces.map((annonce) => {
          const imageUrl = getCoverImageUrl(supabase, annonce.annonce_images ?? []);

          return (
            <AnnonceCard
              key={annonce.id}
              annonce={annonce}
              imageUrl={imageUrl}
              isFavorite={favoriteIds.has(annonce.id)}
              favoriteNext="/"
            />
          );
        })}
      </div>
    </section>
  );
}
