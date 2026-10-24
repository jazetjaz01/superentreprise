-- Coordonnées publiques de l'auteur (affichées avec ses articles).
-- L'email de contact est public : il peut différer de l'email de connexion.
alter table public.authors
  add column linkedin_url text
    check (linkedin_url ~ '^https://([a-z]{2,3}\.)?linkedin\.com/' and char_length(linkedin_url) <= 300),
  add column x_url text
    check (x_url ~ '^https://(www\.)?(x|twitter)\.com/' and char_length(x_url) <= 300),
  add column contact_email text
    check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(contact_email) <= 254);

grant insert (linkedin_url, x_url, contact_email),
      update (linkedin_url, x_url, contact_email)
  on public.authors to authenticated;
