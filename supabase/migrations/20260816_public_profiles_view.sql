-- La RLS sur `profiles` empêche tout visiteur (anonyme ou un autre
-- utilisateur) de lire le profil d'un auteur d'article/annonce, donc le
-- nom (et le surnom) affiché publiquement retombait toujours sur
-- "Superentreprise". Cette vue expose uniquement les champs nécessaires à
-- un affichage public (jamais l'email, le téléphone, ni les informations
-- de facturation), et contourne la RLS de la table sous-jacente car elle
-- est créée par le rôle propriétaire (postgres), qui la bypass.

create or replace view public_profiles as
select id, display_name, first_name, last_name, avatar_url
from profiles;

grant select on public_profiles to anon, authenticated;
