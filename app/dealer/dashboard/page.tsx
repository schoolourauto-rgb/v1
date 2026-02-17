
import DealerDashboardClient from "./DealerDashboardClient";
import { createClient } from "@/lib/supabase/server";

export default async function DealerDashboardPage() {
  // Server-side: get user and dealer info
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div className="p-8">User not found or dealer profile not found.</div>;
  }
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, dealership_name, phone, verified, referral_code, city")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!dealer) {
    return <div className="p-8">User not found or dealer profile not found.</div>;
  }
  const { data: wallet } = await supabase
    .from("dealer_wallet")
    .select("featured_credits")
    .eq("dealer_id", dealer.id)
    .maybeSingle();
  const { data: dealerStats } = await supabase
    .from("dealers")
    .select("total_listings, hot_deals_used")
    .eq("id", dealer.id)
    .maybeSingle();

  // Fetch cars for this dealer
  const { data: carsRaw } = await supabase
    .from("cars")
    .select("id, title, price, is_active")
    .eq("dealer_id", dealer.id);
  const cars = carsRaw ?? [];

  const totalListings = dealerStats?.total_listings ?? 0;
  const hotDealsUsed = dealerStats?.hot_deals_used ?? 0;
  const featuredCredits = wallet?.featured_credits ?? 0;
  const hotDealsAvailable = Math.floor(totalListings / 10) - hotDealsUsed;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <DealerDashboardClient
          totalListings={totalListings}
          hotDealsUsed={hotDealsUsed}
          featuredCredits={featuredCredits}
          hotDealsAvailable={hotDealsAvailable}
          cars={cars}
          dealer={dealer}
          wallet={wallet}
        />
      </div>
    </div>
  );
}
