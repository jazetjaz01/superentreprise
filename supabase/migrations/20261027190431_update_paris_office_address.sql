-- Région parisienne : adresse réelle à Boulogne-Billancourt (coordonnées : api-adresse.data.gouv.fr)
update public.offices
set city = 'Boulogne-Billancourt',
    address_line = '1 place Paul Verlaine',
    postal_code = '92100',
    latitude = 48.8287,
    longitude = 2.240527,
    updated_at = now()
where city = 'Paris';
