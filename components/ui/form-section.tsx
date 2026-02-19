import { cn } from "@/lib/utils";
import React from "react";

export function FormSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mb-8", className)}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
