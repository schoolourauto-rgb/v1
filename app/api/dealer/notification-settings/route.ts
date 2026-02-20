import { NextResponse } from "next/server";
// adminSupabase removed. Use createClient instead.
import { createClient } from "@/lib/supabase/server";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  if (req.method === "GET") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const { data } = await supabase
      .from("dealers")
      .select("notification_settings")
      .eq("user_id", user.id)
      .single();
    return new Response(JSON.stringify({ settings: data?.notification_settings }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  if (req.method === "POST") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const body = await req.json();
    const { error } = await supabase
      .from("dealers")
      .update({ notification_settings: body } as Record<string, unknown>)
      .eq("user_id", user.id);
    if (error) {
      return new Response("Update failed", { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
