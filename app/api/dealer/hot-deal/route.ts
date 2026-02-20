
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { rateLimit } from "@/middleware/rateLimit";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Enforce rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(apiError("Session expired. Please login again."), { status: 401 });
    }

    const { car_id } = await req.json();
    if (!car_id) {
      return NextResponse.json(apiError("Missing car_id"), { status: 400 });
    }

    // Get dealer row
    let { data: dealer } = await supabase
      .from("dealers")
      .select("id, total_listings, hot_deals_used")
      .eq("user_id", user.id)
      .single();
    if (!dealer) {
      dealer = { id: null, total_listings: 0, hot_deals_used: 0 };
    }

    // Calculate available hot deal credits
    const totalListings = Math.max(0, dealer.total_listings || 0);
    const hotDealsUsed = Math.max(0, dealer.hot_deals_used || 0);
    const available = Math.max(0, Math.floor(totalListings / 10) - hotDealsUsed);
    if (available < 1) {
      return NextResponse.json(apiError("No Hot Deal credits available"), { status: 403 });
    }

    // Set car as featured for 3 days
    const featuredUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const { error: carError } = await supabase
      .from("cars")
      .update({ is_featured: true, featured_until: featuredUntil })
      .eq("id", car_id)
      .eq("dealer_id", dealer.id);
    if (carError) {
      return NextResponse.json({ success: false, error: "Failed to update car" }, { status: 500 });
    }

    // Increment used hot deals
    const { error: updateError } = await supabase
      .from("dealers")
      .update({ hot_deals_used: hotDealsUsed + 1 })
      .eq("id", dealer.id);
    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update dealer hot deals" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { featured_until: featuredUntil } });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error. Please try again later." }, { status: 500 });
  }
}
