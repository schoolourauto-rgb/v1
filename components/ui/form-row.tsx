import React from "react";
import { cn } from "@/lib/utils";

export function FormRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-6", className)}>{children}</div>);
}
