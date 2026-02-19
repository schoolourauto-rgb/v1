import { logger } from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { carSchema } from "@/lib/validation/carSchema";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dealer } = await supabase
      .from("dealers")
      .select("id, is_suspended, total_listings")
      .eq("user_id", user.id)
      .single();

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    if (dealer.is_suspended) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = carSchema.safeParse(body);

    // --- Main logic ---
    const { raw_message, parsed_data, image_urls } = body;

    // Normalize fields
    const car = {
      ...parsed_data,
      transmission: parsed_data.transmission === "auto" || parsed_data.transmission === "automatic" ? "Automatic" : "Manual",
      price: typeof parsed_data.price === "string" ? parseInt(parsed_data.price.replace(/[^\d]/g, ""), 10) : Number(parsed_data.price),
      km: typeof parsed_data.km === "string" ? parseInt(parsed_data.km.replace(/[^\d]/g, ""), 10) : Number(parsed_data.km),
      reg_no: typeof parsed_data.reg_no === "string" ? parsed_data.reg_no.replace(/-/g, "").toUpperCase() : undefined,
    };

    // Validate required fields
    const required = ["year", "make", "model", "price", "km"];
    for (const field of required) {
      if (!car[field])
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
    if (!image_urls || !Array.isArray(image_urls) || image_urls.length < 1)
      return NextResponse.json({ error: "At least one image required" }, { status: 400 });
    if (image_urls.length > 10)
      return NextResponse.json({ error: "Maximum 10 images allowed" }, { status: 400 });

    // Generate slug
    const slug = `${car.year}-${car.make}-${car.model}-${user.id.slice(0, 6)}`;

    // Check duplicate reg_no for same dealer
    if (car.reg_no) {
      const { data: existing, error: dupErr } = await supabase
        .from("cars")
        .select("id")
        .eq("dealer_id", user.id)
        .eq("reg_no", car.reg_no);
      if (dupErr) return NextResponse.json({ error: "DB error" }, { status: 500 });
      if (existing && existing.length > 0)
        return NextResponse.json({ error: "Duplicate registration number" }, { status: 409 });
    }

    // Ensure dealer row exists (should already, but double check)
    let dealerRow = dealer;
    if (!dealerRow) {
      const { data: newDealer, error: dealerInsertError } = await supabase
        .from("dealers")
        .insert([
          {
            user_id: user.id,
            total_listings: 0,
            // Add other required fields as needed
          },
        ])
        .select()
        .single();
      if (dealerInsertError || !newDealer) {
        return NextResponse.json({ error: "Failed to create dealer row" }, { status: 500 });
      }
      dealerRow = newDealer;
    }

    // Insert into cars table
    const { error: insertError } = await supabase.from("cars").insert([
      {
        ...car,
        dealer_id: dealerRow.id,
        images: image_urls,
        slug,
        created_at: new Date().toISOString(),
        raw_message,
      },
    ]);
    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 });

    // Increment total_listings by 1 (server-side only)
    const { error: updateError } = await supabase
      .from("dealers")
      .update({ total_listings: (dealerRow.total_listings || 0) + 1 })
      .eq("id", dealerRow.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to update dealer listings" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}
