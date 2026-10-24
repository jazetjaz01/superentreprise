-- Fonction de l'auteur, affichée sous son nom sur les articles
alter table public.authors
  add column job_title text check (char_length(job_title) <= 120);

-- Modifiable par l'auteur, comme les autres champs de sa fiche
grant insert (job_title), update (job_title) on public.authors to authenticated;
