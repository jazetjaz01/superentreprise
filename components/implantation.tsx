import { ImageTextSection } from "@/components/image-text-section";

// À compléter avec les implantations réelles (villes, régions, nombre de bureaux…)
export const Implantation = () => (
  <ImageTextSection
    eyebrow="Notre implantation"
    title="Au plus près des dirigeants, partout en France"
    cta={{ href: "/contact", label: "Rencontrons-nous" }}
  >
    <p>
      Notre ancrage local nous permet d’accompagner les chefs d’entreprise au
      plus près de leur territoire, de leur écosystème et de leurs repreneurs
      potentiels.
    </p>
  </ImageTextSection>
);
