
import { NextRequest, NextResponse } from "next/server";
import { parseCarMessage } from "@/lib/carParser";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];

export async function POST(req: NextRequest) {

  const { message, token } = await req.json();


  if (!token) {
    return NextResponse.json(
      { success: false, error: "CAPTCHA required" },
      { status: 400 }
    );
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }


  // Google reCAPTCHA verification
  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret}&response=${token}`,
    }
  );
  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return NextResponse.json(
      { success: false, error: "CAPTCHA verification failed" },
      { status: 400 }
    );
  }

  const parsed = parseCarMessage(message);

  // Basic required validation
  if (!parsed.make || !parsed.model || !parsed.price) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  let supabase = null;
  try {
    supabase = await createClient();
    const payload: CarInsert = {
      dealer_id: null,
      title: `${parsed.make} ${parsed.model} ${parsed.year ?? ""}`.trim(),
      brand: parsed.make,
      model: parsed.model,
      year: parsed.year ?? 0,
      price: parsed.price ?? 0,
      km_driven: parsed.km ?? null,
      fuel_type: parsed.fuel ?? null,
      transmission: null,
      city_id: null,
      description: null,
      is_active: true,
    };
    const { data: car, error } = await supabase
      .from("cars")
      .insert([payload])
      .select()
      .single();
    if (error) {
      return NextResponse.json(
        { success: false, errors: [error.message] },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, car });
  } catch (err) {
    console.error("API /cars error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
