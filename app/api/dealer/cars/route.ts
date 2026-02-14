import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});



export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase client not configured. Check environment variables." }, { status: 500 });
  }

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase client not configured. Check environment variables." }, { status: 500 });
  }
  try {
    const formData = await req.formData();
    const carData = JSON.parse(formData.get("data") as string);
    // Backend price validation and conversion
    const priceNumber = Number(carData.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid price format" },
        { status: 400 }
      );
    }
    const files = formData.getAll("images") as File[];

    const imageUrls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "ourauto" }, (err, result) => {
            if (err) reject(err);
            if (result) {
              imageUrls.push(result.secure_url);
              resolve(result);
            }
          })
          .end(buffer);
      });
    }

    // Insert into Supabase
    const { error } = await supabase.from("cars").insert([
      {
        ...carData,
        price: priceNumber,
        images: imageUrls,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
