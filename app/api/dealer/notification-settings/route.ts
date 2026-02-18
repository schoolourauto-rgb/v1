
import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await adminSupabase
    .from("dealers")
    .select("notification_settings")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ settings: data?.notification_settings });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  await adminSupabase
    .from("dealers")
    .update({ notification_settings: body })
    .eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
