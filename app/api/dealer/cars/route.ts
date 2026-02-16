
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { CarSchema } from "./carSchema";

export async function POST(req: Request) {
    try {
      const supabase = await createClient();

      // 1️⃣ Get authenticated user
      const userRes = await supabase.auth.getUser();
      if (userRes.error || !userRes.data?.user) {
        console.warn("AUTH FAIL /dealer/cars POST", userRes.error);
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }
      const user = userRes.data.user;

      // 2️⃣ Find dealer
      const { data: dealer, error: dealerError } = await supabase
        .from("dealers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (dealerError || !dealer) {
        console.warn("DEALER NOT FOUND /dealer/cars POST", dealerError);
        return NextResponse.json(
          { error: "Dealer not found" },
          { status: 403 }
        );
      }



    // 3️⃣ Parse and validate request body (JSON only)
    let rawData: any;
    try {
      // Support both JSON and multipart/form-data
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        rawData = await req.json();
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        rawData = JSON.parse(formData.get("data") as string);
      } else {
        return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parseResult = CarSchema.safeParse({
      ...rawData,
      year: Number(rawData.year),
      price: Number(rawData.price),
    });
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const carData = parseResult.data;
    const priceNumber = carData.price;

    // --- Dynamic listing tier logic ---
    const listingTier = rawData.listingTier || "simple";

    type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];

    const payload: CarInsert = {
      dealer_id: dealer.id,
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      year: Number(carData.year),
      price: priceNumber,
      fuel_type: carData.fuel_type ?? null,
      transmission: carData.transmission ?? null,
      city: carData.city ?? null,
      description: carData.description ?? null,
      is_active: true,
      // Optionally, you can store tier info if needed for analytics
      // listing_tier: listingTier,
    };

    // --- Featured/Hot Deal/Normal logic ---
    if (listingTier === "featured") {
      // Check and deduct featured_ads_credit
      const { data: dealerCredits, error: creditError } = await supabase
        .from("dealers")
        .select("featured_ads_credit")
        .eq("id", dealer.id)
        .single();
      if (creditError || !dealerCredits || dealerCredits.featured_ads_credit <= 0) {
        return NextResponse.json({ error: "No featured credits available." }, { status: 400 });
      }
      // Deduct credit
      const { error: updateError } = await supabase
        .from("dealers")
        .update({ featured_ads_credit: dealerCredits.featured_ads_credit - 1 })
        .eq("id", dealer.id);
      if (updateError) {
        return NextResponse.json({ error: "Failed to deduct featured credit." }, { status: 500 });
      }
    } else if (listingTier === "hot") {
      // Check hot deal availability
      const { data: dealerStats, error: statsError } = await supabase
        .from("dealers")
        .select("total_listings, hot_deals_used")
        .eq("id", dealer.id)
        .single();
      if (statsError || !dealerStats) {
        return NextResponse.json({ error: "Dealer stats unavailable." }, { status: 500 });
      }
      const availableHotDeals = Math.floor((dealerStats.total_listings || 0) / 10) - (dealerStats.hot_deals_used || 0);
      if (availableHotDeals <= 0) {
        return NextResponse.json({ error: "You need 10 listings to unlock Hot Deal." }, { status: 400 });
      }
      // Increment hot_deals_used
      const { error: updateError } = await supabase
        .from("dealers")
        .update({ hot_deals_used: (dealerStats.hot_deals_used || 0) + 1 })
        .eq("id", dealer.id);
      if (updateError) {
        return NextResponse.json({ error: "Failed to use Hot Deal credit." }, { status: 500 });
      }
    } else {
      // Normal listing: increment total_listings atomically via RPC
      const { error: incrementError } = await supabase.rpc(
        "increment_total_listings",
        { dealer_id: dealer.id }
      );
      if (incrementError) {
        console.error("Failed to increment total_listings:", incrementError);
      }
    }

    // Insert car listing
    const { error: insertError } = await supabase
      .from("cars")
      .insert(payload);

    if (insertError) {
      // Log RLS or insert errors
      console.error("INSERT FAIL /dealer/cars POST", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("API /dealer/cars error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
