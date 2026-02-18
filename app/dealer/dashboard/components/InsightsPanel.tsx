import React from "react";

export default function InsightsPanel({ insights }: { insights: string[] }) {
  if (!insights?.length) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <h3 className="font-bold text-blue-700 mb-2">Insights</h3>
      <ul className="list-disc pl-5 text-blue-900 text-sm">
        {insights.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
