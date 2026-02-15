
import { NextResponse } from "next/server";
import { createServerClientTyped } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { CarSchema } from "./carSchema";

export async function POST(req: Request) {
    try {
      const supabase = await createServerClientTyped();

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
    const rawData = await req.json();
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
