


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




import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { DashboardMain } from "@/components/ui/dashboard-main";
import { CarIcon, UserIcon } from "@/components/ui/icon";
import { redirect } from "next/navigation";



export default async function DealerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Step 2: Safe session handling
    return redirect("/auth/login");
  }

  // Step 1: Always use user_id for dealer lookup
  const { data: dealer } = await supabase
    .from("dealers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Step 3: Safe dashboard fallback
  const safeDealer = dealer ?? {
    referral_code: "",
    total_listings: 0,
    hot_deal_credit: 0,
    featured_ads_credit: 0,
    trust_score: 0,
    total_leads: 0,
  };

  // Fetch cars and leads using dealer.id if exists, else empty
  let cars: Car[] = []; // Using imported Car type
  let leads: Lead[] = []; // Using imported Lead type
  if (dealer) {
    const [carsRes, leadsRes] = await Promise.all([
      supabase
        .from("cars")
        .select("id, status, created_at, title, price, year, fuel, transmission, car_images(image_url, is_primary)")
        .eq("dealer_id", dealer.id),
      supabase
        .from("leads")
        .select(`id, name, phone, status, created_at, cars(title)`)
        .eq("dealer_id", dealer.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    cars = Array.isArray(carsRes?.data) ? carsRes.data : [];
    leads = Array.isArray(leadsRes?.data) ? leadsRes.data : [];
  }

  // Prepare stats, activity, and cars for DashboardMain
  const stats = [
    { icon: <CarIcon className="text-yellow-500" />, value: safeDealer?.total_listings ?? 0, label: "Total Listings", subtext: "All cars listed" },
    { icon: <CarIcon className="text-orange-500" />, value: safeDealer?.hot_deal_credit ?? 0, label: "Hot Deals Credit", subtext: "Earned credits" },
    { icon: <CarIcon className="text-blue-500" />, value: safeDealer?.featured_ads_credit ?? 0, label: "Featured Ads Credit", subtext: "Earned via referrals" },
    { icon: <UserIcon className="text-purple-500" />, value: safeDealer?.trust_score ?? 0, label: "Trust Score", subtext: "Dealer trust" },
    { icon: <UserIcon className="text-green-500" />, value: safeDealer?.total_leads ?? 0, label: "Total Leads", subtext: "All leads" },
  ];
  const activity = (leads || []).map((lead) => ({
    id: lead.id,
    avatar: undefined,
    name: lead.name,
    action: `enquired about ${lead.cars?.[0]?.title || "a car"}`,
    timestamp: new Date(lead.created_at).toLocaleString(),
  }));
  const carsGrid = (cars || []).map((car) => ({
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
      activity={activity}
      cars={carsGrid}
    />
  );
}


