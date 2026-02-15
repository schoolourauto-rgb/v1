import { createServerClient } from "@/lib/supabase/server";
import type { Dealer } from "@/types/index";

/**
 * Ensures a dealer row exists for the given user_id. If not, creates one with default values.
 * Returns the dealer row (existing or newly created).
 */
export async function onboardDealer(user_id: string): Promise<Dealer | null> {
  try {
    const supabase = await createServerClient();
    // Check for existing dealer
    const { data: dealer, error } = await supabase
      .from("dealers")
      .select("id, user_id, verified, dealership_name, phone, location, created_at")
      .eq("user_id", user_id)
      .maybeSingle();
    if (error) {
      console.error("onboardDealer fetch error", error);
      return null;
    }
    if (dealer) return dealer as Dealer;
    // Insert new dealer
    const { data: inserted, error: insertError } = await supabase
      .from("dealers")
      .insert([
        {
          user_id,
          verified: false,
          dealership_name: "",
          phone: "",
          location: "",
        },
      ])
      .select("id, user_id, verified, dealership_name, phone, location, created_at")
      .maybeSingle();
    if (insertError) {
      console.error("onboardDealer insert error", insertError);
      return null;
    }
    return inserted as Dealer;
  } catch (err) {
    console.error("onboardDealer exception", err);
    return null;
  }
}
