import { findActivity } from "@/lib/annonces/activities";

const SPECIFIC_IMAGES: Record<string, string> = {
  boulangerie: "/images/annonces/boulangerie.jpg",
  patisserie: "/images/annonces/boulangerie.jpg",
  garage_automobile: "/images/annonces/garage.jpg",
  licence_taxi: "/images/annonces/taxi.jpg",
  hotel: "/images/annonces/hotel.jpg",
  camping: "/images/annonces/hotel.jpg",
};

const SECTOR_IMAGES: Record<string, string> = {
  restauration: "/images/annonces/restauration.jpg",
  commerce: "/images/annonces/commerce.jpg",
  hotellerie: "/images/annonces/hotel.jpg",
  automobile: "/images/annonces/garage.jpg",
  transport: "/images/annonces/taxi.jpg",
  sante: "/images/annonces/bureaux.jpg",
  services: "/images/annonces/bureaux.jpg",
  immobilier: "/images/annonces/bureaux.jpg",
  batiment_construction: "/images/annonces/bureaux.jpg",
};

export function getStockImageForActivity(
  activity: string | null | undefined,
): string | null {
  if (!activity) return null;
  if (SPECIFIC_IMAGES[activity]) return SPECIFIC_IMAGES[activity];

  const preset = findActivity(activity);
  if (!preset) return null;

  return SECTOR_IMAGES[preset.sector] ?? null;
}
