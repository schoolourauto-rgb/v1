"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ReferralShareProps {
  referralCode: string;
}

export function ReferralShare({ referralCode }: ReferralShareProps) {
  const [copied, setCopied] = useState(false);

  // Get site URL from env or fallback
  let siteUrl = "";
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) {
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (typeof window !== "undefined") {
    siteUrl = window.location.origin;
  }
  const referralUrl = `${siteUrl}/signup?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    "Join Free Marketplace 🚗\n" +
      "Earn 5 Featured Ads FREE.\n" +
      `Use my referral link: ${referralUrl}`
  )}`;

  return (
    <section className="w-full bg-muted/60 border border-border rounded-xl p-5 flex flex-col items-center mb-4">
      <h2 className="text-lg font-semibold mb-2">Referral Program</h2>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 w-full justify-center">
        <span className="font-mono text-base tracking-widest bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded select-all text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
          {referralCode}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="px-4 py-1 text-xs"
          onClick={handleCopy}
        >
          {copied ? "Copied ✓" : "Copy Link"}
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button type="button" variant="primary" className="px-4 py-1 text-xs w-full sm:w-auto">
            Share on WhatsApp
          </Button>
        </a>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
        Invite dealers and earn 5 Featured Credits for each successful signup.
      </div>
    </section>
  );
}
