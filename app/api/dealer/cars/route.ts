import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export async function POST(req: Request) {
    try {
      const supabase = await createServerClient();

    // 1️⃣ Get authenticated user
    const userRes = await supabase.auth.getUser();
    if (userRes.error || !userRes.data?.user) {
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
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 403 }
      );
    }

    // 3️⃣ Parse request body (JSON only)
    const carData = await req.json();

    if (
      !carData.title ||
      !carData.brand ||
      !carData.model ||
      !carData.year ||
      !carData.price
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceNumber = Number(carData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

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
      is_active: true, // Adjusted to match original file
    };

    const { error: insertError } = await supabase
      .from("cars")
      .insert(payload);

    if (insertError) {
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
