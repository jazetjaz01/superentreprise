-- =====================================================================
-- Actualité : rôles, auteurs, catégories et articles
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Rôle des utilisateurs dans profiles
-- ---------------------------------------------------------------------
create type public.user_role as enum ('member', 'writer');

alter table public.profiles
  add column role public.user_role not null default 'member';

-- Le rôle n'est volontairement pas dans les colonnes modifiables par
-- l'utilisateur (grant update de la migration create_profiles) :
-- il s'attribue uniquement par SQL ou depuis le dashboard.

-- Vrai si l'utilisateur connecté a le rôle writer
create function public.is_writer()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'writer'
  );
$$;

revoke execute on function public.is_writer() from public, anon;
grant execute on function public.is_writer() to authenticated;

-- ---------------------------------------------------------------------
-- 2. Auteurs : identité publique (nom, photo), séparée de profiles
--    qui contient des données privées (téléphone, entreprise)
-- ---------------------------------------------------------------------
create table public.authors (
  id uuid primary key references public.profiles (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 100),
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.authors is 'Identité publique des auteurs d''articles (nom affiché, avatar).';

alter table public.authors enable row level security;

create policy "Les auteurs sont visibles par tous"
  on public.authors for select
  to anon, authenticated
  using (true);

create policy "Un writer crée sa fiche auteur"
  on public.authors for insert
  to authenticated
  with check ((select auth.uid()) = id and (select public.is_writer()));

create policy "Un writer modifie sa fiche auteur"
  on public.authors for update
  to authenticated
  using ((select auth.uid()) = id and (select public.is_writer()))
  with check ((select auth.uid()) = id and (select public.is_writer()));

revoke all on public.authors from anon, authenticated;
grant select on public.authors to anon, authenticated;
grant insert (id, display_name, avatar_url, bio) on public.authors to authenticated;
grant update (display_name, avatar_url, bio) on public.authors to authenticated;

create trigger authors_set_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Catégories (gérées par SQL / dashboard, lecture publique)
-- ---------------------------------------------------------------------
create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  created_at timestamptz not null default now()
);

comment on table public.categories is 'Catégories des articles d''actualité.';

alter table public.categories enable row level security;

create policy "Les catégories sont visibles par tous"
  on public.categories for select
  to anon, authenticated
  using (true);

revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;

insert into public.categories (slug, name) values
  ('transmission', 'Transmission'),
  ('cession', 'Cession'),
  ('financement', 'Financement'),
  ('fiscalite-juridique', 'Fiscalité & juridique');

-- ---------------------------------------------------------------------
-- 4. Articles
-- ---------------------------------------------------------------------
create type public.article_status as enum ('draft', 'published');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category_id bigint references public.categories (id) on delete set null,
  author_id uuid not null references public.authors (id) on delete restrict,
  status public.article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.articles is 'Articles de la rubrique Actualité.';

create index articles_published_idx on public.articles (published_at desc) where status = 'published';
create index articles_category_id_idx on public.articles (category_id);
create index articles_author_id_idx on public.articles (author_id);

alter table public.articles enable row level security;

-- Lecture : articles publiés pour tous, brouillons pour leur auteur
create policy "Les articles publiés sont visibles par tous"
  on public.articles for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "Un auteur voit ses propres articles"
  on public.articles for select
  to authenticated
  using ((select auth.uid()) = author_id);

-- Écriture : réservée aux writers, sur leurs propres articles
create policy "Un writer crée ses articles"
  on public.articles for insert
  to authenticated
  with check ((select auth.uid()) = author_id and (select public.is_writer()));

create policy "Un writer modifie ses articles"
  on public.articles for update
  to authenticated
  using ((select auth.uid()) = author_id and (select public.is_writer()))
  with check ((select auth.uid()) = author_id and (select public.is_writer()));

create policy "Un writer supprime ses articles"
  on public.articles for delete
  to authenticated
  using ((select auth.uid()) = author_id and (select public.is_writer()));

revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon;
grant select, insert, update, delete on public.articles to authenticated;

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- Renseigne published_at à la première publication
create function public.set_article_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

revoke execute on function public.set_article_published_at() from public, anon, authenticated;

create trigger articles_set_published_at
  before insert or update on public.articles
  for each row execute function public.set_article_published_at();
