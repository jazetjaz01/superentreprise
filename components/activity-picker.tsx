"use client";

import { useState } from "react";
import { activities } from "@/lib/annonces/activities";
import { cn } from "@/lib/utils";

export function ActivityPicker({
  defaultActivity,
}: {
  defaultActivity?: string | null;
}) {
  const preset = activities.find((item) => item.value === defaultActivity);
  const [selected, setSelected] = useState<string | null>(preset?.value ?? null);
  const [custom, setCustom] = useState(
    defaultActivity && !preset ? defaultActivity : "",
  );

  const activityValue = selected ?? custom;
  const sectorValue = selected
    ? (activities.find((item) => item.value === selected)?.sector ?? "")
    : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {activities.map((item) => {
          const isActive = selected === item.value;

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setSelected(isActive ? null : item.value);
                setCustom("");
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-input hover:bg-muted",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-medium text-sm" htmlFor="activity-custom">
          Vous ne trouvez pas votre activité ? Précisez-la
        </label>
        <input
          id="activity-custom"
          type="text"
          value={custom}
          onChange={(event) => {
            setCustom(event.target.value);
            setSelected(null);
          }}
          placeholder="Ex : Salle de sport, Auto-école, Camping..."
          className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <input type="hidden" name="activity" value={activityValue} />
      <input type="hidden" name="sector" value={sectorValue} />
    </div>
  );
}
