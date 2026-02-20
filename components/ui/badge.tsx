import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning";
};

const variantClasses: Record<string, string> = {
  success: "bg-green-500 text-white",
  danger: "bg-red-500 text-white",
  warning: "bg-[var(--accent)] text-[var(--text)]",
  default: "bg-black text-white",
};

export function Badge({ children, variant }: BadgeProps) {
  const classes = variant ? variantClasses[variant] || variantClasses.default : variantClasses.default;
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${classes}`}>
      {children}
    </span>
  );
}
