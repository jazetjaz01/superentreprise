import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { Link } from "@/i18n/navigation";

type NavigationSheetProps = {
  isAuthenticated: boolean;
};

export const NavigationSheet = ({ isAuthenticated }: NavigationSheetProps) => {
  const t = useTranslations("Navbar");

  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>{t("menuTitle")}</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger render={<Button size="icon" variant="outline" />}><Menu /></SheetTrigger>
      <SheetContent className="flex flex-col px-6 py-3">
        <Logo />
        <NavMenu className="mt-6 [&>div]:h-full" orientation="vertical" />

        {!isAuthenticated && (
          <div className="mt-auto flex flex-col gap-2 pb-4">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/auth/login" />}
            >
              {t("signIn")}
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/auth/sign-up" />}
              className="rounded-full bg-black text-white hover:bg-black/80"
            >
              {t("signUp")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
