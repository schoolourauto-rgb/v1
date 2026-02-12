import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
      <div className="text-base font-medium">{title}</div>
    </div>
  );
}
