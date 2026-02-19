import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/dealer/future-ad
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Session expired. Please login again." }, { status: 401 });
    }

    const { car_id, future_date } = await req.json();
    if (!car_id || !future_date) {
      return NextResponse.json({ success: false, error: "Missing car_id or future_date" }, { status: 400 });
    }

    // Get dealer row
    let { data: dealer } = await supabase
      .from("dealers")
      .select("id, future_ads_credit")
      .eq("user_id", user.id)
      .single();
    if (!dealer) {
      dealer = { id: null, future_ads_credit: 0 };
    }

    const credits = Math.max(0, dealer.future_ads_credit || 0);
    if (credits < 1) {
      return NextResponse.json({ success: false, error: "No Future Ad credits available" }, { status: 403 });
    }

    // Set car as featured for chosen future date
    const { error: carError } = await supabase
      .from("cars")
      .update({ is_featured: true, featured_until: future_date })
      .eq("id", car_id)
      .eq("dealer_id", dealer.id);
    if (carError) {
      return NextResponse.json({ success: false, error: "Failed to update car" }, { status: 500 });
    }

    // Deduct 1 credit
    const { error: updateError } = await supabase
      .from("dealers")
      .update({ future_ads_credit: credits - 1 })
      .eq("id", dealer.id);
    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update dealer future ads" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { featured_until: future_date } });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error. Please try again later." }, { status: 500 });
  }
}
