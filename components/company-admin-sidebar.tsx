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
import { EditCompanyDialog } from "@/components/edit-company-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

type CompanyAdminSidebarProps = {
  adminUserId: string;
  companyId: string;
  slug: string;
  name: string;
  tagline: string | null;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  about: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  followerCount: number;
};

export const CompanyAdminSidebar = async ({
  adminUserId,
  companyId,
  slug,
  name,
  tagline,
  industry,
  companySize,
  website,
  about,
  logoUrl,
  bannerUrl,
  followerCount,
}: CompanyAdminSidebarProps) => {
  const t = await getTranslations("Company.adminSidebar");
  const tPage = await getTranslations("Company.page");
  const tFollow = await getTranslations("Company.follow");
  const tEdit = await getTranslations("Company.edit");

  const navItems = [
    { label: t("dashboard"), icon: LayoutDashboard, href: `/company/${slug}?view=admin` },
    { label: t("pagePosts"), icon: Newspaper, href: `/company/${slug}?view=admin&tab=posts` },
    { label: t("analytics"), icon: BarChart2, href: `/company/${slug}?view=admin&tab=stats` },
    { label: t("feed"), icon: Rss, href: `/company/${slug}?view=admin&tab=feed` },
    { label: t("activity"), icon: Activity, href: "#" },
    { label: t("messaging"), icon: MessageSquare, href: "#" },
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
        <p className="font-heading mt-2 text-[21px] leading-snug font-semibold wrap-break-word">
          {name}
        </p>
        <Link href="#" className="flex items-center gap-1.5 text-[13px] text-primary hover:underline">
          <Gem className="size-3.5" strokeWidth={1.5} />
          {t("verificationPremium")}
        </Link>
        <p className="text-ink-600 text-xs">
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
          className="border-border text-foreground hover:bg-foreground/[.07] mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-semibold"
        >
          <Eye className="size-4" strokeWidth={1.5} />
          {tPage("switchToMember")}
        </Link>

        <Separator className="my-3" />

        <nav className="flex w-full flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="text-ink-700 hover:bg-foreground/[.07] flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-semibold"
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {label}
            </Link>
          ))}

          <EditCompanyDialog
            companyId={companyId}
            name={name}
            tagline={tagline}
            industry={industry}
            companySize={companySize}
            website={website}
            about={about}
            logoUrl={logoUrl}
            trigger={
              <span className="border-primary text-primary bg-primary/10 flex items-center gap-3 rounded-md border-l-2 px-2 py-1.5 text-sm font-semibold">
                <Pencil className="size-4" strokeWidth={1.5} />
                {tEdit("trigger")}
              </span>
            }
          />
        </nav>

        <Separator className="my-3" />

        <nav className="flex w-full flex-col gap-1">
          {bottomItems.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href="#"
              className="text-ink-700 hover:bg-foreground/[.07] flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-semibold"
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
