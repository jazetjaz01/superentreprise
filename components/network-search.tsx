"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";

type NetworkSearchProps = {
  initialQuery: string;
};

export const NetworkSearch = ({ initialQuery }: NetworkSearchProps) => {
  const t = useTranslations("Network");
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = value.trim();
      router.replace(trimmed ? `/network?q=${encodeURIComponent(trimmed)}` : "/network", {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the input value changes
  }, [value]);

  return (
    <div className="relative w-full sm:w-64">
      <Search
        className="text-ink-600 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="border-border bg-background text-foreground focus-visible:border-ring h-9 w-full rounded-md border pr-3 pl-9 text-base outline-none"
      />
    </div>
  );
};
