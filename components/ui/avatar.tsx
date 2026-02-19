import { cn } from "@/lib/utils";
import React from "react";

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 40, className }: AvatarProps) {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt || "Avatar"}
      width={size}
      height={size}
      className={cn(
        "rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
