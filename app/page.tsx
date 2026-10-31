import type { Metadata } from "next";
import Image from "next/image";
import { Carrieres } from "@/components/carrieres";
import { Expertise } from "@/components/expertise";
import { Implantation } from "@/components/implantation";
import { KeyFigures } from "@/components/key-figures";
import { LogoDivider } from "@/components/logo-divider";
import { NousConnaitre } from "@/components/nous-connaitre";
import { getOffices } from "@/lib/offices";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Données structurées : décrit le cabinet et ses implantations à Google
async function OrganizationJsonLd() {
  // Les adresses provisoires (Lyon) ne sont pas transmises à Google
  const offices = (await getOffices()).filter(
    (office) => !office.address_line.includes("provisoire")
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      "Cabinet de conseil en cession, acquisition et transmission d’entreprise.",
    telephone: "+33616224682",
    email: "contact@superentreprise.com",
    areaServed: "FR",
    department: offices.map((office) => ({
      "@type": "ProfessionalService",
      name: `${SITE_NAME} ${office.city}`,
      telephone: office.phone ?? undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address_line,
        postalCode: office.postal_code,
        addressLocality: office.city,
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: office.latitude,
        longitude: office.longitude,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <main>
      <OrganizationJsonLd />
      <section data-hero className="relative h-[80svh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/city-720.mp4"
          poster="/video/city-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-4">
          <Image
            src="/logo.svg"
            alt=""
            width={96}
            height={96}
            priority
            className="size-20 brightness-0 invert drop-shadow-lg sm:size-24"
          />
          <h1 className="text-center text-4xl font-semibold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl">
            Conseil en acquisition et cession d’entreprise
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Les experts de la transmission d’entreprise
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-brand sm:text-2xl">
          Superentreprise accompagne les chefs d’entreprise dans leur projet de
          transmission ou de cession.
        </p>
        <LogoDivider className="mt-16" />
      </section>

      <Expertise />
      <KeyFigures />
      <NousConnaitre />
      <Carrieres />
      <Implantation />
    </main>
  );
}
