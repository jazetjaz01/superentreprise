"use client";

import { useActionState, useRef } from "react";
import { sendMessage } from "./actions";
import { Button } from "@/components/ui/button";

export function MessageForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, pending] = useActionState(sendMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex items-end gap-2">
        <textarea
          name="content"
          rows={2}
          required
          placeholder="Écrivez votre message..."
          className="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        <Button type="submit" disabled={pending} className="shrink-0 rounded-full">
          {pending ? "Envoi..." : "Envoyer"}
        </Button>
      </div>
      {state?.error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {state.error}
        </p>
      )}
    </form>
  );
}
