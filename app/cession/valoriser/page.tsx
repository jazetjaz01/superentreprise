import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Valoriser votre entreprise",
  description:
    "Quelle est la valeur réelle de votre entreprise ? superentreprise vous accompagne dans l’évaluation de votre entreprise, première étape de tout projet de cession.",
};

export default function ValoriserPage() {
  return (
    <main>
      <PageBanner
        image="/carriere/carriere3.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Cession" },
          { label: "Valoriser" },
        ]}
        title="Valoriser votre entreprise"
        subtitle="Quelle est la valeur réelle de votre entreprise ?"
        cta={{ href: "/contact", label: "Demander une évaluation" }}
      >
        <p>
          Toute transmission commence par une évaluation juste. Connaître la
          valeur de votre entreprise vous permet de fixer un cap, de prendre les
          bonnes décisions et d’aborder les négociations avec assurance.
        </p>
      </PageBanner>
    </main>
  );
}
