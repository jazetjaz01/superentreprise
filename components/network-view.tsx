"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  NetworkConnectionCard,
  type NetworkConnectionSummary,
} from "@/components/network-connection-card";
import { NetworkSearch } from "@/components/network-search";
import { Card } from "@/components/ui/card";

type NetworkViewProps = {
  initialConnections: NetworkConnectionSummary[];
  viewerId: string;
  totalCount: number;
  query: string;
};

export const NetworkView = ({
  initialConnections,
  viewerId,
  totalCount,
  query,
}: NetworkViewProps) => {
  const t = useTranslations("Network");
  const [connections, setConnections] = useState(initialConnections);

  const handleRemove = (followerId: string) => {
    setConnections((current) => current.filter((item) => item.followerId !== followerId));
  };

  return (
    <Card className="overflow-hidden py-0">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">{t("title")}</h1>
          <p className="text-ink-600 mt-1 text-base">{t("count", { count: totalCount })}</p>
        </div>
        <NetworkSearch initialQuery={query} />
      </div>

      {connections.length === 0 ? (
        <p className="border-t border-border p-8 text-center text-base text-foreground">
          {query ? t("noResults", { query }) : t("empty")}
        </p>
      ) : (
        <div className="border-t border-border">
          {connections.map((connection) => (
            <NetworkConnectionCard
              key={connection.followerId}
              connection={connection}
              viewerId={viewerId}
              onRemoved={() => handleRemove(connection.followerId)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
