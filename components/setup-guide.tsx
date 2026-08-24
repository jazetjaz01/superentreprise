import { CheckIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SetupGuideStep = {
  title: string;
  description: string;
  status: "completed" | "pending";
  href: string;
  cta?: string;
};

export default function SetupGuide({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: SetupGuideStep[];
}) {
  return (
    <div className="mx-auto w-full py-2">
      <h2 className="font-medium text-xl tracking-[-0.02em]">{title}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>

      <div className="mt-4 flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
        {steps.map((step, index) => (
          <div
            className={cn("relative isolate flex items-center gap-4 px-4 py-3 sm:px-5", {
              "bg-primary/8": step.status === "completed",
            })}
            key={step.title}
          >
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs",
                {
                  "bg-primary": step.status === "completed",
                  "border border-dashed": step.status === "pending",
                },
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="size-3.5 text-primary-foreground" />
              ) : (
                index + 1
              )}
            </div>

            <div className="flex grow flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex-1">
                <h3 className="text-pretty font-medium text-sm sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-pretty text-muted-foreground text-xs sm:text-sm">
                  {step.description}
                </p>
              </div>

              <div className="leading-none">
                {step.status === "completed" ? (
                  <Badge variant="secondary">Fait</Badge>
                ) : (
                  <Button
                    className="-ml-2.5 sm:ml-0"
                    size="sm"
                    variant="ghost"
                    render={<Link href={step.href} />}
                    nativeButton={false}
                  >
                    {step.cta ?? "Compléter"} <ChevronRightIcon />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
