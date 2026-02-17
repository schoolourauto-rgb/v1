import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CarInsertSchema } from "@/lib/validation/zodSchemas";
import { validateJsonRequest } from "@/lib/validation/validateRequest";
import { rateLimit } from "@/middleware/rateLimit";
import { withErrorHandler } from "@/lib/api/withErrorHandler";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const rl = rateLimit(req);
  if (rl) return rl;

  const validation = await validateJsonRequest(req, CarInsertSchema);
  if (validation.error) return validation.response;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .insert([validation.data])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
});
