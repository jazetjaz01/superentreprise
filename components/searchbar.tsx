"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const businessTypes = [
  "Restaurant",
  "Bar / Café",
  "Commerce de détail",
  "Hôtellerie",
  "Salon de coiffure / beauté",
  "Boulangerie / Pâtisserie",
  "Industrie",
  "Services aux entreprises",
  "Autre",
];

const budgets = [
  { label: "Moins de 50 000 €", value: "0-50000" },
  { label: "50 000 € - 100 000 €", value: "50000-100000" },
  { label: "100 000 € - 300 000 €", value: "100000-300000" },
  { label: "300 000 € - 500 000 €", value: "300000-500000" },
  { label: "Plus de 500 000 €", value: "500000-" },
];

function SearchField({
  label,
  value,
  placeholder,
  open,
  onOpenChange,
  children,
}: {
  label: string;
  value?: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-full px-5 py-2 text-left transition-colors outline-none hover:bg-muted focus-visible:bg-muted",
          open && "bg-muted",
        )}
      >
        <span className="text-xs font-semibold">{label}</span>
        <span
          className={cn(
            "w-full truncate text-sm",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {value || placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1.5">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export function SearchBar() {
  const router = useRouter();

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const [openField, setOpenField] = useState<
    "type" | "location" | "budget" | null
  >(null);

  const budgetLabel = budgets.find((b) => b.value === budget)?.label;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (location) params.set("localisation", location);
    if (budget) params.set("budget", budget);
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className="flex w-full max-w-xl items-center divide-x divide-border rounded-full bg-background shadow-sm ring-1 ring-foreground/10">
      <SearchField
        label="Type de commerce"
        placeholder="Tous les types"
        value={type}
        open={openField === "type"}
        onOpenChange={(open) => setOpenField(open ? "type" : null)}
      >
        <div className="flex flex-col">
          {businessTypes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setType(item);
                setOpenField(null);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-left text-sm hover:bg-muted",
                type === item && "bg-muted font-medium",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </SearchField>

      <SearchField
        label="Localisation"
        placeholder="Ville, région..."
        value={location}
        open={openField === "location"}
        onOpenChange={(open) => setOpenField(open ? "location" : null)}
      >
        <Input
          autoFocus
          placeholder="Rechercher une ville ou région"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpenField(null);
              handleSearch();
            }
          }}
        />
      </SearchField>

      <SearchField
        label="Budget"
        placeholder="Prix indifférent"
        value={budgetLabel}
        open={openField === "budget"}
        onOpenChange={(open) => setOpenField(open ? "budget" : null)}
      >
        <div className="flex flex-col">
          {budgets.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setBudget(item.value);
                setOpenField(null);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-left text-sm hover:bg-muted",
                budget === item.value && "bg-muted font-medium",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </SearchField>

      <div className="pr-1.5 pl-1">
        <Button
          size="icon"
          className="size-9 shrink-0 rounded-full"
          onClick={handleSearch}
          aria-label="Rechercher"
        >
          <Search className="size-4" />
        </Button>
      </div>
    </div>
  );
}
