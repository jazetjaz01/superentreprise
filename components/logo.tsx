import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const Logo = () => (
  <span className="flex items-center gap-2">
    <Image
      src="/logo.svg"
      alt=""
      width={24}
      height={24}
      priority
      className="transition-[filter] duration-300 over-video:brightness-0 over-video:invert"
    />
    <span className={`${poppins.className} text-2xl text-brand transition-colors duration-300 over-video:text-white`}>
      superentreprise
    </span>
  </span>
);
