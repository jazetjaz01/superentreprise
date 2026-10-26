import { ImageTextSection } from "@/components/image-text-section";

export const NousConnaitre = () => (
  <ImageTextSection
    id="nous-connaitre"
    eyebrow="Nous connaître"
    title="Des entrepreneurs qui comprennent les entrepreneurs"
    image="/home/nousconnaitre.jpg"
    cta={{ href: "#", label: "En savoir plus" }}
  >
    <p>
      superentreprise accompagne les chefs d’entreprise à chaque étape de leur
      projet de transmission ou de cession. Nous savons qu’une transmission est
      bien plus qu’une opération financière : c’est l’aboutissement d’une vie
      d’entrepreneur.
    </p>
    <p>
      Notre engagement : un accompagnement sur mesure, confidentiel et exigeant,
      pour que la transmission de votre entreprise se fasse dans les meilleures
      conditions, pour vous comme pour vos équipes.
    </p>
  </ImageTextSection>
);
