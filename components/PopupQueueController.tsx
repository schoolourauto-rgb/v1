"use client";
import { useEffect, useState, useCallback } from "react";
import { popupQueue, PopupType } from "@/lib/ui/popupQueue";
import LocationPopup from "@/components/LocationPopup";
import InstallAppPopup from "@/components/InstallAppPopup";
import dynamic from "next/dynamic";

// Dynamically import Recaptcha if needed
const Recaptcha = dynamic(() => import("@/components/ui/Recaptcha"), { ssr: false });

export default function PopupQueueController() {
  const [active, setActive] = useState<PopupType | null>(null);
  const [locationCheckDone, setLocationCheckDone] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [humanVerified, setHumanVerified] = useState(false);

  // Listen to popup queue changes
  useEffect(() => {
    const listener = (popup: PopupType | null) => setActive(popup);
    popupQueue.onChange(listener);
    return () => popupQueue.offChange(listener);
  }, []);

  // Stealth human verification on first load
  useEffect(() => {
    const verify = async () => {
      try {
        const stored = localStorage.getItem("humanVerified");
        const ts = localStorage.getItem("humanVerifiedAt");
        const now = Date.now();
        if (stored === "true" && ts && now - Number(ts) < 24 * 60 * 60 * 1000) {
          setHumanVerified(true);
          return;
        }
        // Simulate async human check (replace with real check if needed)
        const result = await runHumanCheck();
        if (result === true) {
          localStorage.setItem("humanVerified", "true");
          localStorage.setItem("humanVerifiedAt", String(Date.now()));
          setHumanVerified(true);
        } else {
          setShowFallback(true);
        }
      } catch {
        setShowFallback(true);
      }
    };
    verify();
  }, []);

  // Only enqueue other popups if human verified
  useEffect(() => {
    if (humanVerified) {
      popupQueue.enqueue("location");
      popupQueue.enqueue("install");
    }
  }, [humanVerified]);

  // Stealth human check function (replace with real logic)
  async function runHumanCheck() {
    // Example: call backend or run invisible recaptcha, etc.
    // For now, simulate always passing (replace with real check)
    // await new Promise(r => setTimeout(r, 500));
    return true;
  }

  // Location check complete handler
  const handleLocationCheckComplete = useCallback(() => {
    setLocationCheckDone(true);
    popupQueue.setFlag("location");
    popupQueue.dequeue();
  }, []);

  // Install prompt complete handler
  const handleInstallPromptComplete = useCallback(() => {
    popupQueue.setFlag("install");
    popupQueue.dequeue();
  }, []);

  if (showFallback) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10">
        <div className="bg-card rounded-xl p-6 shadow-xl max-w-xs w-full flex flex-col items-center">
          <h3 className="mb-2 text-base font-semibold">Verification required.</h3>
          {/* Optionally, add invisible captcha or button here if needed */}
        </div>
      </div>
    );
  }
  if (active === "location") {
    return <LocationPopup onComplete={handleLocationCheckComplete} forceCenter />;
  }
  if (active === "install") {
    return <InstallAppPopup onComplete={handleInstallPromptComplete} />;
  }
  return null;
}
