-- Prépare les abonnements pro (5, 10, 25 annonces) : chaque abonnement
-- porte désormais un plan et un quota d'annonces actives autorisées.
-- Les abonnements existants (30€ TTC, 1 annonce) restent au plan
-- "standard" avec un quota de 1, ce qui correspond au comportement actuel.

alter table subscriptions
  add column if not exists plan text not null default 'standard',
  add column if not exists max_annonces integer not null default 1;
