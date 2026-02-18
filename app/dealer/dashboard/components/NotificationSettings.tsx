"use client"
import { useEffect, useState } from "react"

const defaultSettings = {
  chat: true,
  lead: false,
  sold: false,
  weekly: false,
  system: true,
};

const options = [
  { key: "chat", label: "Chat Messages" },
  { key: "lead", label: "New Leads" },
  { key: "sold", label: "Car Sold" },
  { key: "weekly", label: "Weekly Report" },
  { key: "system", label: "System Alerts" },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState<{ [key: string]: boolean }>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dealer/notification-settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({ ...defaultSettings, ...data.settings });
      });
  }, []);

  const handleToggle = (key: string) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setLoading(true);
    fetch("/api/dealer/notification-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: updated }),
    })
      .then(() => setLoading(false));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h3 className="font-semibold mb-4 text-yellow-500">Notification Settings</h3>
      <div className="space-y-4">
        {options.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground">{opt.label}</span>
            <button
              className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center ${settings[opt.key] ? "bg-yellow-500" : "bg-neutral-700"}`}
              onClick={() => handleToggle(opt.key)}
              disabled={loading}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-all duration-300 ${settings[opt.key] ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
