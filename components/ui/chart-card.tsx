import { cn } from "@/lib/utils";
import React from "react";

export function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white dark:bg-neutral-900 shadow-md p-6 md:p-8", className)}>
      <div className="font-semibold text-lg mb-4">{title}</div>
      <div>{children}</div>
    </div>
  );
}
