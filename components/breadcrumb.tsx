import { Fragment } from "react";
import Link from "next/link";

type Crumb = { label: string; href?: string };

const TONES = {
  default: {
    link: "text-brand",
    current: "text-muted-foreground",
    separator: "text-muted-foreground",
  },
  // Sur un bandeau sombre (photo + voile bleu marine)
  light: {
    link: "text-white/90 hover:text-white",
    current: "text-white",
    separator: "text-white/60",
  },
};

// Fil d'Ariane : « Accueil | Carrières | Page en cours » (dernier élément sans lien)
export const Breadcrumb = ({
  items,
  tone = "default",
}: {
  items: Crumb[];
  tone?: keyof typeof TONES;
}) => {
  const colors = TONES[tone];

  return (
    <nav aria-label="Fil d’Ariane" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && (
              <li aria-hidden="true" className={colors.separator}>
                |
              </li>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`${colors.link} hover:underline hover:underline-offset-4`}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={i === items.length - 1 ? "page" : undefined} className={colors.current}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};
