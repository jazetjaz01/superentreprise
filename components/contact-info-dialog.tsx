"use client";

import { Link as LinkIcon, Mail, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type ContactInfoDialogProps = {
  profileId: string;
  profilePath: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  showEmail: boolean;
  isOwnProfile: boolean;
};

export const ContactInfoDialog = ({
  profileId,
  profilePath,
  website,
  phone,
  email,
  showEmail,
  isOwnProfile,
}: ContactInfoDialogProps) => {
  const t = useTranslations("ProfilePage.contactInfo");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [websiteValue, setWebsiteValue] = useState(website ?? "");
  const [phoneValue, setPhoneValue] = useState(phone ?? "");
  const [showEmailValue, setShowEmailValue] = useState(showEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileUrl =
    typeof window !== "undefined" ? `${window.location.origin}${profilePath}` : profilePath;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setIsEditing(false);
      setWebsiteValue(website ?? "");
      setPhoneValue(phone ?? "");
      setShowEmailValue(showEmail);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        website: websiteValue.trim() || null,
        phone: phoneValue.trim() || null,
        show_email: showEmailValue,
      })
      .eq("id", profileId);

    setIsSubmitting(false);
    if (updateError) {
      setError(t("error"));
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-foreground text-base hover:underline"
      >
        {t("trigger")}
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-website">{t("website")}</Label>
                <Input
                  id="contact-website"
                  value={websiteValue}
                  onChange={(e) => setWebsiteValue(e.target.value)}
                  placeholder="https://"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">{t("phone")}</Label>
                <Input
                  id="contact-phone"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-base text-foreground">
                <input
                  type="checkbox"
                  checked={showEmailValue}
                  onChange={(e) => setShowEmailValue(e.target.checked)}
                  className="accent-primary size-4"
                />
                {t("showEmail")}
              </label>
              {error && <p className="text-base text-red-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("saving") : t("save")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <User className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-foreground text-base font-semibold">{t("profileLink")}</p>
                  <p className="truncate text-base text-primary">{profileUrl}</p>
                </div>
              </div>

              {website && (
                <div className="flex items-start gap-3">
                  <LinkIcon className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-foreground text-base font-semibold">{t("website")}</p>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-base text-primary hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-foreground text-base font-semibold">{t("phone")}</p>
                    <p className="text-base text-foreground">{phone}</p>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-start gap-3">
                  <Mail className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-foreground text-base font-semibold">{t("email")}</p>
                    <p className="truncate text-base text-primary">{email}</p>
                  </div>
                </div>
              )}

              {isOwnProfile && (
                <>
                  <Separator />
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                      {t("edit")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
