-- =====================================================================
-- Candidatures étudiants / jeunes diplômés : table + bucket privé (CV, lettre)
-- =====================================================================

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_type text not null
    check (opportunity_type in ('Stage', 'Alternance', 'Premier emploi', 'Candidature spontanée')),
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  email text not null
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  phone text check (char_length(phone) <= 30),
  school text check (char_length(school) <= 200),
  message text check (char_length(message) <= 3000),
  -- Chemins dans le bucket job-applications : « {uuid}/cv.pdf », « {uuid}/lettre.docx »
  cv_path text not null check (cv_path ~ '^[0-9a-f-]{36}/cv\.(pdf|doc|docx)$'),
  cover_letter_path text check (cover_letter_path ~ '^[0-9a-f-]{36}/lettre\.(pdf|doc|docx)$'),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.job_applications is 'Candidatures (lecture : dashboard uniquement). Fichiers dans le bucket privé job-applications.';

create index job_applications_created_at_idx on public.job_applications (created_at desc);

-- RLS : dépôt possible pour tous, aucune lecture / modification via l'API
alter table public.job_applications enable row level security;

create policy "Les visiteurs déposent une candidature"
  on public.job_applications for insert
  to anon, authenticated
  with check (true);

revoke all on public.job_applications from anon, authenticated;
grant insert (opportunity_type, first_name, last_name, email, phone, school, message, cv_path, cover_letter_path)
  on public.job_applications to anon, authenticated;

-- ---------------------------------------------------------------------
-- Bucket PRIVÉ : fichiers non accessibles publiquement (dashboard uniquement)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('job-applications', 'job-applications', false, 2097152, -- 2 Mo par fichier
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]);

-- Envoi uniquement (ni lecture, ni remplacement, ni suppression), au format attendu
create policy "Les visiteurs envoient CV et lettre de motivation"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'job-applications'
    and name ~ '^[0-9a-f-]{36}/(cv|lettre)\.(pdf|doc|docx)$'
  );
