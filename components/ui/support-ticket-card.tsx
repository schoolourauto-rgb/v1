import { cn } from "@/lib/utils";
import React from "react";

interface SupportTicketCardProps {
  title: string;
  status: "open" | "closed" | "pending";
  description: string;
  createdAt: string;
  className?: string;
}

export function SupportTicketCard({ title, status, description, createdAt, className }: SupportTicketCardProps) {
  const statusMap = {
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    closed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };
  return (
    <div className={cn("rounded-2xl bg-white dark:bg-neutral-900 shadow-md p-6 md:p-8", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg">{title}</div>
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusMap[status])}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{description}</div>
      <div className="text-xs text-gray-400">{createdAt}</div>
    </div>
  );
}
