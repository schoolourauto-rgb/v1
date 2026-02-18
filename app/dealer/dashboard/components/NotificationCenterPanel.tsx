"use client";

import { useEffect, useState } from "react";

type Settings = {
  chat: boolean;
  leads: boolean;
  sound: boolean;
  badge: boolean;
  broadcast: boolean;
  weekly_report: boolean;
};

export default function NotificationCenterPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dealer/notification-settings")
      .then(res => res.json())
      .then(data => setSettings(data.settings));
  }, []);

  const toggle = async (key: keyof Settings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setLoading(true);

    await fetch("/api/dealer/notification-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setLoading(false);
  };

  if (!settings) return null;

  const Toggle = ({ label, k }: { label: string; k: keyof Settings }) => (
    <div className="flex justify-between items-center py-4 border-b border-zinc-800">
      <span className="text-sm text-zinc-200">{label}</span>
      <button
        onClick={() => toggle(k)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          settings[k] ? "bg-yellow-500" : "bg-zinc-700"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
            settings[k] ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">
        🔔 Notification Center
      </h2>

      <Toggle label="Chat Messages" k="chat" />
      <Toggle label="New Leads" k="leads" />
      <Toggle label="Sound Alert" k="sound" />
      <Toggle label="Unread Badge Counter" k="badge" />
      <Toggle label="Promotional Broadcast" k="broadcast" />
      <Toggle label="Weekly Report Email" k="weekly_report" />

      {loading && (
        <div className="text-xs text-zinc-400 mt-3">Saving changes...</div>
      )}
    </div>
  );
}
