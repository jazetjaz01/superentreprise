import Image from "next/image";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
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
    <span className={`${pacifico.className} text-2xl text-brand over-video:text-white`}>
      superentreprise
    </span>
  </span>
);
