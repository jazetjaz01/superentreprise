export type SectorItem = {
  value: string;
  label: string;
  children?: SectorItem[];
};

export type SectorUniverse = {
  value: string;
  label: string;
  categories: SectorItem[];
};

export const sectorUniverses: SectorUniverse[] = [
  {
    value: "agriculture",
    label: "Agriculture",
    categories: [
      {
        value: "exploitation_agricole",
        label: "Exploitation agricole",
        children: [
          { value: "cereales_grandes_cultures", label: "Céréales / Grandes cultures" },
          { value: "elevage", label: "Élevage" },
          { value: "viticulture", label: "Viticulture" },
          { value: "maraichage_horticulture", label: "Maraîchage / Horticulture" },
          { value: "arboriculture", label: "Arboriculture" },
        ],
      },
      { value: "agroalimentaire_production", label: "Agroalimentaire (production)" },
      { value: "peche_aquaculture", label: "Pêche / Aquaculture" },
      { value: "jardinerie_pepiniere", label: "Jardinerie / Pépinière" },
      { value: "paysagisme", label: "Paysagisme" },
    ],
  },
  {
    value: "automobile",
    label: "Automobile",
    categories: [
      {
        value: "concession_automobile",
        label: "Concession automobile",
        children: [
          { value: "vehicules_neufs", label: "Neuf" },
          { value: "vehicules_occasion", label: "Occasion" },
        ],
      },
      {
        value: "garage_reparation",
        label: "Garage / Réparation",
        children: [
          { value: "mecanique_generale", label: "Mécanique générale" },
          { value: "carrosserie", label: "Carrosserie" },
          { value: "pneumatiques", label: "Pneumatiques" },
          { value: "controle_technique", label: "Contrôle technique" },
        ],
      },
      { value: "location_vehicules", label: "Location de véhicules" },
      { value: "auto_ecole", label: "Auto-école" },
      { value: "lavage_automobile", label: "Lavage automobile" },
      { value: "pieces_detachees_accessoires", label: "Pièces détachées / Accessoires" },
      { value: "moto_deux_roues", label: "Moto / Deux-roues" },
    ],
  },
  {
    value: "batiment_construction",
    label: "Bâtiment / Construction",
    categories: [
      {
        value: "gros_oeuvre",
        label: "Gros œuvre",
        children: [
          { value: "maconnerie", label: "Maçonnerie" },
          { value: "terrassement", label: "Terrassement" },
          { value: "charpente", label: "Charpente" },
        ],
      },
      {
        value: "second_oeuvre",
        label: "Second œuvre",
        children: [
          { value: "plomberie", label: "Plomberie" },
          { value: "electricite", label: "Électricité" },
          { value: "peinture_decoration", label: "Peinture / Décoration" },
          { value: "menuiserie", label: "Menuiserie" },
          { value: "carrelage", label: "Carrelage" },
          { value: "isolation", label: "Isolation" },
        ],
      },
      { value: "negoce_materiaux", label: "Négoce de matériaux" },
      { value: "bureau_etudes_architecture", label: "Bureau d'études / Architecture" },
      { value: "entreprise_renovation", label: "Entreprise de rénovation" },
    ],
  },
  {
    value: "commerce",
    label: "Commerce",
    categories: [
      {
        value: "commerce_alimentaire",
        label: "Commerce alimentaire",
        children: [
          { value: "epicerie_superette", label: "Épicerie / Supérette" },
          { value: "boucherie_charcuterie", label: "Boucherie / Charcuterie" },
          { value: "boulangerie_patisserie", label: "Boulangerie / Pâtisserie" },
          { value: "primeur", label: "Primeur" },
          { value: "cave_a_vins_caviste", label: "Cave à vins / Caviste" },
        ],
      },
      {
        value: "commerce_non_alimentaire",
        label: "Commerce non-alimentaire",
        children: [
          { value: "pret_a_porter_textile", label: "Prêt-à-porter / Textile" },
          { value: "chaussures_maroquinerie", label: "Chaussures / Maroquinerie" },
          { value: "bijouterie_horlogerie", label: "Bijouterie / Horlogerie" },
          { value: "librairie_papeterie", label: "Librairie / Papeterie" },
          { value: "fleuriste", label: "Fleuriste" },
          { value: "bricolage_jardinage", label: "Bricolage / Jardinage" },
          { value: "meubles_decoration", label: "Meubles / Décoration" },
          { value: "electromenager_multimedia", label: "Électroménager / Multimédia" },
          { value: "jouets", label: "Jouets" },
          { value: "opticien", label: "Opticien" },
        ],
      },
      { value: "commerce_gros_import_export", label: "Commerce de gros / Import-export" },
      { value: "e_commerce", label: "E-commerce" },
    ],
  },
  {
    value: "hotellerie",
    label: "Hôtellerie",
    categories: [
      {
        value: "hotel",
        label: "Hôtel",
        children: [
          { value: "hotel_independant", label: "Hôtel indépendant" },
          { value: "hotel_chaine_franchise", label: "Hôtel de chaîne / Franchise" },
        ],
      },
      { value: "residence_tourisme", label: "Résidence de tourisme" },
      { value: "camping", label: "Camping" },
      { value: "chambres_hotes_gite", label: "Chambres d'hôtes / Gîte" },
      { value: "auberge_jeunesse", label: "Auberge de jeunesse" },
    ],
  },
  {
    value: "immobilier",
    label: "Immobilier",
    categories: [
      { value: "agence_immobiliere", label: "Agence immobilière" },
      { value: "administration_biens_syndic", label: "Administration de biens / Syndic" },
      { value: "promotion_immobiliere", label: "Promotion immobilière" },
      { value: "location_saisonniere_conciergerie", label: "Location saisonnière / Conciergerie" },
      { value: "diagnostic_immobilier", label: "Diagnostic immobilier" },
      { value: "immobilier_entreprise", label: "Immobilier d'entreprise" },
    ],
  },
  {
    value: "industrie",
    label: "Industrie",
    categories: [
      { value: "metallurgie_mecanique", label: "Métallurgie / Mécanique" },
      { value: "plasturgie", label: "Plasturgie" },
      { value: "textile_habillement_fabrication", label: "Textile / Habillement (fabrication)" },
      { value: "bois_ameublement_fabrication", label: "Bois / Ameublement (fabrication)" },
      { value: "imprimerie", label: "Imprimerie" },
      { value: "chimie", label: "Chimie" },
      { value: "agroalimentaire_transformation", label: "Agroalimentaire (transformation)" },
      { value: "electronique", label: "Électronique" },
    ],
  },
  {
    value: "informatique_digital",
    label: "Informatique / Digital",
    categories: [
      { value: "developpement_logiciel_ssii", label: "Développement logiciel / SSII" },
      { value: "agence_web_digitale", label: "Agence web / digitale" },
      { value: "infogerance_support_it", label: "Infogérance / Support IT" },
      { value: "e_commerce_saas", label: "E-commerce / SaaS" },
      { value: "cybersecurite", label: "Cybersécurité" },
      { value: "data_ia", label: "Data / IA" },
    ],
  },
  {
    value: "restauration",
    label: "Restauration",
    categories: [
      {
        value: "restaurant",
        label: "Restaurant",
        children: [
          { value: "restaurant_traditionnel", label: "Restaurant traditionnel" },
          { value: "restaurant_gastronomique", label: "Restaurant gastronomique" },
          { value: "restaurant_italien", label: "Restaurant italien" },
          { value: "restaurant_asiatique", label: "Restaurant asiatique" },
          { value: "restaurant_marocain", label: "Restaurant marocain" },
          { value: "restaurant_mediterraneen", label: "Restaurant méditerranéen" },
          { value: "restaurant_specialise", label: "Restaurant spécialisé" },
        ],
      },
      {
        value: "restauration_rapide",
        label: "Restauration rapide",
        children: [
          { value: "burger", label: "Burger" },
          { value: "kebab", label: "Kebab" },
          { value: "pizza", label: "Pizza" },
          { value: "sandwicherie", label: "Sandwicherie" },
          { value: "tacos", label: "Tacos" },
          { value: "food_truck", label: "Food truck" },
        ],
      },
      {
        value: "bar",
        label: "Bar",
        children: [
          { value: "bar_a_vins", label: "Bar à vins" },
          { value: "bar_a_cocktails", label: "Bar à cocktails" },
          { value: "bar_tabac", label: "Bar-tabac" },
        ],
      },
      { value: "cafe_salon_the", label: "Café / Salon de thé" },
      { value: "traiteur", label: "Traiteur" },
    ],
  },
  {
    value: "sante",
    label: "Santé",
    categories: [
      { value: "pharmacie", label: "Pharmacie" },
      {
        value: "cabinet_medical_paramedical",
        label: "Cabinet médical / paramédical",
        children: [
          { value: "cabinet_dentaire", label: "Cabinet dentaire" },
          { value: "cabinet_kinesitherapie", label: "Cabinet de kinésithérapie" },
          { value: "cabinet_infirmier", label: "Cabinet infirmier" },
        ],
      },
      { value: "laboratoire_analyses", label: "Laboratoire d'analyses" },
      { value: "optique", label: "Optique" },
      { value: "audioprothese", label: "Audioprothèse" },
      { value: "ehpad_medico_social", label: "EHPAD / Établissement médico-social" },
    ],
  },
  {
    value: "services",
    label: "Services",
    categories: [
      {
        value: "services_personne",
        label: "Services à la personne",
        children: [
          { value: "coiffure", label: "Coiffure" },
          { value: "institut_beaute_esthetique", label: "Institut de beauté / Esthétique" },
          { value: "spa_bien_etre", label: "Spa / Bien-être" },
          { value: "pressing_blanchisserie", label: "Pressing / Blanchisserie" },
          { value: "toilettage_animalier", label: "Toilettage animalier" },
        ],
      },
      {
        value: "services_entreprises",
        label: "Services aux entreprises",
        children: [
          { value: "conseil_consulting", label: "Conseil / Consulting" },
          { value: "comptabilite_expertise_comptable", label: "Comptabilité / Expertise comptable" },
          { value: "agence_communication_marketing", label: "Agence de communication / Marketing" },
          { value: "ressources_humaines_interim", label: "Ressources humaines / Intérim" },
          { value: "nettoyage_professionnel", label: "Nettoyage professionnel" },
          { value: "securite_gardiennage", label: "Sécurité / Gardiennage" },
        ],
      },
      { value: "formation", label: "Formation" },
      { value: "evenementiel", label: "Événementiel" },
      { value: "photographie", label: "Photographie" },
    ],
  },
  {
    value: "transport",
    label: "Transport",
    categories: [
      {
        value: "transport_marchandises",
        label: "Transport de marchandises",
        children: [
          { value: "transport_routier", label: "Transport routier" },
          { value: "messagerie_livraison", label: "Messagerie / Livraison" },
          { value: "demenagement", label: "Déménagement" },
        ],
      },
      {
        value: "transport_voyageurs",
        label: "Transport de voyageurs",
        children: [
          { value: "taxi_vtc", label: "Taxi / VTC" },
          { value: "autocar", label: "Autocar" },
        ],
      },
      { value: "logistique_entreposage", label: "Logistique / Entreposage" },
      { value: "transport_maritime_fluvial", label: "Transport maritime / fluvial" },
    ],
  },
];

