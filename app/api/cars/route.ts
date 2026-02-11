import { NextResponse } from "next/server";
import { parseCarMessage } from "@/lib/carParser";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: Request) {

  const { message, token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "CAPTCHA required" },
      { status: 400 }
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
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
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

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      { success: false, errors: parsed.errors },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // Duplicate Reg.No block
  if (parsed.regNo) {
    const { data: existing, error: findError } = await supabase
      .from('cars')
      .select('id')
      .eq('regNo', parsed.regNo)
      .maybeSingle();
    if (findError) {
      return NextResponse.json({ success: false, error: findError.message }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Car with this Reg.No already exists" },
        { status: 400 }
      );
    }
  }

  const { data: car, error } = await supabase
    .from('cars')
    .insert({
      regNo: parsed.regNo,
      year: parsed.year,
      make: parsed.make,
      model: parsed.model,
      version: parsed.version,
      fuel: parsed.fuel,
      color: parsed.color,
      owner: parsed.owner,
      insurance: parsed.insurance,
      mileage: parsed.km,
      price: parsed.price,
      images: parsed.images,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, errors: [error.message] }, { status: 500 });
  }
  return NextResponse.json({ success: true, car });
}
