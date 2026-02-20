import { cn } from "@/lib/utils";
import React from "react";

export function H1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-[2rem] sm:text-[2.25rem] font-bold tracking-tight", className)} {...props}>
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-[1.5rem] sm:text-[1.75rem] font-semibold tracking-tight", className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-[1.25rem] sm:text-[1.5rem] font-semibold tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function Muted({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-gray-500 dark:text-gray-400 text-sm", className)} {...props}>
      {children}
    </p>
  );
}

export function SmallLabel({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-xs font-medium uppercase tracking-wider text-gray-400", className)} {...props}>
      {children}
    </span>
  );
}
