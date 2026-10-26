import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ImageTextSectionProps = {
  // Ancre de la section (ex. « nous-connaitre » → /#nous-connaitre)
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  // Image au format 4:3 dans public/ (ex. 1600 × 1200 px) ; sans image, le logo s'affiche
  image?: string;
  cta?: { href: string; label: string };
};

// Bloc image à gauche + texte à droite (Nous connaître, Notre implantation…)
export const ImageTextSection = ({
  id,
  eyebrow,
  title,
  children,
  image,
  cta,
}: ImageTextSectionProps) => (
  <section id={id} className="mx-auto max-w-page scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand/5">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt=""
            width={96}
            height={96}
            className="absolute inset-0 m-auto size-24 opacity-20"
          />
        )}
      </div>

      <div className="text-brand">
        <p className="flex items-center gap-6 text-base">
          <span className="h-px w-14 bg-brand" />
          {eyebrow}
        </p>
        <h2 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-6 space-y-5 text-muted-foreground">{children}</div>
        {cta && (
          <Link
            href={cta.href}
            className="mt-10 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand/90"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  </section>
);
