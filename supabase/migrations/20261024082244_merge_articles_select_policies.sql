-- Une seule règle de lecture par rôle (évite d'évaluer deux règles par requête)
drop policy "Les articles publiés sont visibles par tous" on public.articles;
drop policy "Un auteur voit ses propres articles" on public.articles;

create policy "Les visiteurs voient les articles publiés"
  on public.articles for select
  to anon
  using (status = 'published' and published_at <= now());

create policy "Les connectés voient les articles publiés et leurs propres articles"
  on public.articles for select
  to authenticated
  using (
    (status = 'published' and published_at <= now())
    or (select auth.uid()) = author_id
  );
