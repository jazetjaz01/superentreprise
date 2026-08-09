import { Audiowide } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
});

export const Logo = () => (
  <Link
    href="/"
    className={cn(audiowide.className, "text-xl text-foreground lowercase")}
  >
    superentreprise
  </Link>
);
