-- Permet de suivre si une résiliation est déjà programmée pour la fin
-- de la période en cours (l'utilisateur garde l'accès jusqu'à cette date).

alter table subscriptions
  add column if not exists cancel_at_period_end boolean not null default false;
