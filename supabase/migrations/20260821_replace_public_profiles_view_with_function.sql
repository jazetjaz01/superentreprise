-- Remplace la vue `public_profiles` (signalée "Security Definer View" par
-- l'audit sécurité Supabase) par une fonction SECURITY DEFINER explicite,
-- avec search_path fixé, qui expose les mêmes colonnes non sensibles.

drop view if exists public_profiles;

create or replace function get_public_profiles(ids uuid[])
returns table (
  id uuid,
  display_name text,
  first_name text,
  last_name text,
  avatar_url text,
  company_name text,
  company_city text
)
language sql
security definer
set search_path = public
stable
as $$
  select id, display_name, first_name, last_name, avatar_url, company_name, company_city
  from profiles
  where id = any(ids);
$$;

grant execute on function get_public_profiles(uuid[]) to anon, authenticated;
