-- Permet de supprimer un utilisateur (auth.users) même s'il a des annonces
-- ou des articles d'actualité : leur suppression est désormais en cascade,
-- au lieu de bloquer la suppression avec une violation de clé étrangère.
-- (subscriptions a déjà ON DELETE CASCADE depuis sa création.)

do $$
declare
  cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'annonces'::regclass
    and confrelid = 'profiles'::regclass
    and contype = 'f';

  if cname is not null then
    execute format('alter table annonces drop constraint %I', cname);
  end if;

  execute 'alter table annonces
    add constraint annonces_author_id_fkey
    foreign key (author_id) references profiles(id) on delete cascade';
end $$;

do $$
declare
  cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'actualite_articles'::regclass
    and confrelid = 'profiles'::regclass
    and contype = 'f';

  if cname is not null then
    execute format('alter table actualite_articles drop constraint %I', cname);
  end if;

  execute 'alter table actualite_articles
    add constraint actualite_articles_author_id_fkey
    foreign key (author_id) references profiles(id) on delete cascade';
end $$;
