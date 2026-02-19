


import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { DashboardMain } from "@/components/ui/dashboard-main";
import { CarIcon, UserIcon, LeadIcon } from "@/components/ui/icon";


type Car = {
  id: string;
  status: "active" | "sold" | "pending";
  created_at: string;
  title: string;
  price: number;
  year: number;
  fuel: string;
  transmission: string;
  car_images?: { image_url: string; is_primary: boolean }[];
};
type Lead = {
  id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
  cars?: { title: string }[];
};
type Rewards = {
  total_listings: number;
  hot_deals_earned: number;
  hot_deals_used: number;
  hot_deals_available: number;
  future_ads_credit: number;
  referral_count: number;
};
type User = {
  id: string;
  user_metadata?: { name?: string };
};

export default async function DealerDashboard() {
  let user: User | null = null;
  let cars: Car[] = [];
  let leads: Lead[] = [];
  let rewards: Rewards = {
    total_listings: 0,
    hot_deals_earned: 0,
    hot_deals_used: 0,
    hot_deals_available: 0,
    future_ads_credit: 0,
    referral_count: 0,
  };
  let errorMsg = "";
  try {
    const supabase = await createClient();
    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (!supaUser) {
      return <div className="p-10 text-center text-lg">Session expired. Please login again.</div>;
    }
    user = supaUser;
    const [carsRes, leadsRes, rewardsRes] = await Promise.all([
      supabase
        .from("cars")
        .select("id, status, created_at, title, price, year, fuel, transmission, car_images(image_url, is_primary)")
        .eq("dealer_id", user.id),
      supabase
        .from("leads")
        .select(`id, name, phone, status, created_at, cars(title)`)
        .eq("dealer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      fetch("/api/dealer/rewards-dashboard", { headers: { Cookie: cookies().toString() } }).then(r => r.json()),
    ]);
    cars = carsRes.data || [];
    leads = leadsRes.data || [];
    rewards = rewardsRes?.data || rewards;
    if (carsRes.error || leadsRes.error || rewardsRes.error) {
      errorMsg = "Server error. Please try again later.";
    }
  } catch (err) {
    errorMsg = "Server error. Please try again later.";
  }

  if (errorMsg) {
    return (
      <div className="p-10 text-center text-lg">
        {errorMsg}
        <div className="mt-4">No dashboard data available.</div>
      </div>
    );
  }

  // Prepare stats, activity, and cars for DashboardMain
  const stats = [
    { icon: <CarIcon className="text-yellow-500" />, value: rewards?.total_listings ?? 0, label: "Total Listings", subtext: "All cars listed" },
    { icon: <CarIcon className="text-orange-500" />, value: rewards?.hot_deals_earned ?? 0, label: "Hot Deals Earned", subtext: "1 per 10 listings" },
    { icon: <CarIcon className="text-pink-500" />, value: rewards?.hot_deals_used ?? 0, label: "Hot Deals Used", subtext: "Activated Hot Deals" },
    { icon: <CarIcon className="text-green-500" />, value: rewards?.hot_deals_available ?? 0, label: "Available Hot Deals", subtext: "Ready to use" },
    { icon: <CarIcon className="text-blue-500" />, value: rewards?.future_ads_credit ?? 0, label: "Future Ads Credits", subtext: "Earned via referrals" },
    { icon: <UserIcon className="text-purple-500" />, value: rewards?.referral_count ?? 0, label: "Referral Count", subtext: "Dealers referred" },
  ];
  const activity = (leads || []).map((lead: Lead) => ({
    id: lead.id,
    avatar: undefined,
    name: lead.name,
    action: `enquired about ${lead.cars?.[0]?.title || "a car"}`,
    timestamp: new Date(lead.created_at).toLocaleString(),
  }));
  const carsGrid = (cars || []).map((car: Car) => ({
    id: car.id,
    image: car.car_images?.find((img: { is_primary: boolean }) => img.is_primary)?.image_url || "https://via.placeholder.com/80x60",
    title: car.title,
    price: car.price,
    status: ["active", "sold", "pending"].includes(car.status) ? car.status as "active" | "sold" | "pending" : "active",
  }));

  return (
    <DashboardMain
      name={user?.user_metadata?.name || "Dealer"}
      stats={stats}
      // chart removed for audit cleanup
      activity={activity}
      cars={carsGrid}
    />
  );
}


