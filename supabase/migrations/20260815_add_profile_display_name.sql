-- Surnom optionnel affiché publiquement (messagerie, articles d'actualité...)
-- à la place du prénom/nom réel, pour préserver la confidentialité des
-- vendeurs et acheteurs tant qu'ils ne le souhaitent pas.

alter table profiles
  add column if not exists display_name text;
