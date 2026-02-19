import React from "react";
import { cn } from "@/lib/utils";

export function FormInputGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6", className)}>{children}</div>);
}
