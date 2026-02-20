
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Session expired. Please login again." }, { status: 401 });
    }
    let { data: dealer } = await supabase
      .from("dealers")
      .select("id, is_suspended, total_listings")
      .eq("user_id", user.id)
      .single();
    if (!dealer) {
      const { data: newDealer, error: dealerInsertError } = await supabase
        .from("dealers")
        .insert([{ user_id: user.id, total_listings: 0 }])
        .select()
        .single();
      if (dealerInsertError || !newDealer) {
        return NextResponse.json({ success: false, error: "Failed to create dealer row" }, { status: 500 });
      }
      dealer = newDealer;
    }
    if (!dealer || dealer.is_suspended) {
      return NextResponse.json({ success: false, error: "Account suspended" }, { status: 403 });
    }
    const body = await req.json();
    const { raw_message, parsed_data, image_urls } = body;
    const car = {
      ...parsed_data,
      transmission: parsed_data?.transmission === "auto" || parsed_data?.transmission === "automatic" ? "Automatic" : "Manual",
      price: typeof parsed_data?.price === "string" ? parseInt(parsed_data.price.replace(/[^\d]/g, ""), 10) : Number(parsed_data?.price),
      km: typeof parsed_data?.km === "string" ? parseInt(parsed_data.km.replace(/[^\d]/g, ""), 10) : Number(parsed_data?.km),
      reg_no: typeof parsed_data?.reg_no === "string" ? parsed_data.reg_no.replace(/-/g, "").toUpperCase() : undefined,
    };
    const required = ["year", "make", "model", "price", "km"];
    for (const field of required) {
      if (!car[field])
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 });
    }
    if (!image_urls || !Array.isArray(image_urls) || image_urls.length < 1)
      return NextResponse.json({ success: false, error: "At least one image required" }, { status: 400 });
    if (image_urls.length > 10)
      return NextResponse.json({ success: false, error: "Maximum 10 images allowed" }, { status: 400 });
    const slug = `${car.year}-${car.make}-${car.model}-${user.id.slice(0, 6)}`;
    if (car.reg_no && dealer) {
      const { data: existing, error: dupErr } = await supabase
        .from("cars")
        .select("id")
        .eq("dealer_id", dealer.id)
        .eq("reg_no", car.reg_no);
      if (dupErr) return NextResponse.json({ success: false, error: "DB error" }, { status: 500 });
      if (existing && existing.length > 0)
        return NextResponse.json({ success: false, error: "Duplicate registration number" }, { status: 409 });
    }
    if (dealer) {
      const { error: insertError } = await supabase.from("cars").insert([
        {
          ...car,
          dealer_id: dealer.id,
          images: image_urls,
          slug,
          created_at: new Date().toISOString(),
          raw_message,
        },
      ]);
      if (insertError)
        return NextResponse.json({ success: false, error: "Failed to create car" }, { status: 500 });
      const { error: updateError } = await supabase
        .from("dealers")
        .update({ total_listings: Math.max(0, (dealer.total_listings ?? 0) + 1) })
        .eq("id", dealer.id);
      if (updateError) {
        return NextResponse.json({ success: false, error: "Failed to update dealer listings" }, { status: 500 });
      }
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      return NextResponse.json({ success: false, error: "Dealer not found after creation" }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
  }
}
