import Image from "next/image";
import { Expertise } from "@/components/expertise";
import { LogoDivider } from "@/components/logo-divider";

export default function Home() {
  return (
    <main>
      <section data-hero className="relative h-[80svh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/city.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        <div className="relative flex h-full flex-col items-center justify-center gap-6 px-4">
          <Image
            src="/logo.svg"
            alt=""
            width={96}
            height={96}
            priority
            className="size-20 brightness-0 invert drop-shadow-lg sm:size-24"
          />
          <h1 className="text-center text-4xl font-semibold tracking-tight text-white text-shadow-lg sm:text-5xl lg:text-6xl">
            Conseil en acquisition et cession d’entreprise 
            
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          La transmission en toute confiance
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-brand sm:text-2xl">
          Superentreprise accompagne les chefs d’entreprise dans leur projet de
          transmission ou de cession.
        </p>
        <LogoDivider className="mt-16" />
      </section>

      <Expertise />
    </main>
  );
}
