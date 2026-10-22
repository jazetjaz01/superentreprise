import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { CurrentYear } from "@/components/current-year";

const columns = [
  [
    { href: "#", label: "Diagnostic & Stratégie" },
    { href: "#", label: "Préparation et Optimisation" },
    { href: "#", label: "Exécution et Closing" },
  ],
  [
    { href: "#", label: "Nous connaître" },
    { href: "#", label: "Actualité" },
  ],
  [{ href: "#", label: "Carrières" }],
  [{ href: "/contact", label: "Contactez-nous" }],
];

const legalLinks = [
  { href: "#", label: "Mentions légales" },
  { href: "#", label: "Cookies" },
  { href: "#", label: "Confidentialité des données" },
];

export const Footer = () => (
  <footer className="bg-brand text-white">
    <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-12 sm:flex-row sm:gap-16">
          <Link href="/" aria-label="superentreprise, accueil" className="shrink-0">
            <Image
              src="/logo.svg"
              alt=""
              width={48}
              height={48}
              className="size-12 brightness-0 invert"
            />
          </Link>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4">
            {columns.map((links, index) => (
              <ul key={index} className="space-y-5">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </div>

        <a
          href="#"
          className="group flex items-center gap-4 self-start font-semibold"
        >
          Retour en haut
          <span className="flex size-10 items-center justify-center rounded-full border border-white transition-colors group-hover:bg-white group-hover:text-brand">
            <ArrowUp className="size-5" />
          </span>
        </a>
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span>
          © <CurrentYear /> superentreprise
        </span>
        {legalLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="underline underline-offset-4 hover:no-underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);
