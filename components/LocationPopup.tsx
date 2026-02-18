"use client"

import { useEffect, useState } from "react"

interface LocationPopupProps {
  onComplete?: () => void;
  forceCenter?: boolean;
}

export default function LocationPopup({ onComplete, forceCenter }: LocationPopupProps) {
  const [loading, setLoading] = useState(false);

  const enableLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        localStorage.setItem("user_location", JSON.stringify(data));
        setLoading(false);
        if (onComplete) onComplete();
      },
      () => {
        setLoading(false);
        alert("Location permission denied");
      }
    );
  };

  return (
    <div className={forceCenter ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" : "fixed bottom-4 left-4 right-4 z-50"}>
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg w-full max-w-sm mx-auto">
        <h3 className="font-semibold text-lg mb-2">Enable Location</h3>
        <p className="text-muted-foreground text-sm mb-4">Show cars near your area for better results.</p>
        <button
          onClick={enableLocation}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg active:scale-95 transition-transform duration-150"
          disabled={loading}
        >
          {loading ? "Enabling..." : "Allow Location"}
        </button>
      </div>
    </div>
  );
}
