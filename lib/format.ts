// Utilitaires sans dépendance serveur (utilisables côté client)

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "Europe/Paris",
});

export const formatDate = (date: string | null) =>
  date ? dateFormatter.format(new Date(date)) : "";

// « Transmission d'entreprise : 5 étapes » → « transmission-d-entreprise-5-etapes »
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
