import React from "react";
import { ChartCard } from "./chart-card";

export function DashboardChart({ children }: { children: React.ReactNode }) {
  return <ChartCard title="Cars Growth Trend">{children}</ChartCard>;
}
