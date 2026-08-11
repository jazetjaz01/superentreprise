"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const steps = [
  { slug: "activite", label: "Activité" },
  { slug: "informations", label: "Informations" },
  { slug: "finances", label: "Finances" },
  { slug: "localisation", label: "Localisation" },
  { slug: "photos", label: "Photos" },
  { slug: "publication", label: "Publication" },
] as const;

export function AnnonceStepper({ annonceId }: { annonceId: string }) {
  const pathname = usePathname();
  const activeIndex = steps.findIndex((step) =>
    pathname.endsWith(`/${step.slug}`),
  );

  return (
    <ol className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = activeIndex !== -1 && index < activeIndex;

        return (
          <li key={step.slug}>
            <Link
              href={`/annonces/${annonceId}/${step.slug}`}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                isActive && "bg-muted font-semibold text-foreground",
                !isActive && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                  isDone && "border-transparent bg-foreground text-background",
                  isActive && "border-foreground",
                  !isActive && !isDone && "border-border",
                )}
              >
                {isDone ? <Check className="size-3" /> : index + 1}
              </span>
              {step.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
