import { AnnonceCard } from "@/components/annonce-card";
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

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-16">
      <h2 className="font-semibold text-2xl">Dernières annonces</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {annonces.map((annonce) => {
          const images = annonce.annonce_images ?? [];
          const cover = images.find((image) => image.is_cover) ?? images[0];
          const imageUrl = cover
            ? supabase.storage
                .from("annonces-images")
                .getPublicUrl(cover.storage_path).data.publicUrl
            : null;

          return (
            <AnnonceCard key={annonce.id} annonce={annonce} imageUrl={imageUrl} />
          );
        })}
      </div>
    </section>
  );
}
