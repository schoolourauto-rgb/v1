
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { referral_code } = await req.json();

    if (!referral_code) {
      return NextResponse.json(
        { error: "Referral code required" },
        { status: 400 }
      );
    }

    const { data: referrer } = await supabase
      .from("dealers")
      .select("*")
      .eq("referral_code", referral_code)
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

    const { error: updateError } = await supabase
      .from("dealers")
      .update({
        featured_ads_credit: (referrer.featured_ads_credit ?? 0) + 5
      })
      .eq("id", referrer.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update referrer" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
