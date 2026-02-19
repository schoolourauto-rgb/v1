import { cn } from "@/lib/utils";
import React from "react";

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <aside className={cn("w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-screen p-6", className)}>
      {children}
    </aside>
  );
}
