import type { Metadata } from "next";
import { CareersCulture } from "@/components/careers-culture";
import { CareersHero } from "@/components/careers-hero";
import { CareersQuote } from "@/components/careers-quote";

export const metadata: Metadata = {
  title: "Carrières",
  description:
    "Rejoignez superentreprise et accompagnez les dirigeants dans la transmission et la cession de leur entreprise.",
};

export default function CarrieresPage() {
  return (
    <main>
      <CareersHero />
      <CareersCulture />
      <CareersQuote />
    </main>
  );
}
