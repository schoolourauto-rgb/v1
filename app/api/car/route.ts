import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  // 🔒 Read form data
  const form = await req.formData();
  const token = form.get("token");

  // 🔒 CAPTCHA required
  if (!token) {
    return NextResponse.json(
      { error: "CAPTCHA required" },
      { status: 400 }
    );
  }

  // 🔒 Verify CAPTCHA
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
      { error: "CAPTCHA verification failed" },
      { status: 400 }
    );
  }

  // 📄 Extract fields
  const title = form.get("title");
  const brand = form.get("brand");
  const model = form.get("model");
  const year = form.get("year");
  const price = form.get("price");
  const fuel_type = form.get("fuel_type");
  const transmission = form.get("transmission");
  const mileage = form.get("mileage");
  const imagesRaw = form.get("images");
  const images = imagesRaw ? JSON.parse(imagesRaw as string) : [];

  // 🔐 Session check
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔍 Find dealer
  const { data: dealer } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (!dealer) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 💾 Insert car
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
      images,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/dashboard/cars", req.url));
}
