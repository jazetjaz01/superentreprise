import type { Metadata } from "next";
import Mission from "@/components/mission";

export const metadata: Metadata = {
  title: "Notre mission | Superentreprise",
  description:
    "Découvrez le rôle de Superentreprise et les avantages à utiliser notre plateforme pour céder ou reprendre une entreprise.",
};

export default function MissionPage() {
  return <Mission />;
}
