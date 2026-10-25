-- Agences superentreprise (liste et carte de la page Contact)
create table public.offices (
  id bigint generated always as identity primary key,
  city text not null check (char_length(city) between 1 and 100),
  name text not null default 'Superentreprise',
  address_line text not null check (char_length(address_line) <= 200),
  postal_code text not null check (char_length(postal_code) <= 10),
  phone text check (char_length(phone) <= 30),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.offices is 'Agences affichées sur la page Contact (gestion : dashboard / SQL).';

-- Lecture publique des agences publiées ; aucune écriture via l'API
alter table public.offices enable row level security;

create policy "Les agences publiées sont visibles par tous"
  on public.offices for select
  to anon, authenticated
  using (is_published);

revoke all on public.offices from anon, authenticated;
grant select on public.offices to anon, authenticated;

create trigger offices_set_updated_at
  before update on public.offices
  for each row execute function public.set_updated_at();

-- Perpignan : adresse réelle. Paris et Lyon : adresses FACTICES à remplacer.
insert into public.offices (city, address_line, postal_code, phone, email, latitude, longitude, sort_order) values
  ('Perpignan', '7 avenue de Banyuls-sur-Mer', '66100', '06 16 22 46 82', 'contact@superentreprise.com', 42.6774783, 2.9076650, 1),
  ('Paris', '1 rue de l’Exemple (adresse provisoire)', '75008', null, null, 48.8729, 2.3080, 2),
  ('Lyon', '1 place de l’Exemple (adresse provisoire)', '69002', null, null, 45.7578, 4.8320, 3);
