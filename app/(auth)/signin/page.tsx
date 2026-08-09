"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Inscris-toi avec ton email pour commencer.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="flex flex-col gap-4">
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
                autoComplete="new-password"
                minLength={6}
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
              {pending ? "Création..." : "Créer mon compte"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-foreground underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
