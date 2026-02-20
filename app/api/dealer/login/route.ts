// app/api/dealer/login/route.ts



import { createClient } from "@/lib/supabase/server";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { rateLimit } from "@/middleware/rateLimit";
import { logError } from "@/lib/logger";

  // Enforce rate limit
  const rl = rateLimit(req);
  if (rl) return rl;
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(apiError("Invalid JSON"), { status: 400 });
  }

  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json(apiError("Email and password required"), { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json(apiError("Login failed. Please check your credentials."), { status: 401 });
    }
    return NextResponse.json(apiSuccess(true), { status: 200 });
  } catch (e) {
    logError("Dealer login error", e);
    return NextResponse.json(apiError(), { status: 500 });
  }
}
