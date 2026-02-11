import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const form = await req.formData();

  const title = form.get("title");
  const brand = form.get("brand");
  const model = form.get("model");
  const year = form.get("year");
  const price = form.get("price");
  const fuel_type = form.get("fuel_type");
  const transmission = form.get("transmission");
  const mileage = form.get("mileage");

  // TODO: Add image upload logic

  // Get dealer_id from session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.redirect("/login");

  // Find dealer_id
  const { data: dealer } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (!dealer) return NextResponse.redirect("/dashboard");

  // Insert car
  const { error } = await supabase.from("cars").insert([
    {
      dealer_id: dealer.id,
      title,
      brand,
      model,
      year,
      price,
      fuel_type,
      transmission,
      mileage,
      images: [], // TODO: handle images
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect("/dashboard/cars");
}
