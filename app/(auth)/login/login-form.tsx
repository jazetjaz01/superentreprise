"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("confirm") === "1";
  const next = searchParams.get("next") ?? "/";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
      <h1 className="font-semibold text-2xl">Content de vous revoir</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Connectez-vous pour accéder à votre espace Superentreprise.
      </p>

      <div className="mt-8 w-full">
        <GoogleAuthButton next={next} />
      </div>

      <div className="my-6 flex w-full items-center gap-3 text-muted-foreground text-xs">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="w-full">
        <input type="hidden" name="next" value={next} />
        <div className="flex flex-col gap-3">
          {justSignedUp && (
            <p className="text-muted-foreground text-sm" aria-live="polite">
              Compte créé, vérifie tes emails pour confirmer ton adresse avant
              de te connecter.
            </p>
          )}
          <div className="text-left">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Adresse email"
              className="h-11 rounded-full px-4"
              required
            />
          </div>
          <div className="text-left">
            <Label htmlFor="password" className="sr-only">
              Mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              className="h-11 rounded-full px-4"
              required
            />
          </div>
          {state?.error && (
            <p className="text-destructive text-sm" aria-live="polite">
              {state.error}
            </p>
          )}
          <Button
            type="submit"
            disabled={pending}
            className="mt-2 h-11 w-full rounded-full"
          >
            {pending ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-muted-foreground text-sm">
        Pas encore de compte ?{" "}
        <Link href="/signin" className="text-foreground underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
