import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/breadcrumb";

// Bandeau d'en-tête des pages d'accompagnement (Valoriser, Préparer…) :
// photo sous un voile bleu marine, fil d'Ariane, titre, accroche, texte et bouton.
// Affiché sous la navbar (fond blanc), pas en superposition.
export const PageBanner = ({
  breadcrumb,
  title,
  subtitle,
  children,
  cta,
  image,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  children: ReactNode;
  cta?: { href: string; label: string };
  image: string;
}) => (
  <section className="relative overflow-hidden">
    <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
    <div aria-hidden="true" className="absolute inset-0 bg-brand/80 mix-blend-multiply" />
    <div aria-hidden="true" className="absolute inset-0 bg-brand/40" />

    <div className="relative mx-auto max-w-page px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
      <Breadcrumb items={breadcrumb} tone="light" />
      <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <div className="mt-8 max-w-3xl">
        {subtitle && <p className="text-xl font-semibold sm:text-2xl">{subtitle}</p>}
        <div className="mt-2 text-lg leading-relaxed text-white/90">{children}</div>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="mt-10 inline-flex h-12 items-center bg-white px-8 text-sm font-medium uppercase tracking-wide text-brand transition-colors hover:bg-white/90"
        >
          {cta.label}
        </Link>
      )}
    </div>
  </section>
);
