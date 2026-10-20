import Image from "next/image";
import { ABeeZee } from "next/font/google";

const abeezee = ABeeZee({
  weight: "400",
  subsets: ["latin"],
});

export const Logo = () => (
  <span className="flex items-center gap-2">
    <Image src="/logo.svg" alt="" width={24} height={24} priority />
    <span className={`${abeezee.className} text-2xl text-brand`}>
      superentreprise
    </span>
  </span>
);
