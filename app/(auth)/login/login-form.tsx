"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("confirm") === "1";

  return (
    <form action={formAction}>
      <CardContent className="flex flex-col gap-4">
        {justSignedUp && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Compte créé, vérifie tes emails pour confirmer ton adresse avant
            de te connecter.
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state?.error && (
          <p className="text-sm text-destructive" aria-live="polite">
            {state.error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 border-t-0 bg-transparent px-(--card-spacing) pt-2">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Connexion..." : "Se connecter"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/signin" className="text-foreground underline">
            Créer un compte
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}
