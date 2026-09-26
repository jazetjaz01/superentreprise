import Image from "next/image";
import { Link } from "@/i18n/navigation";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src="/logose.svg" alt="Logo" width={32} height={32} priority />
    <p className="font-semibold">superentreprise</p>
  </Link>
);
