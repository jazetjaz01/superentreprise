import Image from "next/image";

// Présentation d'un dirigeant : nom en grand, fonction, puis portrait 3:4
// à gauche et biographie à droite. Sans photo : logo sur fond clair.
export const FounderProfile = ({
  name,
  role,
  image,
  children,
}: {
  name: string;
  role: string;
  image?: string;
  children: React.ReactNode;
}) => (
  <section className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-normal tracking-tight text-brand sm:text-5xl lg:text-6xl">
      {name}
    </h2>
    <p className="mt-6 text-lg text-brand">{role}</p>

    <div className="mt-12 grid items-start gap-10 md:grid-cols-[18rem_minmax(0,1fr)] lg:mt-16 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
      <div className="relative aspect-[3/4] w-full max-w-88 overflow-hidden bg-brand/5">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 352px, (min-width: 768px) 288px, 100vw"
            className="object-cover"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt=""
            width={96}
            height={96}
            className="absolute inset-0 m-auto size-24 opacity-20"
          />
        )}
      </div>

      <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </section>
);
