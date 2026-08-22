import type { Metadata } from "next";
import Team from "@/components/team";

export const metadata: Metadata = {
  title: "Notre équipe | Superentreprise",
  description: "Découvrez l'équipe derrière Superentreprise.",
};

export default function EquipePage() {
  return <Team />;
}
