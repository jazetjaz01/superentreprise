import Image from "next/image";
import { Link } from "@/i18n/navigation";

export const Logo = () => (
  <Link href="/">
    <Image src="/logose.svg" alt="Logo" width={32} height={32} priority />
  </Link>
);
