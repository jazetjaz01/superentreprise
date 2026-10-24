"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "./actions";

type Mode = "login" | "signup";

export const AuthForm = ({ defaultMode = "login" }: { defaultMode?: Mode }) => {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [loginState, loginAction, loginPending] = useActionState(login, undefined);
  const [signupState, signupAction, signupPending] = useActionState(signup, undefined);

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 border-b">
        {(["login", "signup"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className="-mb-px border-b-2 border-transparent pb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground aria-pressed:border-brand aria-pressed:text-brand"
          >
            {value === "login" ? "Se connecter" : "Créer un compte"}
          </button>
        ))}
      </div>

      <form action={isLogin ? loginAction : signupAction} className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? undefined : 8}
            required
          />
          {!isLogin && (
            <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
          )}
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}
        {state?.message && (
          <p role="status" className="text-sm text-brand">
            {state.message}
          </p>
        )}

        <Button type="submit" disabled={pending} className="h-10 w-full">
          {pending ? "Patientez…" : isLogin ? "Se connecter" : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
};
