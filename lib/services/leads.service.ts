// Service for leads business logic
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export class LeadsService {
  static async createLead(payload: LeadInsert) {
    const supabase = await createClient();
    // Fetch car to get dealer_id
    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("dealer_id")
      .eq("id", payload.car_id)
      .single();
    if (carError || !car) {
      throw new Error("Car not found");
    }
    // Fetch dealer to check suspension and notification settings
    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("is_suspended, notification_settings, unread_count")
      .eq("id", car.dealer_id)
      .single();
    if (dealerError || !dealer) {
      throw new Error("Dealer not found");
    }
    if (dealer.is_suspended) {
      throw new Error("Dealer unavailable");
    }
    const { error } = await supabase.from("leads").insert([payload]);
    if (error) throw new Error(error.message);

      // Increment unread_count for badge counter
      await supabase.from("dealers").update({ unread_count: (dealer.unread_count || 0) + 1 }).eq("id", car.dealer_id);

    // Push notification logic removed as part of cleanup.
    return true;
  }
    // Helper to reset unread_count for a dealer
    static async resetUnreadCount(dealerId: string) {
      const supabase = await createClient();
      await supabase.from("dealers").update({ unread_count: 0 }).eq("id", dealerId);
    }
}
