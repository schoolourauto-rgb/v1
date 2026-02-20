
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { logError } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(apiError("Session expired. Please login again."), { status: 401 });
    }

    // Get dealer row
    let { data: dealer } = await supabase
      .from("dealers")
      .select("id, total_listings, hot_deals_used, future_ads_credit")
      .eq("user_id", user.id)
      .single();
    if (!dealer) {
      // fallback dealer object
      dealer = { id: null, total_listings: 0, hot_deals_used: 0, future_ads_credit: 0 };
    }

    // Calculate Hot Deal credits
    const totalListings = Math.max(0, dealer.total_listings || 0);
    const hotDealsUsed = Math.max(0, dealer.hot_deals_used || 0);
    const hotDealsEarned = Math.floor(totalListings / 10);
    const hotDealsAvailable = Math.max(0, hotDealsEarned - hotDealsUsed);

    // Referral count
    const { count: referralCount } = await supabase
      .from("dealer_referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", dealer.id);

    return NextResponse.json(apiSuccess({
      total_listings: totalListings,
      hot_deals_earned: hotDealsEarned,
      hot_deals_used: hotDealsUsed,
      hot_deals_available: hotDealsAvailable,
      future_ads_credit: Math.max(0, dealer.future_ads_credit || 0),
      referral_count: referralCount || 0,
    }), { status: 200 });
  } catch (err) {
    logError("Dealer rewards-dashboard error", err);
    return NextResponse.json(apiError(), { status: 500 });
  }
}
