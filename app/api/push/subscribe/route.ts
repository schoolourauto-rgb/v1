

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { rateLimit } from "@/middleware/rateLimit";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Enforce rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  try {
    const { subscription, dealerId } = await req.json();
    // Minimal input validation
    if (!subscription || typeof subscription !== "object" || !dealerId || typeof dealerId !== "string") {
      return NextResponse.json(apiError("Missing or invalid data"), { status: 400 });
    }

    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return NextResponse.json(apiError("Invalid subscription object"), { status: 400 });
    }

    const supabase = await createClient();
    await supabase.from("push_subscriptions").insert({
      dealer_id: dealerId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });
    return NextResponse.json(apiSuccess(true), { status: 200 });
  } catch (e) {
    logError("Push subscribe error", e);
    return NextResponse.json(apiError(), { status: 500 });
  }
}
