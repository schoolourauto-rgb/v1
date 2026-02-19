import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardStatsGroup } from "./dashboard-stats-group";
import { DashboardChart } from "./dashboard-chart";
import { DashboardActivity } from "./dashboard-activity";
import { DashboardCars } from "./dashboard-cars";
import { DashboardWelcome } from "./dashboard-welcome";

export function DashboardMain({
  name,
  stats,
  chart,
  activity,
  cars,
}: {
  name: string;
  stats: { icon: React.ReactNode; value: string | number; label: string; subtext?: string }[];
  chart: React.ReactNode;
  activity: { id: string; avatar?: string; name: string; action: string; timestamp: string }[];
  cars: { id: string; image: string; title: string; price: number; status: "active" | "sold" | "pending" }[];
}) {
  return (
    <>
      <DashboardWelcome name={name} />
      <DashboardHeader title="Dashboard" />
      <DashboardStatsGroup stats={stats} />
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <DashboardChart>{chart}</DashboardChart>
        </div>
        <div>
          <DashboardActivity items={activity} />
        </div>
      </div>
      <DashboardCars cars={cars} />
    </>
  );
}
