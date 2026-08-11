export type SectorUniverse = {
  value: string;
  label: string;
};

export const sectorUniverses: SectorUniverse[] = [
  { value: "agriculture", label: "Agriculture" },
  { value: "automobile", label: "Automobile" },
  { value: "batiment_construction", label: "Bâtiment / Construction" },
  { value: "commerce", label: "Commerce" },
  { value: "hotellerie", label: "Hôtellerie" },
  { value: "immobilier", label: "Immobilier" },
  { value: "industrie", label: "Industrie" },
  { value: "informatique_digital", label: "Informatique / Digital" },
  { value: "restauration", label: "Restauration" },
  { value: "sante", label: "Santé" },
  { value: "services", label: "Services" },
  { value: "transport", label: "Transport" },
];

export function getUniverseLabel(universeValue: string | null | undefined) {
  return sectorUniverses.find((item) => item.value === universeValue)?.label ?? null;
}
