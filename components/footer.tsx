import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

const footerSections = [
  {
    id: "product",
    links: ["overview", "features", "solutions", "tutorials", "pricing", "releases"],
  },
  {
    id: "company",
    links: ["about", "careers", "press", "news", "mediaKit", "contact"],
  },
  {
    id: "resources",
    links: ["blog", "newsletter", "events", "helpCentre", "tutorials", "support"],
  },
  {
    id: "useCases",
    links: ["startups", "enterprise", "government", "saas", "marketplaces", "ecommerce"],
  },
  {
    id: "social",
    links: ["twitter", "linkedin", "facebook", "github", "angellist", "dribbble"],
  },
  {
    id: "legal",
    links: ["terms", "privacy", "cookies", "licenses", "settings", "contact"],
  },
] as const;

const Footer = () => {
  const t = useTranslations("Footer");
  type FooterKey = Parameters<typeof t>[0];

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-(--breakpoint-xl)">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-4 py-12 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
          {footerSections.map(({ id, links }) => (
            <div key={id}>
              <h6 className="font-medium">
                {t(`sections.${id}.title` as FooterKey)}
              </h6>
              <ul className="mt-6 space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      className="text-muted-foreground hover:text-foreground"
                      href="#"
                    >
                      {t(`sections.${id}.links.${link}` as FooterKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-between gap-x-2 gap-y-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <Logo />

          <span className="text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
