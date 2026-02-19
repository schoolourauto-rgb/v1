import React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ icon, title, description, className }: { icon?: React.ReactNode; title: string; description?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <div className="font-semibold text-lg mb-2">{title}</div>
      {description && <div className="text-gray-500 dark:text-gray-400 text-sm">{description}</div>}
    </div>
  );
}
