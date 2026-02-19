import { cn } from "@/lib/utils";
import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtext?: string;
  className?: string;
}

export function StatsCard({ icon, value, label, subtext, className }: StatsCardProps) {
  return (
    <div className={cn("flex items-center gap-4 bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 md:p-8", className)}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-2xl">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</div>
        {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
      </div>
    </div>
  );
}
