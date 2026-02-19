import React from "react";
import { StatsCard } from "./stats-card";

export function DashboardStatsGroup({ stats }: { stats: { icon: React.ReactNode; value: string | number; label: string; subtext?: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </div>
  );
}
