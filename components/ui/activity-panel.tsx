import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";
import React from "react";

type ActivityItem = {
  id: string;
  avatar?: string;
  name: string;
  action: string;
  timestamp: string;
};

export function ActivityPanel({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white dark:bg-neutral-900 shadow-md p-6 md:p-8", className)}>
      <div className="font-semibold text-lg mb-4">Recent Activity</div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4">
            <Avatar src={item.avatar} size={40} />
            <div className="flex-1">
              <div className="font-medium text-sm">
                {item.name} <span className="text-gray-500 dark:text-gray-400">{item.action}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{item.timestamp}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
