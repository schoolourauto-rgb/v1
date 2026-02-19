
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

  try {
    const supabase = await createClient();
    const { referral_code } = await req.json();

    // Step 4: Validate session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 4: Find referrer by referral_code
    const { data: referrer } = await supabase
      .from("dealers")
      .select("*")
      .eq("referral_code", referral_code)
      .maybeSingle();
    if (!referrer) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Step 4: Prevent self-referral
    if (referrer.user_id === user.id) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }

    // Step 4: Prevent duplicate referral (assume a referrals table or similar, else skip)
    // For now, check if user already has a referrer
    const { data: alreadyReferred } = await supabase
      .from("dealers")
      .select("referrer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (alreadyReferred && alreadyReferred.referrer_id) {
      return NextResponse.json({ error: "Already referred" }, { status: 400 });
    }

    // Step 4: Increment featured_ads_credit safely
    const { error: updateError } = await supabase
      .from("dealers")
      .update({
        featured_ads_credit: (referrer.featured_ads_credit || 0) + 1,
      })
      .eq("id", referrer.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to update referrer" }, { status: 500 });
    }

    // Mark this user as referred (if schema allows)
    await supabase
      .from("dealers")
      .update({ referrer_id: referrer.id })
      .eq("user_id", user.id);

    // Step 4: Return structured JSON
    return NextResponse.json({ success: true, referrer_id: referrer.id });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
