// ...existing code...
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client not configured. Check environment variables." }, { status: 500 });
  }

  // Session check
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Find dealer
  const { data: dealer } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .single();
  if (!dealer) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Parse form
  const formData = await req.formData();
  const token = formData.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing reCAPTCHA token" }, { status: 400 });
  }

  // Verify reCAPTCHA
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfiguration: reCAPTCHA secret missing" }, { status: 500 });
  }

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token as string)}`,
  });
  const verifyData = await verifyRes.json();

  // Defensive logging in dev only
  // Logging removed for production

  if (!verifyData.success) {
    return NextResponse.json({ error: "reCAPTCHA verification failed", details: verifyData }, { status: 400 });
  }

  // Strictly extract and validate required fields
  const brandRaw = formData.get("brand");
  const modelRaw = formData.get("model");
  const priceRaw = formData.get("price");
  const fuel_type = formData.get("fuel_type");
  const imageFiles = formData.getAll("images");
  const imageUrls: string[] = [];
  for (const file of imageFiles) {
    if (file instanceof File) {
      // Replace with actual upload logic
      imageUrls.push(file.name); // Temporary placeholder
    }
  }
  const useFeatured = formData.get("featured") === "on";
  let carFeatured = false;

  if (
    typeof brandRaw !== "string" ||
    typeof modelRaw !== "string" ||
    typeof priceRaw !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const brand = brandRaw.trim();
  const model = modelRaw.trim();
  const price = Number(priceRaw);

  if (!brand || !model || isNaN(price)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 }
    );
  }

  // let carFeatured = false;
  if (useFeatured) {
    // Validate wallet and decrement credit
    const { data: wallet, error: walletError } = await supabase
      .from("dealer_wallet")
      .select("featured_credits")
      .eq("dealer_id", dealer.id)
      .maybeSingle();
    if (walletError || !wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 400 });
    }
    const credits = wallet.featured_credits ?? 0;
    if (credits < 1) {
      return NextResponse.json(
        { error: "Not enough featured credits" },
        { status: 400 }
      );
    }
    // Decrement credit
    await supabase
      .from("dealer_wallet")
      .update({ featured_credits: credits - 1 })
      .eq("dealer_id", dealer.id);
    carFeatured = true;
  }

  // Insert car
  // Strictly align with Database["public"]["Tables"]["cars"]["Insert"]
  const payload: import("@/lib/supabase/types").Database["public"]["Tables"]["cars"]["Insert"] = {
    dealer_id: dealer.id,
    title: `${brand} ${model}`.trim(),
    brand,
    model,
    year: 0, // TODO: extract and validate year from formData as number
    price,
    fuel_type: typeof fuel_type === "string" ? fuel_type : null,
    transmission: null,
    city_id: null,
    description: null,
    is_active: true,
    created_at: new Date().toISOString(),
    km_driven: null,
    // add other optional fields as needed
  };
  const { data: insertedCar, error } = await supabase
    .from("cars")
    .insert([payload])
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Insert images into car_images table
  if (insertedCar && imageUrls.length > 0) {
    await supabase.from("car_images").insert(
      imageUrls.map((url) => ({
        car_id: insertedCar.id,
        image_url: url,
      }))
    );
  }

  // Call handle_first_car_publish RPC (fail-safe)
  try {
    await supabase.rpc("handle_first_car_publish", { p_dealer: dealer.id });
  } catch {
    // fail-safe: ignore error
  }

  return NextResponse.redirect(new URL("/dashboard/cars", req.url));
}
