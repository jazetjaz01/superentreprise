import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/favoris/actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  annonceId,
  isFavorite,
  next,
  className,
}: {
  annonceId: string;
  isFavorite: boolean;
  next?: string;
  className?: string;
}) {
  return (
    <form action={toggleFavorite} className={className}>
      <input type="hidden" name="annonceId" value={annonceId} />
      {next && <input type="hidden" name="next" value={next} />}
      <button
        type="submit"
        aria-label={
          isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
        }
        aria-pressed={isFavorite}
        className="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "size-4",
            isFavorite ? "fill-rose-500 text-rose-500" : "text-foreground",
          )}
        />
      </button>
    </form>
  );
}
