

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers"

export default async function DealerDashboard() {
  const supabase = await createClient();

  // 1️⃣ Get Logged In User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  // 2️⃣ Fetch Dealer Cars
  const { data: cars, error: carsError } = await supabase
    .from("cars")
    .select("id, status, created_at")
    .eq("dealer_id", user.id)

  // 3️⃣ Fetch Dealer Leads (Join car title)
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      phone,
      status,
      created_at,
      cars(title)
    `)
    .eq("dealer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  if (carsError || leadsError) {
    return <div>Error loading dashboard data</div>
  }

  // 4️⃣ Calculate Stats
  const totalCars = cars?.length || 0
  const activeCars =
    cars?.filter((car) => car.status === "active").length || 0
  const soldCars =
    cars?.filter((car) => car.status === "sold").length || 0
  const totalLeads = leads?.length || 0

  return (
    <div className="space-y-8">
      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Cars" value={totalCars} />
        <StatCard title="Active Cars" value={activeCars} />
        <StatCard title="Sold Cars" value={soldCars} />
        <StatCard title="Recent Leads" value={totalLeads} />
      </div>

      {/* RECENT LEADS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>

        {leads && leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-gray-500">
                    {lead.cars?.[0]?.title || "Car"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {lead.phone}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    lead.status === "new"
                      ? "bg-blue-100 text-blue-600"
                      : lead.status === "contacted"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No leads yet.</p>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
