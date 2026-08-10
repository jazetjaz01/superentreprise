export const transactionTypes = [
  { value: "fonds_de_commerce", label: "Fonds de commerce" },
  { value: "titres_societe", label: "Titres de société (parts / actions)" },
  { value: "droit_au_bail", label: "Droit au bail" },
  { value: "location_gerance", label: "Location-gérance" },
  { value: "murs_commerciaux", label: "Murs commerciaux" },
] as const;

export const statusLabels: Record<
  string,
  { label: string; variant: "secondary" | "default" | "outline" }
> = {
  brouillon: { label: "Brouillon", variant: "secondary" },
  publiee: { label: "Publiée", variant: "default" },
  sous_compromis: { label: "Sous compromis", variant: "outline" },
  vendue: { label: "Vendue", variant: "outline" },
  archivee: { label: "Archivée", variant: "secondary" },
};
