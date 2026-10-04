"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type MessageProfileButtonProps = {
  profileId: string;
};

export const MessageProfileButton = ({ profileId }: MessageProfileButtonProps) => {
  const t = useTranslations("ProfilePage");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("start_conversation", {
      p_other_profile_id: profileId,
    });
    setIsSubmitting(false);
    if (error || !data) return;

    router.push(`/messaging?c=${data}`);
  };

  return (
    <Button type="button" onClick={handleClick} disabled={isSubmitting}>
      <Send className="size-4" strokeWidth={1.5} />
      {t("message")}
    </Button>
  );
};
