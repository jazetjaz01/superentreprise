-- Profils des utilisateurs (1 ligne par compte de auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Informations de profil des utilisateurs superentreprise.';

-- RLS : chaque utilisateur ne voit et ne modifie que son propre profil
alter table public.profiles enable row level security;

create policy "Les utilisateurs voient leur propre profil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Les utilisateurs modifient leur propre profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Accès via l'API : lecture et mise à jour pour les connectés, rien pour les anonymes.
-- Pas d'INSERT ni de DELETE : la ligne est créée par le trigger ci-dessous
-- et supprimée avec le compte (on delete cascade).
revoke all on public.profiles from anon, authenticated;
grant select, update (full_name, company_name, phone) on public.profiles to authenticated;

-- Met à jour updated_at à chaque modification
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crée automatiquement le profil à l'inscription.
-- security definer : nécessaire pour écrire dans public.profiles depuis le
-- trigger sur auth.users ; non appelable via l'API (droits révoqués ci-dessous).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profils des comptes déjà créés avant cette migration
insert into public.profiles (id, full_name)
select id, raw_user_meta_data ->> 'full_name' from auth.users
on conflict (id) do nothing;
