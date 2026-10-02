"use client";

import { SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type MessageComposerProps = {
  conversationId: string;
};

export const MessageComposer = ({ conversationId }: MessageComposerProps) => {
  const t = useTranslations("Messaging");
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: sendError } = await supabase.rpc("send_message", {
      p_conversation_id: conversationId,
      p_content: text,
    });
    setIsSubmitting(false);

    if (sendError) {
      setError(t("error"));
      return;
    }

    setContent("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-border p-3">
      {error && <p className="text-base text-red-500">{error}</p>}
      <div className="flex items-end gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("contentPlaceholder")}
          maxLength={3000}
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-md border border-border px-3 py-2 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isSubmitting || !content.trim()}>
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </form>
  );
};
