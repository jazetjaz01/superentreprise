import type { Metadata } from "next";
import PricingPro from "@/components/pricing-pro";

export const metadata: Metadata = {
  title: "Forfaits professionnels | Superentreprise",
  description:
    "Forfaits Superentreprise pour agences et professionnels de la cession d'entreprise : 5, 10 ou 25 annonces diffusées simultanément.",
};

export default function ForfaitsProPage() {
  return <PricingPro />;
}
