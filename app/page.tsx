export default function Home() {
  return (
    <main className="relative h-svh w-full overflow-hidden">
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
    </main>
  );
}
