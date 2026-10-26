-- Candidatures des profils expérimentés : nouveau type de poste + poste actuel

-- Ajout de « Poste expérimenté » aux types acceptés (anciens types conservés)
alter table public.job_applications
  drop constraint job_applications_opportunity_type_check;
alter table public.job_applications
  add constraint job_applications_opportunity_type_check
  check (opportunity_type in (
    'Stage', 'Alternance', 'Premier emploi', 'Poste expérimenté', 'Candidature spontanée'
  ));

-- Poste actuel / entreprise (profils expérimentés)
alter table public.job_applications
  add column current_position text check (char_length(current_position) <= 200);

grant insert (current_position) on public.job_applications to anon, authenticated;
