import Image from "next/image";

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
            Confiez votre succession d’entreprise
            <br />à des experts de confiance
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
      </section>
    </main>
  );
}
