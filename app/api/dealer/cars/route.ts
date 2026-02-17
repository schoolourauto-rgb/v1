
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { CarSchema } from "./carSchema";
import { requireActiveDealer } from "@/lib/auth/requireActiveDealer";


export async function POST(req: Request) {
      // --- LIMIT IMAGES PER CAR ---
      if (images.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 images allowed" },
          { status: 400 }
        );
      }
  try {
    const supabase = await createClient();
    let user, dealer;
    try {
      ({ user, dealer } = await requireActiveDealer());
    } catch (e: any) {
      if (e.message === "DEALER_SUSPENDED") {
        return NextResponse.json(
          { error: "Account suspended. Contact support." },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // 3️⃣ Parse and validate request body (FormData for image uploads)
    const formData = await req.formData();
    const dataStr = formData.get("data");
    let body: Record<string, any> = {};
    if (typeof dataStr === "string" && dataStr.length > 0) {
      try {
        body = JSON.parse(dataStr);
      } catch (e) {
        return NextResponse.json({ error: "Invalid JSON in FormData" }, { status: 400 });
      }
    }

    // Images
    const images = formData.getAll("images");
    console.log("FORM DATA RECEIVED:", { body, images });
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No body" }, { status: 400 });
    }

    // --- HARD UPLOAD VALIDATION ---
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    for (const file of images) {
      if (typeof file === "object" && "size" in file && "type" in file) {
        if (file.size > 1 * 1024 * 1024) {
          return NextResponse.json(
            { error: "Image too large (max 1MB)" },
            { status: 400 }
          );
        }
        if (!allowed.includes(file.type)) {
          return NextResponse.json(
            { error: "Invalid file type" },
            { status: 400 }
          );
        }
      }
    }

    // Extract fields from body (parsed from FormData)
    const rawData = {
      title: body.title,
      brand: body.brand,
      model: body.model,
      year: body.year,
      price: body.price,
      fuel_type: body.fuel_type,
      transmission: body.transmission,
      city: body.city,
      description: body.description,
      listingTier: body.listingTier,
    };

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
