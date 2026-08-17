-- Stocke la région (déduite du code postal) pour permettre un filtre de
-- recherche rapide et indexable, plutôt que de la recalculer à chaque
-- requête à partir du code postal.

alter table annonces
  add column if not exists region text;

create index if not exists annonces_region_idx on annonces (region);
