import type { Metadata } from "next";
import { CareersHero } from "@/components/careers-hero";

export const metadata: Metadata = {
  title: "Carrières",
  description:
    "Rejoignez superentreprise et accompagnez les dirigeants dans la transmission et la cession de leur entreprise.",
};

export default function CarrieresPage() {
  return (
    <main>
      <CareersHero />
    </main>
  );
}
