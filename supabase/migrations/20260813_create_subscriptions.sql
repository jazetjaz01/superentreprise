-- Abonnement mensuel (30€ TTC) permettant à un utilisateur de diffuser une annonce.
-- Une seule ligne par utilisateur : elle est réutilisée/mise à jour à chaque
-- évènement Stripe (souscription, annulation, réabonnement).

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  annonce_id uuid references annonces(id) on delete set null,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  status text not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "Un utilisateur peut voir son propre abonnement"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Aucune policy insert/update/delete pour les utilisateurs : la table est
-- gérée exclusivement par le webhook Stripe via la clé service_role
-- (qui bypass RLS), jamais depuis le client.

create index if not exists subscriptions_stripe_customer_id_idx
  on subscriptions (stripe_customer_id);
