


import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { DashboardMain } from "@/components/ui/dashboard-main";
import { CarIcon, UserIcon, LeadIcon } from "@/components/ui/icon";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default async function DealerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <div className="p-10 text-center text-lg">Unauthorized</div>;

  // Fetch cars and leads
  const { data: cars, error: carsError } = await supabase
    .from("cars")
    .select("id, status, created_at, title, price, year, fuel, transmission, car_images(image_url, is_primary)")
    .eq("dealer_id", user.id);
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select(`id, name, phone, status, created_at, cars(title)`)
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);
  if (carsError || leadsError) return <div className="p-10 text-center text-lg">Error loading dashboard data</div>;

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
    { icon: <CarIcon className="text-yellow-500" />, value: totalCars, label: "Total Cars", subtext: "All cars listed" },
    { icon: <CarIcon className="text-green-500" />, value: activeCars, label: "Active Cars", subtext: "Currently live" },
    { icon: <CarIcon className="text-gray-400" />, value: soldCars, label: "Sold Cars", subtext: "Marked as sold" },
    { icon: <LeadIcon className="text-blue-500" />, value: totalLeads, label: "Leads", subtext: "Recent leads" },
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
      chart={<Chart options={chartData.options} series={chartData.series} type="line" height={140} width="100%" />}
      activity={activity}
      cars={carsGrid}
    />
  );
}


