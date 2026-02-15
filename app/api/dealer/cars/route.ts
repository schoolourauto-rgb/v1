
import { NextRequest, NextResponse } from "next/server";
import { createClientInstance } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

  const supabase = createClientInstance();
  // Get user from cookie (Supabase JWT)
  const cookieStore = cookies();
  const anon = createClientInstance();
  const { data: { user } } = await anon.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // Find dealer by user_id
  const { data: dealer, error: dealerError } = await supabase
    .from("dealers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (dealerError || !dealer) {
    return NextResponse.json({ error: "Dealer not found" }, { status: 403 });
  }
  try {
    const formData = await req.formData();
    const rawData = formData.get("data");
    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    let carData: {
      title: string;
      brand: string;
      model: string;
      year: number;
      price: number;
      km_driven?: number;
      fuel_type?: string;
      transmission?: string;
      city?: string;
      description?: string;
    };
    try {
      carData = JSON.parse(rawData);
    } catch {
      return NextResponse.json({ error: "Malformed car data" }, { status: 400 });
    }
    // Validate required fields
    if (!carData.title || !carData.brand || !carData.model || !carData.year || !carData.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const priceNumber = Number(carData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
    }
    if (typeof carData.year !== "number" || carData.year < 2000) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }
    if (carData.km_driven && isNaN(Number(carData.km_driven))) {
      return NextResponse.json({ error: "Invalid km_driven" }, { status: 400 });
    }
    // Insert car
    type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
    const payload: CarInsert = {
      dealer_id: dealer.id,
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      year: carData.year,
      price: priceNumber,
      km_driven: carData.km_driven ? Number(carData.km_driven) : null,
      fuel_type: carData.fuel_type ?? null,
      transmission: carData.transmission ?? null,
      city: carData.city ?? null,
      description: carData.description ?? null,
      status: "active",
    };
    const { error: insertError } = await supabase.from("cars").insert([payload]);
    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
