import {
  Activity,
  BarChart2,
  Briefcase,
  Eye,
  Gem,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Pencil,
  Rss,
  Settings,
  Sparkles,
  Target,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CompanyCreateMenu } from "@/components/company-create-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

type CompanyAdminSidebarProps = {
  adminUserId: string;
  companyId: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  followerCount: number;
  viewCount: number;
  activeTab: string;
};

export const CompanyAdminSidebar = async ({
  adminUserId,
  companyId,
  slug,
  name,
  logoUrl,
  bannerUrl,
  followerCount,
  viewCount,
  activeTab,
}: CompanyAdminSidebarProps) => {
  const t = await getTranslations("Company.adminSidebar");
  const tPage = await getTranslations("Company.page");
  const tFollow = await getTranslations("Company.follow");
  const tEdit = await getTranslations("Company.edit");

  const navItems = [
    { key: "dashboard", label: t("dashboard"), icon: LayoutDashboard, href: `/company/${slug}?view=admin` },
    { key: "posts", label: t("pagePosts"), icon: Newspaper, href: `/company/${slug}?view=admin&tab=posts` },
    { key: "stats", label: t("analytics"), icon: BarChart2, href: `/company/${slug}?view=admin&tab=stats` },
    { key: "feed", label: t("feed"), icon: Rss, href: `/company/${slug}?view=admin&tab=feed` },
    {
      key: "activity",
      label: t("activity"),
      icon: Activity,
      href: `/company/${slug}?view=admin&tab=stats`,
      meta: t("activityViews", { count: viewCount }),
    },
    { key: "messaging", label: t("messaging"), icon: MessageSquare, href: "#" },
    { key: "edit", label: tEdit("trigger"), icon: Pencil, href: `/company/${slug}?view=admin&tab=edit` },
  ];

  const bottomItems = [
    { label: t("jobs"), icon: Briefcase },
    { label: t("upgradePage"), icon: Sparkles },
    { label: t("advertiseToday"), icon: Target },
    { label: t("inviteToFollow"), icon: UserPlus },
    { label: t("preferences"), icon: Settings },
  ];

  return (
    <Card className="overflow-hidden pt-0">
      <div className="relative h-13 border-b border-border bg-secondary">
        {bannerUrl && (
          <Image src={bannerUrl} alt="" fill unoptimized className="object-cover" />
        )}
      </div>
      <CardContent className="relative -mt-8 flex flex-col items-start gap-1 text-left">
        <div className="relative z-10 flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-background p-0.5">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="size-full rounded-full object-cover"
            />
          ) : (
            <span className="font-heading text-ink-600 text-xl">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <p className="font-heading mt-2 text-[21px] leading-snug font-medium wrap-break-word">
          {name}
        </p>
        <Link href="#" className="flex items-center gap-1.5 text-base text-primary hover:underline">
          <Gem className="size-3.5" strokeWidth={1.5} />
          {t("verificationPremium")}
        </Link>
        <p className="text-ink-600 text-base">
          {tFollow("followersCount", { count: followerCount })}
        </p>

        <CompanyCreateMenu
          adminUserId={adminUserId}
          companyId={companyId}
          companyName={name}
          companyLogoUrl={logoUrl}
        />
        <Link
          href={`/company/${slug}`}
          className="border-border text-foreground hover:bg-foreground/[.07] mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-base font-medium"
        >
          <Eye className="size-4" strokeWidth={1.5} />
          {tPage("switchToMember")}
        </Link>

        <Separator className="my-3" />

        <nav className="flex w-full flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon, href, meta }) => (
            <Link
              key={key}
              href={href}
              className={`text-ink-700 hover:bg-foreground/[.07] flex items-center gap-3 rounded-md px-2 py-1.5 text-base font-medium ${
                key === activeTab ? "bg-foreground/4" : ""
              }`}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {label}
              {meta && <span className="text-ink-600 ml-auto text-base font-normal">{meta}</span>}
            </Link>
          ))}
        </nav>

        <Separator className="my-3" />

        <nav className="flex w-full flex-col gap-1">
          {bottomItems.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href="#"
              className="text-ink-700 hover:bg-foreground/[.07] flex items-center gap-3 rounded-md px-2 py-1.5 text-base font-medium"
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
