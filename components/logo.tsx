import { ABeeZee } from "next/font/google";

const abeezee = ABeeZee({
  weight: "400",
  subsets: ["latin"],
});

export const Logo = () => (
  <span className={`${abeezee.className} text-2xl text-foreground`}>
    superentreprise
  </span>
);
