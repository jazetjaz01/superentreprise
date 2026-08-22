-- Favoris : permet à un utilisateur (acheteur ou vendeur) de sauvegarder
-- des annonces pour les retrouver facilement dans son dashboard.

create table if not exists favoris (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  annonce_id uuid not null references annonces(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, annonce_id)
);

create index if not exists favoris_user_id_idx on favoris (user_id);

alter table favoris enable row level security;

create policy "Un utilisateur voit ses propres favoris"
  on favoris for select
  using (auth.uid() = user_id);

create policy "Un utilisateur ajoute ses propres favoris"
  on favoris for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur supprime ses propres favoris"
  on favoris for delete
  using (auth.uid() = user_id);
