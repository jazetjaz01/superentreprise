import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Annonces",
    links: [
      { title: "Toutes les annonces", href: "/recherche" },
      { title: "Vendre mon entreprise", href: "/deposer-une-annonce" },
      { title: "Acheter une entreprise", href: "/recherche" },
      { title: "Estimation gratuite", href: "#" },
      { title: "Mes annonces", href: "/annonces" },
    ],
  },
  {
    title: "À propos",
    links: [
      { title: "Qui sommes-nous", href: "#" },
      { title: "Notre mission", href: "#" },
      { title: "Presse", href: "#" },
      { title: "Actualités", href: "#" },
      { title: "Forfaits", href: "/forfait" },
      { title: "Forfaits pro", href: "/forfaitspro" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { title: "Guide du cédant", href: "#" },
      { title: "Guide du repreneur", href: "#" },
      { title: "Financement", href: "#" },
      { title: "Centre d'aide", href: "#" },
      { title: "Questions fréquentes", href: "/faq" },
    ],
  },
  {
    title: "Légal",
    links: [
      { title: "Conditions générales de ventes", href: "/conditions-generales" },
      { title: "Politique de confidentialité", href: "/politique-de-confidentialite" },
      { title: "Gestion des cookies", href: "/gestion-des-cookies" },
      { title: "Mentions légales", href: "/mentions-legales" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-(--breakpoint-2xl)">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:px-0">
          <div className="col-span-full lg:col-span-1">
            <Logo />

            <p className="mt-4  text-justify text-sm">
              Le spécialiste français des annonces de cession et
              d&apos;acquisition d&apos;entreprises, commerces et fonds de
              commerce en France, en Belgique et en Suisse.
            </p>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-medium">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title, href }) => (
                  <li key={title}>
                    <Link
                      className=" hover:text-muted-foreground text-sm"
                      href={href}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
          {/* Copyright */}
          <span className="text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="/">Superentreprise</Link>. Tous droits réservés Perpignan.
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="#" target="_blank" aria-label="Twitter / X">
              <FaXTwitter className="h-5 w-5 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" target="_blank" aria-label="LinkedIn">
              <FaLinkedin className="h-5 w-5 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" target="_blank" aria-label="Facebook">
              <FaFacebook className="h-5 w-5 hover:text-foreground transition-colors" />
            </Link>
            <Link href="#" target="_blank" aria-label="Instagram">
              <FaInstagram className="h-5 w-5 hover:text-foreground transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
