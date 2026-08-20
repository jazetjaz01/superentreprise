import { CircleCheck, Images, MessageCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  "1 annonce active",
  "Jusqu'à 5 photos",
  "Messagerie interne avec les acheteurs",
  "Support par email",
  "Sans engagement",
];

const highlights = [
  { icon: Megaphone, label: "Diffusion de votre annonce" },
  { icon: Images, label: "Jusqu'à 5 photos" },
  { icon: MessageCircle, label: "Messagerie interne" },
];

const Pricing = () => {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem]">
        Un forfait simple pour vendre votre entreprise
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl -tracking-[0.01em] md:text-2xl">
        Diffusez votre annonce, sans engagement
      </p>

      <div className="mt-12 border bg-card shadow-xs/2 md:mt-16">
        <div className="grid grid-cols-1 border-b sm:grid-cols-3">
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className={
                index > 0
                  ? "flex flex-col items-center gap-2 border-t p-6 pt-9 text-center sm:border-t-0 sm:border-s"
                  : "flex flex-col items-center gap-2 p-6 pt-9 text-center"
              }
            >
              <item.icon className="size-10 stroke-[1.5px] text-foreground" />
              <p className="text-balance text-muted-foreground text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center px-6 py-10 text-center">
          <p className="font-satoshi font-semibold text-4xl">30 € TTC</p>
          <p className="mt-1 text-muted-foreground text-sm tracking-normal">
            par mois
          </p>

          <Button
            className="my-6 w-full max-w-xs"
            size="lg"
            render={<Link href="/deposer-une-annonce" />}
            nativeButton={false}
          >
            Déposer mon annonce
          </Button>

          <ul className="mt-2 space-y-2 text-left">
            {features.map((feature) => (
              <li className="flex items-center gap-2" key={feature}>
                <CircleCheck className="size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-muted-foreground text-sm">
        Vous êtes une agence ou un professionnel ?{" "}
        <Link
          className="font-medium text-primary underline"
          href="/forfaitspro"
        >
          Découvrez nos forfaits pour plusieurs annonces
        </Link>
        .
      </p>
    </section>
  );
};

export default Pricing;
