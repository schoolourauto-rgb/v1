import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest,
  context: { params: { carId: string } }
) {
  const { carId } = context.params;
  const supabase = await createClient();

  // Auth: require dealer
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find car and dealer
  const { data: car, error: carError } = await supabase
    .from("cars")
    .select("id, dealer_id")
    .eq("id", carId)
    .single();
  if (carError || !car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  // Only allow dealer who owns the car
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!dealer || dealer.id !== car.dealer_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete car row
  const { error: deleteError } = await supabase
    .from("cars")
    .delete()
    .eq("id", carId);
  if (deleteError) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // Delete images from storage
  await supabase.storage
    .from("car-images")
    .remove([`${dealer.id}/${carId}`]);

  return NextResponse.json({ success: true });
}
