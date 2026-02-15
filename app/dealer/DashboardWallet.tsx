"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DealerWallet, Dealer } from "@/types/dealer";

export default function DashboardWallet({ dealerId }: { dealerId: string }) {
  const [wallet, setWallet] = useState<DealerWallet | null>(null);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      const supabase = createClient();
      const { data: walletData } = await supabase
        .from("dealer_wallet")
        .select("featured_credits")
        .eq("dealer_id", dealerId)
        .maybeSingle();
      if (walletData) {
        setWallet({
          featured_credits: walletData.featured_credits ?? 0,
        });
      } else {
        setWallet(null);
      }
      const { data: dealerData } = await supabase
        .from("dealers")
        .select(`
          id,
          referral_code,
          referrals:dealers!dealers_referred_by_fkey (
            id
          )
        `)
        .eq("id", dealerId)
        .maybeSingle();
      if (dealerData) {
        setDealer({
          id: dealerData.id,
          referral_code: dealerData.referral_code ?? "",
          referrals: dealerData.referrals ?? [],
        });
      } else {
        setDealer(null);
      }
      setLoading(false);
    }
    fetchWallet();
  }, [dealerId]);

  if (loading) return <div className="py-8 text-center text-muted-foreground">Loading wallet...</div>;
  if (!wallet || !dealer) return <div className="py-8 text-center text-red-500">Wallet not found</div>;

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#232323] border border-[#C9A227] rounded-2xl p-8 mb-8 flex flex-col items-center shadow-lg">
      <div className="text-3xl font-bold text-yellow-400 mb-2">{wallet.featured_credits}</div>
      <div className="text-sm text-muted-foreground mb-4">Featured Credits</div>
      <div className="flex flex-col items-center mb-4">
        <span className="text-lg font-semibold text-white">Referral Code</span>
        <span className="text-xl font-mono text-yellow-300 bg-[#181818] px-4 py-1 rounded mt-1 tracking-widest select-all">{dealer.referral_code}</span>
      </div>
      <div className="flex flex-row gap-8 mb-2">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-white">Referrals</span>
          <span className="text-xl font-bold text-yellow-300">{dealer.referrals?.length || 0}</span>
        </div>
      </div>
    </div>
  );
}
