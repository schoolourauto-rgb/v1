"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function RewardsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/referral/stats`, {
          cache: 'no-store',
          headers: { Cookie: '' },
        });
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data);
        }
      } catch (e) {
        setError('Failed to load stats.');
      }
    };
    fetchStats();
  }, []);
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  if (!stats) {
    return <div className="p-8">Loading...</div>;
  }
  const progress = ((stats.total_listings % 10) / 10) * 100;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const referralLink = `${siteUrl}/signup?ref=${stats.referral_code}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };
  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent('Join me on OurAuto! ' + referralLink)}`);
  };
  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on OurAuto!')}`);
  };
  return (
    <div className="max-w-2xl mx-auto p-6 grid gap-8 bg-[var(--card)] rounded-2xl shadow-modern mt-10">
      <h2 className="text-3xl font-bold mb-2 text-[var(--text)]">Rewards & Credits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col items-center bg-transparent rounded-2xl p-6 shadow-none border border-[var(--border)]">
          <span className="text-xs opacity-60 mb-1">Referral Link</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-wider bg-[var(--background)] px-2 py-1 rounded-2xl border border-[var(--border)] break-all max-w-[160px]">{referralLink}</span>
            <Button className="btn-secondary px-2 py-1 text-xs ml-2" style={{ minWidth: 40 }} onClick={handleCopy}>Copy</Button>
            <Button className="btn-secondary px-2 py-1 text-xs" style={{ minWidth: 40 }} onClick={handleWhatsApp}>WhatsApp</Button>
            <Button className="btn-secondary px-2 py-1 text-xs" style={{ minWidth: 40 }} onClick={handleTelegram}>Telegram</Button>
          </div>
          <span className="text-xs opacity-60 mt-1">Share your referral link to earn rewards!</span>
        </div>
        <div className="flex flex-col items-center bg-transparent rounded-2xl p-6 shadow-none border border-[var(--border)]">
          <span className="text-xs opacity-60 mb-1">Total Referrals</span>
          <span className="text-3xl font-bold text-[var(--text)]">{stats.total_referrals}</span>
        </div>
        <div className="flex flex-col items-center bg-transparent rounded-2xl p-6 shadow-none border border-[var(--border)]">
          <span className="text-xs opacity-60 mb-1">Future Ad Credits</span>
          <span className="text-3xl font-bold text-[var(--text)]">{stats.future_ad_credits}</span>
        </div>
        <div className="flex flex-col items-center bg-transparent rounded-2xl p-6 shadow-none border border-[var(--border)]">
          <span className="text-xs opacity-60 mb-1">Hot Deal Credits</span>
          <span className="text-3xl font-bold text-[var(--text)]">{stats.hot_deal_credits}</span>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="h-2 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden">
          <div className="h-full bg-yellow-400 dark:bg-yellow-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
          <span>0</span>
          <span>10 Listings = 1 Credit</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
