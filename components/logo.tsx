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
      className="over-video:brightness-0 over-video:invert"
    />
    <span className={`${poppins.className} text-2xl text-brand over-video:text-white`}>
      superentreprise
    </span>
  </span>
);
