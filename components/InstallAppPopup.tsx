"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

interface InstallAppPopupProps {
  onComplete?: () => void;
}

export default function InstallAppPopup({ onComplete }: InstallAppPopupProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installReady, setInstallReady] = useState(false);

  // Detect if device is mobile
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Check if app is already installed
  function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (typeof window !== 'undefined' && 'standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
  }
  // Only show if not already shown in this session
  useEffect(() => {
    if (localStorage.getItem("installPromptShown") === "true") return;
    let promptEvent: BeforeInstallPromptEvent | null = null;
    if (!isMobile() || isAppInstalled()) return;
    const handler = (e: Event) => {
      e.preventDefault();
      promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setInstallReady(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Show after 15s or 40% scroll
  useEffect(() => {
    if (!installReady) return;
    if (localStorage.getItem("installPromptShown") === "true") return;
    if (!isMobile() || isAppInstalled()) return;
    let shown = false;
    const showPopup = () => {
      if (!shown) {
        setShow(true);
        shown = true;
      }
    };
    const timeout = setTimeout(showPopup, 15000);
    const onScroll = () => {
      if ((window.scrollY + window.innerHeight) / document.body.scrollHeight > 0.4) {
        showPopup();
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timeout);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [installReady]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      // ...existing code...
    }
    setDeferredPrompt(null);
    setShow(false);
    localStorage.setItem("installPromptShown", "true");
    if (onComplete) onComplete();
  };

  // If not ready or already shown, render nothing
  if (!show || localStorage.getItem("installPromptShown") === "true") return null;
  if (!show || localStorage.getItem("installPromptShown") === "true" || !isMobile() || isAppInstalled()) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg z-50">
      <h3 className="font-semibold mb-2">Install OurAuto App</h3>
      <p className="text-sm text-muted-foreground mb-3">Install app for faster access & better experience.</p>
      <button
        onClick={handleInstall}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg"
      >
        Install Now
      </button>
    </div>
  );
}
