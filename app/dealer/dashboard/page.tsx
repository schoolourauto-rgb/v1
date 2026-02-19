


import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { DashboardMain } from "@/components/ui/dashboard-main";
import { CarIcon, UserIcon, LeadIcon } from "@/components/ui/icon";


export default async function DealerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div className="p-10 text-center text-lg">Unauthorized</div>;

  // Fetch cars, leads, and rewards dashboard
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
  const cars = carsRes.data;
  const leads = leadsRes.data;
  const rewards = rewardsRes;
  if (carsRes.error || leadsRes.error || rewards.error) return <div className="p-10 text-center text-lg">Error loading dashboard data</div>;

  // Stats
  const totalCars = cars?.length || 0;
  const activeCars = cars?.filter((car) => car.status === "active").length || 0;
  const soldCars = cars?.filter((car) => car.status === "sold").length || 0;
  const totalLeads = leads?.length || 0;

  // Chart Data (dummy for now)
  const chartData = {
    options: {
      chart: { id: "cars-trend", toolbar: { show: false } },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
      colors: ["#facc15"],
      grid: { show: false },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      tooltip: { theme: "dark" },
    },
    series: [
      {
        name: "Total Cars",
        data: [2, 4, 6, 8, 10, totalCars],
      },
    ],
  };

  // Prepare stats, activity, and cars for DashboardMain
  const stats = [
    { icon: <CarIcon className="text-yellow-500" />, value: rewards.total_listings, label: "Total Listings", subtext: "All cars listed" },
    { icon: <CarIcon className="text-orange-500" />, value: rewards.hot_deals_earned, label: "Hot Deals Earned", subtext: "1 per 10 listings" },
    { icon: <CarIcon className="text-pink-500" />, value: rewards.hot_deals_used, label: "Hot Deals Used", subtext: "Activated Hot Deals" },
    { icon: <CarIcon className="text-green-500" />, value: rewards.hot_deals_available, label: "Available Hot Deals", subtext: "Ready to use" },
    { icon: <CarIcon className="text-blue-500" />, value: rewards.future_ads_credit, label: "Future Ads Credits", subtext: "Earned via referrals" },
    { icon: <UserIcon className="text-purple-500" />, value: rewards.referral_count, label: "Referral Count", subtext: "Dealers referred" },
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
    image: car.car_images?.find((img) => img.is_primary)?.image_url || "https://via.placeholder.com/80x60",
    title: car.title,
    price: car.price,
    status: car.status,
  }));

  return (
    <DashboardMain
      name={user.user_metadata?.name || "Dealer"}
      stats={stats}
      // chart removed for audit cleanup
      activity={activity}
      cars={carsGrid}
    />
  );
}


