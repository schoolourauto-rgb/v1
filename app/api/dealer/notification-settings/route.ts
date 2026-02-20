
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { rateLimit } from "@/middleware/rateLimit";
import { logError } from "@/lib/logger";

  const url = new URL(req.url);
  if (req.method === "GET") {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json(apiError("Unauthorized"), { status: 401 });
      }
      const { data } = await supabase
        .from("dealers")
        .select("notification_settings")
        .eq("user_id", user.id)
        .single();
      return NextResponse.json(apiSuccess({ settings: data?.notification_settings }), { status: 200 });
    } catch (e) {
      logError("Dealer notification-settings GET error", e);
      return NextResponse.json(apiError(), { status: 500 });
    }
  }
  if (req.method === "POST") {
    // Enforce rate limit
    const rl = rateLimit(req);
    if (rl) return rl;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json(apiError("Unauthorized"), { status: 401 });
      }
      const body = await req.json();
      const { error } = await supabase
        .from("dealers")
        .update({ notification_settings: body } as Record<string, unknown>)
        .eq("user_id", user.id);
      if (error) {
        return NextResponse.json(apiError("Update failed"), { status: 500 });
      }
      return NextResponse.json(apiSuccess(true), { status: 200 });
    } catch (e) {
      logError("Dealer notification-settings POST error", e);
      return NextResponse.json(apiError(), { status: 500 });
    }
  }
  return NextResponse.json(apiError("Method Not Allowed"), { status: 405 });
}
