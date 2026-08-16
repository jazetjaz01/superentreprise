-- Le SIRET (et non le SIREN) est la mention légale obligatoire sur une
-- facture française : on renomme la colonne en conséquence.

alter table profiles rename column siren to siret;
