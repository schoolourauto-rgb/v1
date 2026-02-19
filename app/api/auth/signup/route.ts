
import { logger } from '@/lib/monitoring/logger';
import { rateLimit } from '@/middleware/rateLimit';


import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { signupSchema } from '@/lib/validation/zodSchemas';

export async function POST(req: Request) {
  // Rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
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
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 400,
      });
    }

    // ...existing code...

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
      // Generate unique referral code
      const referralCode = await generateReferralCode();
      const { error: dealerError, data: dealerRow } = await supabase
        .from("dealers")
        .insert([
          {
            user_id: authData.user.id,
            name: parsed.data.business_name,
            phone: parsed.data.phone,
            referral_code: referralCode,
            trust_score: 100,
            total_listings: 0,
            hot_deals_used: 0,
            future_ads_credit: 0,
          },
        ])
        .select()
        .single();

      if (dealerError || !dealerRow) {
        return new Response(JSON.stringify({ success: false, error: "Dealer creation failed" }), { status: 500 });
      }

      // Referral system
      if (parsed.data.ref) {
        // Validate referral code
        const { data: refDealer, error: refFetchError } = await supabase
          .from("dealers")
          .select("id, future_ads_credit")
          .eq("referral_code", parsed.data.ref)
          .single();
        if (refFetchError || !refDealer) {
          // Invalid referral code, ignore
        } else {
          // Check for duplicate referral (referred_id must be unique)
          const { data: existingReferral } = await supabase
            .from("dealer_referrals")
            .select("id")
            .eq("referred_id", dealerRow.id)
            .maybeSingle();
          if (!existingReferral) {
            // Insert referral row
            await supabase.from("dealer_referrals").insert([
              {
                referred_id: dealerRow.id,
                referrer_id: refDealer.id,
                reward_given: true,
              },
            ]);
            // Increase referrer's future_ads_credit by 5, never negative
            await supabase
              .from("dealers")
              .update({ future_ads_credit: Math.max(0, (refDealer.future_ads_credit || 0) + 5) })
              .eq("id", refDealer.id);
          }
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
