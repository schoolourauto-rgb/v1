import { cn } from "@/lib/utils";
import React from "react";

export function FormCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white dark:bg-neutral-900 shadow-md p-6 md:p-8", className)}>{children}</div>);
}
