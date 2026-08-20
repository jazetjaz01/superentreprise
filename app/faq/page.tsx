import type { Metadata } from "next";
import FAQ from "@/components/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes | Superentreprise",
  description:
    "Réponses aux questions fréquentes sur les abonnements, la diffusion d'annonces et la messagerie Superentreprise.",
};

export default function FaqPage() {
  return <FAQ />;
}
