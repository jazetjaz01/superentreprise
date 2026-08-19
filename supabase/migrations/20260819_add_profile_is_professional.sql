-- Mémorise le choix "Je suis un professionnel" fait à l'inscription ou à
-- l'onboarding, pour adapter l'offre d'abonnement proposée tant que
-- l'utilisateur n'a pas encore d'abonnement actif.

alter table profiles
  add column if not exists is_professional boolean not null default false;
