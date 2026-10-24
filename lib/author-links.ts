// Normalise et valide les coordonnées publiques d'un auteur.
// Mêmes règles que les contraintes de la table authors.
// Retourne null pour un champ vide, undefined si la valeur est invalide.

const withHttps = (value: string) =>
  /^https?:\/\//i.test(value) ? value.replace(/^http:/i, "https:") : `https://${value}`;

// « linkedin.com/in/jdupont » → « https://linkedin.com/in/jdupont »
export function normalizeLinkedIn(raw: string): string | null | undefined {
  const value = raw.trim();
  if (!value) return null;
  const url = withHttps(value);
  return /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/\S+$/i.test(url) && url.length <= 300
    ? url
    : undefined;
}

// « @jdupont » ou « jdupont » → « https://x.com/jdupont » ; twitter.com accepté
export function normalizeX(raw: string): string | null | undefined {
  const value = raw.trim();
  if (!value) return null;
  const handle = value.match(/^@?([A-Za-z0-9_]{1,15})$/);
  const url = handle ? `https://x.com/${handle[1]}` : withHttps(value);
  return /^https:\/\/(www\.)?(x|twitter)\.com\/\S+$/i.test(url) && url.length <= 300
    ? url
    : undefined;
}

export function normalizeEmail(raw: string): string | null | undefined {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) && value.length <= 254 ? value : undefined;
}
