-- Informations de facturation société, nécessaires pour que les factures
-- Stripe soient émises au nom de la société (et non du compte utilisateur),
-- avec le numéro de TVA intracommunautaire affiché.

alter table profiles
  add column if not exists company_name text,
  add column if not exists siren text,
  add column if not exists vat_number text,
  add column if not exists company_address text,
  add column if not exists company_postal_code text,
  add column if not exists company_city text;
