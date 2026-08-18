"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "./actions";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roles = [
  { value: "vendeur", label: "Je vends une entreprise" },
  { value: "acheteur", label: "Je recherche une entreprise" },
] as const;

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signup, null);
  const [role, setRole] = useState<string>("vendeur");

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
      <h1 className="font-semibold text-2xl">Créez votre compte</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Inscrivez-vous pour découvrir les meilleures annonces de cession
        d&apos;entreprises.
      </p>

      <div className="mt-6 flex w-full flex-col gap-1.5 text-left">
        <Label>Vous êtes...</Label>
        <div className="flex gap-2 mt-4 ">
          {roles.map((item) => {
            const isActive = role === item.value;

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setRole(item.value)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-input hover:bg-muted",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 w-full">
        <GoogleAuthButton next="/onboarding/role" />
      </div>

      <div className="my-6 flex w-full items-center gap-3 text-muted-foreground text-xs">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="w-full">
        <input type="hidden" name="role" value={role} />
        <div className="flex flex-col gap-3">
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
              autoComplete="new-password"
              placeholder="Mot de passe"
              className="h-11 rounded-full px-4"
              minLength={6}
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
            {pending ? "Création..." : "Créer mon compte"}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-muted-foreground text-sm">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-foreground underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
