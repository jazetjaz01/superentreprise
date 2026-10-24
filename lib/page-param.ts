// Numéro de page d'une URL /…/page/[page] : entier ≥ 2 (la page 1 est l'URL sans /page)
export const parsePageParam = (value: string) =>
  /^[1-9]\d*$/.test(value) && Number(value) >= 2 ? Number(value) : null;

// Paramètres à prérendre : pages 2 à N. Au moins un est requis par cacheComponents :
// s'il n'y a qu'une page, on prérend « 2 » qui renverra une 404.
export const pageParams = (totalPages: number) =>
  totalPages > 1
    ? Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
    : [{ page: "2" }];
