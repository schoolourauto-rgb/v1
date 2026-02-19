"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DashboardChartClient(props: any) {
  return <Chart {...props} />;
}
