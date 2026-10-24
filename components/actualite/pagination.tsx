import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Pages affichées : la première, la dernière, la courante et ses voisines ;
// « … » remplace les pages masquées. Ex. page 1 sur 10 : 1 2 … 9 10
export function pageItems(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const items: (number | "…")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) items.push("…");
    items.push(page);
  });
  return items;
}

const cell = "flex size-12 items-center justify-center text-base font-semibold sm:size-16";

export const Pagination = ({
  current,
  total,
  basePath,
}: {
  current: number;
  total: number;
  // Page 1 = basePath, page n = basePath/page/n
  basePath: string;
}) => {
  if (total <= 1) return null;
  const href = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center text-brand">
      {current > 1 ? (
        <Link href={href(current - 1)} aria-label="Page précédente" className={cn(cell, "hover:bg-brand/5")}>
          <ArrowLeft className="size-5" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(cell, "text-muted-foreground/50")}>
          <ArrowLeft className="size-5" />
        </span>
      )}

      {pageItems(current, total).map((item, i) =>
        item === "…" ? (
          <span key={`ellipsis-${i}`} aria-hidden="true" className={cell}>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-label={`Page ${item}`}
            aria-current={item === current ? "page" : undefined}
            className={cn(
              cell,
              "transition-colors hover:bg-brand/5 aria-[current=page]:bg-brand aria-[current=page]:text-white"
            )}
          >
            {item}
          </Link>
        )
      )}

      {current < total ? (
        <Link href={href(current + 1)} aria-label="Page suivante" className={cn(cell, "hover:bg-brand/5")}>
          <ArrowRight className="size-5" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(cell, "text-muted-foreground/50")}>
          <ArrowRight className="size-5" />
        </span>
      )}
    </nav>
  );
};
