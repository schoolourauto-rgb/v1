import { cn } from "@/lib/utils";
import React from "react";

export function SectionContainer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "max-w-7xl mx-auto px-4 md:px-8 w-full",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
