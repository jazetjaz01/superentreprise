import type { ReactNode } from "react";

import Image from "next/image";

type ArticleBannerProps = {
  coverUrl?: string | null;
  children?: ReactNode;
};

export const ArticleBanner = ({ coverUrl, children }: ArticleBannerProps) => {
  return (
    <div className="relative isolate h-64 w-full overflow-hidden sm:h-96">
      <Image
        src={coverUrl ?? "/actualite/carte-monde.jpg"}
        alt=""
        fill
        priority
        unoptimized={!!coverUrl}
        className="object-cover"
      />
      {children}
    </div>
  );
};
