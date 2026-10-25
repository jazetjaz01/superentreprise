import { Fragment } from "react";
import Link from "next/link";

type Crumb = { label: string; href?: string };

// Fil d'Ariane : « Accueil | Carrières | Page en cours » (dernier élément sans lien)
export const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Fil d’Ariane" className="text-sm">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && (
            <li aria-hidden="true" className="text-muted-foreground">
              |
            </li>
          )}
          <li>
            {item.href ? (
              <Link href={item.href} className="text-brand hover:underline hover:underline-offset-4">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-muted-foreground">
                {item.label}
              </span>
            )}
          </li>
        </Fragment>
      ))}
    </ol>
  </nav>
);
