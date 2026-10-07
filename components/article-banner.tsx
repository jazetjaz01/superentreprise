import Image from "next/image";

type ArticleBannerProps = {
  coverUrl?: string | null;
};

export const ArticleBanner = ({ coverUrl }: ArticleBannerProps) => {
  return (
    <div className="relative isolate h-40 w-full overflow-hidden sm:h-72">
      <Image
        src={coverUrl ?? "/actualite/carte-monde.jpg"}
        alt=""
        fill
        priority
        unoptimized={!!coverUrl}
        className="object-cover"
      />
    </div>
  );
};
