import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/dealer/hot-deal
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { car_id } = await req.json();
  if (!car_id) {
    return NextResponse.json({ error: "Missing car_id" }, { status: 400 });
  }

  // Get dealer row
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, total_listings, hot_deals_used")
    .eq("user_id", user.id)
    .single();
  if (!dealer) {
    return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
  }

  // Calculate available hot deal credits
  const totalListings = dealer.total_listings || 0;
  const hotDealsUsed = dealer.hot_deals_used || 0;
  const available = Math.floor(totalListings / 10) - hotDealsUsed;
  if (available < 1) {
    return NextResponse.json({ error: "No Hot Deal credits available" }, { status: 403 });
  }

  // Set car as featured for 3 days
  const featuredUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const { error: carError } = await supabase
    .from("cars")
    .update({ is_featured: true, featured_until: featuredUntil })
    .eq("id", car_id)
    .eq("dealer_id", dealer.id);
  if (carError) {
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }

  // Increment used hot deals
  const { error: updateError } = await supabase
    .from("dealers")
    .update({ hot_deals_used: hotDealsUsed + 1 })
    .eq("id", dealer.id);
  if (updateError) {
    return NextResponse.json({ error: "Failed to update dealer hot deals" }, { status: 500 });
  }

  return NextResponse.json({ success: true, featured_until: featuredUntil });
}
