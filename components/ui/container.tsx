import { cn } from "@/lib/utils";
import React from "react";

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 md:px-8 w-full", className)} {...props}>
      {children}
    </div>
  );
}
