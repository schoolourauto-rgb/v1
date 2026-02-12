import React from "react";

interface InsightProps {
  label: string;
  value: string | number;
}

export default function Insight({ label, value }: InsightProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
