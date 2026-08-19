-- Expose le nom et la ville de la société (mais jamais l'adresse complète,
-- le SIRET, la TVA ou toute autre donnée de facturation) pour affichage
-- public sur la page annonce.

create or replace view public_profiles as
select id, display_name, first_name, last_name, avatar_url, company_name, company_city
from profiles;
