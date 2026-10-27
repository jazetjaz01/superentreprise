import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { AuthLinks } from "@/components/auth-links";
import { CurrentYear } from "@/components/current-year";

// Colonnes du footer (mêmes rubriques que la navbar)
const columns = [
  {
    title: "Cession",
    links: [
      { href: "/cession/valoriser", label: "Valoriser" },
      { href: "/cession/preparer", label: "Préparer" },
      { href: "/cession/transmettre", label: "Transmettre" },
    ],
  },
  {
    title: "Acquisition",
    links: [
      { href: "/acquisition/reprendre", label: "Reprendre" },
      { href: "/acquisition/securiser", label: "Sécuriser" },
      { href: "/acquisition/accompagner", label: "Accompagner" },
    ],
  },
  {
    title: "Superentreprise",
    links: [
      { href: "/#nous-connaitre", label: "Nous connaître" },
      { href: "/actualite", label: "Actualité" },
      { href: "/contact", label: "Contactez-nous" },
    ],
  },
  {
    title: "Carrières",
    links: [
      { href: "/carrieres", label: "Nous rejoindre" },
      { href: "/carrieres/etudiants", label: "Étudiants et jeunes diplômés" },
      { href: "/carrieres/experimentes", label: "Profils expérimentés" },
    ],
  },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite#cookies", label: "Cookies" },
  { href: "/confidentialite", label: "Confidentialité des données" },
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

          <nav className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {columns.map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                  {title}
                </p>
                <ul className="mt-5 space-y-4">
                  {links.map(({ href, label }) => (
                    <li key={label}>
                      <Link href={href} className="hover:underline">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Connexion / inscription, ou nom + déconnexion si connecté */}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Mon espace
              </p>
              {/* usePathname (via AuthLinks) : Suspense requis par cacheComponents */}
              <Suspense fallback={<div className="mt-5 h-16" />}>
                <AuthLinks variant="footer" className="mt-5 flex-col items-start gap-4" />
              </Suspense>
            </div>
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
            className="underline-offset-4 hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);
