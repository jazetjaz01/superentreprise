import Image from "next/image";

// Séparateur décoratif : deux traits horizontaux avec le logo au centre
export const LogoDivider = ({ className = "" }: { className?: string }) => (
  <div
    role="separator"
    className={`mx-auto flex w-full max-w-4xl items-center gap-6 sm:gap-12 ${className}`}
  >
    <span className="h-px flex-1 bg-border" />
    <Image src="/logo.svg" alt="" width={36} height={36} className="size-9" />
    <span className="h-px flex-1 bg-border" />
  </div>
);
