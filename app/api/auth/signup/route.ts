

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { signupSchema } from '@/lib/validation/zodSchemas';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");

    const rawBody = await req.text();

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: parsed.error.flatten(),
        }),
        { status: 422 }
      );
    }

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
      });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
      });
    }

    console.log("User ID:", authData.user?.id);

    // --- INSERT DEALER PROFILE AFTER AUTH SIGNUP ---
    const userId = authData.user?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User creation failed" }),
        { status: 400 }
      );
    }

    // 🔥 INSERT INTO DEALERS TABLE
    if (authData.user) {
      // Generate referral code
      const referralCode = crypto.randomUUID().slice(0, 8);
      const { error: dealerError } = await supabase
        .from("dealers")
        .insert([
          {
            user_id: authData.user.id,
            name: parsed.data.business_name,
            phone: parsed.data.phone,
            referral_code: referralCode,
            trust_score: 100
          },
        ]);

      if (dealerError) {
        console.error("Dealer Insert Error:", dealerError);
      }

      // Referral trust boost (by referral code)
      if (parsed.data.ref) {
        // Fetch current trust_score and featured_ads_credit
        const { data: refDealer, error: refFetchError } = await supabase
          .from("dealers")
          .select("trust_score, featured_ads_credit")
          .eq("referral_code", parsed.data.ref)
          .single();

        if (!refFetchError && refDealer) {
          const newTrustScore = (refDealer.trust_score || 0) + 5;
          const newFeaturedAdsCredit = (refDealer.featured_ads_credit || 0) + 1;
          await supabase
            .from("dealers")
            .update({
              trust_score: newTrustScore,
              featured_ads_credit: newFeaturedAdsCredit
            })
            .eq("referral_code", parsed.data.ref);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("💥 SIGNUP CRASH:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
