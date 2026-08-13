"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SubscriptionStatusPoller({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (isActive) {
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle();

      const active = data?.status === "active" || data?.status === "trialing";

      if (active && !cancelled) {
        cancelled = true;
        clearInterval(interval);
        router.replace("/dashboard/abonnement");
        router.refresh();
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isActive, userId, router]);

  return null;
}
