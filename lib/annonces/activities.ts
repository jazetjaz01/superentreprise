export type Activity = {
  value: string;
  label: string;
  sector: string;
};

export const activities: Activity[] = [
  { value: "restaurant", label: "Restaurant", sector: "restauration" },
  { value: "restauration_rapide", label: "Restauration rapide", sector: "restauration" },
  { value: "bar", label: "Bar", sector: "restauration" },
  { value: "discotheque", label: "Discothèque", sector: "restauration" },
  { value: "cafe_salon_the", label: "Café / Salon de thé", sector: "restauration" },
  { value: "traiteur", label: "Traiteur", sector: "restauration" },
  { value: "bureau_de_tabac", label: "Bureau de tabac", sector: "commerce" },
  { value: "epicerie", label: "Épicerie", sector: "commerce" },
  { value: "superette", label: "Supérette", sector: "commerce" },
  { value: "supermarche", label: "Supermarché", sector: "commerce" },
  { value: "boulangerie", label: "Boulangerie", sector: "commerce" },
  { value: "patisserie", label: "Pâtisserie", sector: "commerce" },
  { value: "boucherie", label: "Boucherie", sector: "commerce" },
  { value: "poissonnerie", label: "Poissonnerie", sector: "commerce" },
  { value: "parfumerie", label: "Parfumerie", sector: "commerce" },
  { value: "pret_a_porter", label: "Prêt-à-porter", sector: "commerce" },
  { value: "fleuriste", label: "Fleuriste", sector: "commerce" },
  { value: "pharmacie", label: "Pharmacie", sector: "sante" },
  { value: "cabinet_medical", label: "Cabinet médical / paramédical", sector: "sante" },
  { value: "ambulance", label: "Ambulance / Transport sanitaire", sector: "sante" },
  { value: "institut_beaute", label: "Institut de beauté", sector: "services" },
  { value: "coiffure", label: "Coiffure", sector: "services" },
  { value: "pressing", label: "Pressing", sector: "services" },
  { value: "centre_formation", label: "Centre de formation", sector: "services" },
  { value: "agence_immobiliere", label: "Agence immobilière", sector: "immobilier" },
  { value: "hotel", label: "Hôtel", sector: "hotellerie" },
  { value: "camping", label: "Camping", sector: "hotellerie" },
  { value: "auto_ecole", label: "Auto-école", sector: "automobile" },
  { value: "garage_automobile", label: "Garage automobile", sector: "automobile" },
  { value: "entreprise_batiment", label: "Entreprise du bâtiment", sector: "batiment_construction" },
  { value: "licence_taxi", label: "Licence taxi", sector: "transport" },
  { value: "licence_4", label: "Licence 4 (autorisation de vendre de l'alcool)", sector: "restauration" },
];

export function findActivity(value: string | null | undefined) {
  if (!value) return null;
  return activities.find((item) => item.value === value) ?? null;
}

/**
 * `activity` may be a preset value or free text the user typed themselves.
 * Presets resolve to their label; free text is already human-readable.
 */
export function getActivityDisplayLabel(
  activity: string | null | undefined,
): string | null {
  if (!activity) return null;
  return findActivity(activity)?.label ?? activity;
}
