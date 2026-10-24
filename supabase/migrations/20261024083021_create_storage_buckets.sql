-- =====================================================================
-- Stockage des images : couvertures d'articles et avatars d'auteurs
-- =====================================================================

-- Buckets publics : les images sont lisibles par tous via leur URL publique
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('article-covers', 'article-covers', true, 5242880, -- 5 Mo
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', true, 2097152, -- 2 Mo
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

-- Envoi, remplacement et suppression : réservés aux writers, chacun dans son
-- propre dossier « {id utilisateur}/… ». Le remplacement (upsert) nécessite
-- les trois droits INSERT + SELECT + UPDATE.

create policy "Les writers voient leurs propres images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers envoient leurs images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers remplacent leurs images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  )
  with check (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );

create policy "Les writers suppriment leurs images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('article-covers', 'avatars')
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.is_writer())
  );