function findNodePath(
  nodes: SectorItem[],
  targetValue: string,
  trail: SectorItem[] = [],
): SectorItem[] | null {
  for (const node of nodes) {
    const nextTrail = [...trail, node];
    if (node.value === targetValue) return nextTrail;
    if (node.children) {
      const found = findNodePath(node.children, targetValue, nextTrail);
      if (found) return found;
    }
  }
  return null;
}

export function getUniverseLabel(universeValue: string | null | undefined) {
  return sectorUniverses.find((u) => u.value === universeValue)?.label ?? null;
}

export function getActivityPath(
  universeValue: string | null | undefined,
  activityValue: string | null | undefined,
): SectorItem[] {
  if (!universeValue || !activityValue) return [];
  const universe = sectorUniverses.find((u) => u.value === universeValue);
  if (!universe) return [];
  return findNodePath(universe.categories, activityValue) ?? [];
}

export function getActivityLabel(
  universeValue: string | null | undefined,
  activityValue: string | null | undefined,
): string | null {
  const path = getActivityPath(universeValue, activityValue);
  return path.length > 0 ? path[path.length - 1].label : null;
}

export function getSectorBreadcrumb(
  universeValue: string | null | undefined,
  activityValue: string | null | undefined,
): string {
  const universeLabel = getUniverseLabel(universeValue);
  if (!universeLabel) return "";
  const path = getActivityPath(universeValue, activityValue);
  return [universeLabel, ...path.map((node) => node.label)].join(" › ");
}
