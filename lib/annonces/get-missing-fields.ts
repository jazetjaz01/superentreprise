import type { Tables } from "@/lib/supabase/database.types";

export type MissingField = {
  label: string;
  step: "informations" | "finances" | "localisation" | "photos";
};

export function getMissingFields(
  annonce: Tables<"annonces">,
  images: Tables<"annonce_images">[],
): MissingField[] {
  const missing: MissingField[] = [];

  if (!annonce.title || annonce.title === "Nouvelle annonce") {
    missing.push({ label: "Titre de l'annonce", step: "informations" });
  }
  if (!annonce.transaction_type) {
    missing.push({ label: "Type de transaction", step: "informations" });
  }
  if (!annonce.sector) {
    missing.push({ label: "Secteur d'activité", step: "informations" });
  }
  if (annonce.price == null) {
    missing.push({ label: "Prix de vente", step: "finances" });
  }
  if (!annonce.city) {
    missing.push({ label: "Ville", step: "localisation" });
  }
  if (images.length === 0) {
    missing.push({ label: "Au moins une photo", step: "photos" });
  }

  return missing;
}
