import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/dealer/rewards-dashboard
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get dealer row
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, total_listings, hot_deals_used, future_ads_credit")
    .eq("user_id", user.id)
    .single();
  if (!dealer) {
    return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
  }

  // Calculate Hot Deal credits
  const totalListings = dealer.total_listings || 0;
  const hotDealsUsed = dealer.hot_deals_used || 0;
  const hotDealsEarned = Math.floor(totalListings / 10);
  const hotDealsAvailable = hotDealsEarned - hotDealsUsed;

  // Referral count
  const { count: referralCount } = await supabase
    .from("dealer_referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", dealer.id);

  return NextResponse.json({
    total_listings: totalListings,
    hot_deals_earned: hotDealsEarned,
    hot_deals_used: hotDealsUsed,
    hot_deals_available: hotDealsAvailable,
    future_ads_credit: dealer.future_ads_credit || 0,
    referral_count: referralCount || 0,
  });
}
