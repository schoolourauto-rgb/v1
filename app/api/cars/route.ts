import { NextResponse } from "next/server";
import { parseCarMessage } from "@/lib/carParser";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const { message } = await req.json();

  const parsed = parseCarMessage(message);

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      { success: false, errors: parsed.errors },
      { status: 400 }
    );
  }

  const supabase = createClient();
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
