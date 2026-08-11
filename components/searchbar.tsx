"use client";

import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { budgets } from "@/lib/annonces/budgets";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetOpen, setBudgetOpen] = useState(false);

  const budgetLabel = budgets.find((b) => b.value === budget)?.label;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (location) params.set("localisation", location);
    if (budget) params.set("budget", budget);
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className="flex w-full max-w-lg items-center gap-1 rounded-full border-2 border-transparent bg-muted py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-rose-200 focus-within:bg-white">
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder="Type de commerce"
        className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
      />

      <div className="h-6 w-px shrink-0 bg-border" />

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        placeholder="Localisation"
        className="h-10 min-w-0 flex-1 rounded-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
      />

      <Popover open={budgetOpen} onOpenChange={setBudgetOpen}>
        <PopoverTrigger
          className={cn(
            "flex h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors hover:bg-background/70",
            budgetOpen && "bg-background/70",
          )}
        >
          {budgetLabel ?? "Budget"}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 p-1.5">
          <div className="flex flex-col">
            {budgets.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setBudget(item.value === budget ? "" : item.value);
                  setBudgetOpen(false);
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
        </PopoverContent>
      </Popover>

      <Button
        size="icon"
        className="size-10 shrink-0 rounded-full bg-rose-500 text-white hover:bg-rose-600"
        onClick={handleSearch}
        aria-label="Rechercher"
      >
        <Search className="size-4" />
      </Button>
    </div>
  );
}
