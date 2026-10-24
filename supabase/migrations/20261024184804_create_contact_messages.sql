-- Messages envoyés depuis le formulaire de la page Contact
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (char_length(subject) between 1 and 100),
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  email text not null
    check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  phone text check (char_length(phone) <= 30),
  message text not null check (char_length(message) between 10 and 5000),
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Messages du formulaire de contact (lecture : dashboard uniquement).';

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- RLS : tout visiteur peut envoyer un message, personne ne peut les lire,
-- modifier ou supprimer via l'API (consultation dans le dashboard Supabase).
alter table public.contact_messages enable row level security;

create policy "Les visiteurs envoient un message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

revoke all on public.contact_messages from anon, authenticated;
grant insert (subject, first_name, last_name, email, phone, message)
  on public.contact_messages to anon, authenticated;
