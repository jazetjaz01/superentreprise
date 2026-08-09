import { Suspense } from "react";
import { LoginForm } from "./login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Connecte-toi avec ton email et ton mot de passe.
          </CardDescription>
        </CardHeader>
        <Suspense>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
