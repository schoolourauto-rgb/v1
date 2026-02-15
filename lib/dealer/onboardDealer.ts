import { createClientInstance } from "@/lib/supabase/server";
import type { Dealer } from "@/types/index";

/**
 * Ensures a dealer row exists for the given user_id. If not, creates one with default values.
 * Returns the dealer row (existing or newly created).
 */
export async function onboardDealer(user_id: string): Promise<Dealer | null> {
  const supabase = createClientInstance();
  // Check for existing dealer
  const { data: dealer, error } = await supabase
    .from("dealers")
    .select("id, user_id, verified, dealership_name, phone, location, created_at")
    .eq("user_id", user_id)
    .maybeSingle();
  if (error) throw new Error(error.message);
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
  if (insertError) throw new Error(insertError.message);
  return inserted as Dealer;
}
