import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact | superentreprise",
  description: "Contactez l'équipe superentreprise.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
        Contactez-nous
      </h1>
      <p className="mt-3 text-muted-foreground">
        Une question, un projet ? Envoyez-nous un message et nous vous
        répondrons rapidement.
      </p>

      <form className="mt-10 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" autoComplete="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject">Sujet</Label>
          <Input id="subject" name="subject" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={6} required />
        </div>
        <Button type="submit" className="w-full sm:w-fit">
          Envoyer
        </Button>
      </form>
    </main>
  );
}
