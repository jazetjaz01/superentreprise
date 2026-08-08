import { Audiowide } from "next/font/google";
import { cn } from "@/lib/utils";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
});

export const Logo = () => (
  <span className={cn(audiowide.className, "text-xl text-foreground lowercase")}>
    superentreprise
  </span>
);
