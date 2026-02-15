import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClientInstance } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function POST(req: NextRequest) {
  const supabase = createClientInstance();

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not configured." },
      { status: 500 }
    );
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
      dealer_id: string;
      km_driven?: number;
      fuel_type?: string;
      transmission?: string;
      city_id?: string;
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
    // Only allow authenticated dealer
    const dealerId = carData.dealer_id;
    if (!dealerId) {
      return NextResponse.json({ error: "Unauthorized: dealer_id missing" }, { status: 401 });
    }
    // Validate year
    if (typeof carData.year !== "number" || carData.year < 2000) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }
    // Validate km_driven
    if (carData.km_driven && isNaN(Number(carData.km_driven))) {
      return NextResponse.json({ error: "Invalid km_driven" }, { status: 400 });
    }
    // Validate images
    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "ourauto" }, (err, result) => {
            if (err) reject(err);
            else resolve(result as { secure_url: string });
          })
          .end(buffer);
      });
      if (uploadResult?.secure_url) {
        imageUrls.push(uploadResult.secure_url);
      }
    }
    type CarInsert = Database["public"]["Tables"]["cars"]["Insert"];
    const payload: CarInsert = {
      dealer_id: dealerId,
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      year: carData.year,
      price: priceNumber,
      km_driven: carData.km_driven ? Number(carData.km_driven) : null,
      fuel_type: carData.fuel_type ?? null,
      transmission: carData.transmission ?? null,
      city_id: carData.city_id ?? null,
      description: carData.description ?? null,
      is_active: true,
      created_at: null,
    };
    const { error: insertError } = await supabase.from("cars").insert([payload]);
    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
