import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateJsonRequest } from "@/lib/validation/validateRequest";
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { detectNumberPlate } from "../../../lib/ocr";

const MIN_CONFIDENCE = 60;

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const supabase = await createClient();

  const formData = await req.formData();

  const mainImage = formData.get("mainImage") as File | null;
  if (!mainImage) {
    return NextResponse.json(
      { error: "Main photo is required" },
      { status: 400 }
    );
  }

  // Convert to buffer
  const arrayBuffer = await mainImage.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // OCR
  const ocr = await detectNumberPlate(buffer);

  if (!ocr.plate) {
    return NextResponse.json(
      { error: "Clear front image with visible number plate required" },
      { status: 400 }
    );
  }

  if (ocr.confidence < MIN_CONFIDENCE) {
    return NextResponse.json(
      { error: "Image unclear. Please upload a sharper front image." },
      { status: 400 }
    );
  }

  // Normalize plate
  const normalizedPlate = ocr.plate.replace(/[^A-Z0-9]/g, "");

  // Duplicate check
  const { data: existing } = await supabase
    .from("cars")
    .select("id")
    .eq("plate_number", normalizedPlate)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Vehicle with this number plate already listed" },
      { status: 400 }
    );
  }

  // Upload main image
  const filePath = `main/${Date.now()}_${normalizedPlate}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("car-images")
    .upload(filePath, buffer);

  if (uploadError) {
    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("car-images")
    .getPublicUrl(filePath);

  const mainImageUrl = publicUrlData.publicUrl;

  // Insert car
  const { data: car, error: carError } = await supabase
    .from("cars")
    .insert([
      {
        plate_number: normalizedPlate,
        plate_verified: true,
        plate_confidence: ocr.confidence,
        image_ocr_text: ocr.rawText,
        main_image_url: mainImageUrl,
      },
    ])
    .select()
    .single();

  if (carError) {
    if (carError.code === "23505") {
      return NextResponse.json(
        { error: "Vehicle already listed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: carError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(car, { status: 201 });
});
