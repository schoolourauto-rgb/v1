import { logger } from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { carSchema } from "@/lib/validation/carSchema";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: dealer } = await supabase
      .from("dealers")
      .select("id, is_suspended")
      .eq("user_id", user.id)
      .single();

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    if (dealer.is_suspended) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = carSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const images = parsed.data.images || [];
    if (images.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("cars").insert([
      {
        ...parsed.data,
        dealer_id: dealer.id,
        created_by: user.id,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    logger.error('Dealer POST error', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
