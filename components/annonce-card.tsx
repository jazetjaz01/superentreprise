import { ImageOff } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { getActivityDisplayLabel } from "@/lib/annonces/activities";
import { getDepartment } from "@/lib/annonces/departments";
import type { Tables } from "@/lib/supabase/database.types";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function AnnonceCard({
  annonce,
  imageUrl,
  isFavorite,
  favoriteNext,
}: {
  annonce: Tables<"annonces">;
  imageUrl: string | null;
  isFavorite?: boolean;
  favoriteNext?: string;
}) {
  const activityLabel = getActivityDisplayLabel(annonce.activity);
  const department = getDepartment(annonce.postal_code);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20 hover:shadow-sm">
      {isFavorite !== undefined && (
        <FavoriteButton
          annonceId={annonce.id}
          isFavorite={isFavorite}
          next={favoriteNext}
          className="absolute top-2 right-2 z-10"
        />
      )}
      <Link href={`/annonce/${annonce.id}`} className="flex flex-col">
        <div className="aspect-square w-full bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-3">
          <span className="text-muted-foreground text-xs">
            {activityLabel ?? "Autre"}
          </span>
          <span className="font-semibold text-sm">
            {annonce.price != null ? priceFormatter.format(annonce.price) : "Prix non communiqué"}
          </span>
          {department && (
            <span className="text-muted-foreground text-xs">
              {department.code} – {department.name}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
