import { ImageOff } from "lucide-react";
import { sectors } from "@/lib/annonces/options";
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
}: {
  annonce: Tables<"annonces">;
  imageUrl: string | null;
}) {
  const sectorLabel = sectors.find((item) => item.value === annonce.sector)
    ?.label;
  const department = getDepartment(annonce.postal_code);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
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
          {sectorLabel ?? "Autre"}
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
    </div>
  );
}
