import { cn } from "@/lib/utils";
import React from "react";

export function FormLabel({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", className)} {...props}>
      {children}
    </label>
  );
}
