import React from "react";
import { ActivityPanel } from "./activity-panel";

export function DashboardActivity({ items }: { items: { id: string; avatar?: string; name: string; action: string; timestamp: string }[] }) {
  return <ActivityPanel items={items} />;
}
