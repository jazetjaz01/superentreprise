-- Lyon : adresse réelle (coordonnées : api-adresse.data.gouv.fr)
update public.offices
set address_line = '24 cours Albert Thomas',
    postal_code = '69008',
    latitude = 45.74836,
    longitude = 4.862724,
    updated_at = now()
where city = 'Lyon';
