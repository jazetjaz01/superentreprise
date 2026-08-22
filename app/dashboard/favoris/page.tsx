import Link from "next/link";
import { AnnonceCard } from "@/components/annonce-card";
import { Button } from "@/components/ui/button";
import { getCoverImageUrl } from "@/lib/annonces/get-cover-image-url";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardFavorisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: favoris } = await supabase
    .from("favoris")
    .select("annonce_id, annonces(*, annonce_images(*))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const annonces = (favoris ?? [])
    .map((row) => row.annonces)
    .filter((annonce) => annonce !== null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-xl">Mes favoris</h1>

      {annonces.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border p-8 text-center text-muted-foreground text-sm">
          <span>Vous n&apos;avez pas encore d&apos;annonce en favoris.</span>
          <Button
            render={<Link href="/annonces" />}
            nativeButton={false}
            className="mx-auto w-fit rounded-full"
          >
            Parcourir les annonces
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {annonces.map((annonce) => (
            <AnnonceCard
              key={annonce.id}
              annonce={annonce}
              imageUrl={getCoverImageUrl(supabase, annonce.annonce_images ?? [])}
              isFavorite
              favoriteNext="/dashboard/favoris"
            />
          ))}
        </div>
      )}
    </div>
  );
}
