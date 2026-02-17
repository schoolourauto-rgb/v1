export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}


import { NextRequest, NextResponse } from "next/server";
import { parseCarMessage } from "@/lib/carParser";
import { createClient } from "@/lib/supabase/server";
import { CarInsertSchema } from "@/lib/validation/zodSchemas";
import { validateJsonRequest } from "@/lib/validation/validateRequest";
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import type { Database } from "@/lib/supabase/types";

export const POST = withErrorHandler(async (req: NextRequest) => {
  // Rate limit
  const rl = rateLimit(req);
  if (rl) return rl;

  const validation = await validateJsonRequest(req, CarInsertSchema);
  if (validation.error) return validation.response;
  const { make, model, price, ...rest } = validation.data;

  // ...existing code for CAPTCHA and further processing...

  let supabase = null;
  supabase = await createClient();

  // PATCH 2: Debug logs before returning response
  console.log("🔥 CARS API HIT");
  const { data, error } = await supabase.from("cars").select("*");
  console.log("Cars Data:", data);
  console.log("Cars Error:", error);

  // (Re-add the rest of your logic here as needed)
});
