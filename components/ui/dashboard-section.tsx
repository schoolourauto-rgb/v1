import { cn } from "@/lib/utils";
import React from "react";

export function DashboardSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mb-12", className)}>{children}</section>);
}
