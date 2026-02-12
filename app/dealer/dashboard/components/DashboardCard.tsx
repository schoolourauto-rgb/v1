import React from "react";

interface DashboardCardProps {
  title: string;
  icon: string;
  onClick?: () => void;
}

export default function DashboardCard({ title, icon, onClick }: DashboardCardProps) {
  return (
    <button
      className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition flex flex-col items-center justify-center gap-2 w-full text-center"
      onClick={onClick}
      type="button"
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-lg font-semibold">{title}</span>
    </button>
  );
}
