
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code required" },
        { status: 400 }
      );
    }

    const { data: referrer } = await supabase
      .from("dealers")
      .select("id, user_id, featured_ads_credit")
      .eq("referral_code", code)
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 400 }
      );
    }

    if (referrer.user_id === user.id) {
      return NextResponse.json(
        { error: "Cannot refer yourself" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("dealers")
      .update({
        featured_ads_credit:
          (referrer.featured_ads_credit ?? 0) + 1,
      })
      .eq("id", referrer.id);

    if (error) {
      return NextResponse.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
