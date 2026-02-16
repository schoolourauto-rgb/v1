import { createClient } from "@/lib/supabase/client";

export async function getDealerListingEligibility(dealerId: string) {
  const supabase = createClient();

  // Featured credits from wallet
  const { data: wallet } = await supabase
    .from("dealer_wallet")
    .select("featured_credits")
    .eq("dealer_id", dealerId)
    .maybeSingle();

  // Dealer stats
  const { data: dealerStats } = await supabase
    .from("dealers")
    .select("total_listings, hot_deals_used")
    .eq("id", dealerId)
    .maybeSingle();

  const featuredEligible = (wallet?.featured_credits ?? 0) > 0;
  const totalListings = dealerStats?.total_listings ?? 0;
  const hotDealsUsed = dealerStats?.hot_deals_used ?? 0;
  const hotDealAvailable = Math.floor(totalListings / 10) - hotDealsUsed;
  const hotDealEligible = hotDealAvailable > 0;
  const nextHotDealUnlock = 10 - (totalListings % 10);

  return {
    featuredEligible,
    featuredCredits: wallet?.featured_credits ?? 0,
    hotDealEligible,
    hotDealAvailable,
    totalListings,
    nextHotDealUnlock: nextHotDealUnlock === 10 ? 0 : nextHotDealUnlock,
  };
}
