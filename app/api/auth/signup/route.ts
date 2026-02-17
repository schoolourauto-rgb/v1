

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils/generateReferralCode';
import { signupSchema } from '@/lib/validation/zodSchemas';

export async function POST(req: Request) {
  console.log("🔥 SIGNUP HIT");

  try {
    const contentType = req.headers.get("content-type");
    console.log("Content-Type:", contentType);

    const rawBody = await req.text();
    console.log("Raw Body:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ JSON Parse Failed:", err);
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    console.log("Parsed Body:", body);

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      console.error("❌ ZOD ERROR:", parsed.error.flatten());
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: parsed.error.flatten(),
        }),
        { status: 422 }
      );
    }

    console.log("✅ ZOD PASSED");

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
      });

    console.log("Auth Response:", authData);
    console.log("Auth Error:", authError);

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
        const { error: dealerError } = await supabase
          .from("dealers")
          .insert([
            {
              user_id: authData.user.id,
              name: parsed.data.business_name,
              phone: parsed.data.phone,
            },
          ]);

        if (dealerError) {
          console.error("Dealer Insert Error:", dealerError);
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
