import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireDealer() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, business_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!dealer) {
    redirect("/onboarding");
  }

  return { supabase, user, dealer };
}
