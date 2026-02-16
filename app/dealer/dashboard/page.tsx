
export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/supabase/getServerUser";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Car {
  id: string;
  title: string;
  price: number;
  is_active?: boolean | null;
}

export default async function DealerDashboard() {
  const user = await getServerUser();
  if (!user) {
    return <div className="p-8">User not found.</div>;
  }
  const supabase = await createClient();
  // Fetch dealer
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, dealership_name, phone, verified")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!dealer) {
    return <div className="p-8">Dealer profile not found.</div>;
  }
  // Fetch cars
  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, price, is_active")
    .eq("dealer_id", dealer.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dealer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage listings, respond to buyers, and grow your dealership.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dealer/add-car">
              <Button>Add New Car</Button>
            </Link>
            <Link
              href="/dealer/leads"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted transition"
            >
              {/* Icon placeholder */}
              <span className="font-bold">L</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Total Cars</p>
            <p className="text-3xl font-bold tracking-tight">{cars?.length ?? 0}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Active Cars</p>
            <p className="text-3xl font-bold tracking-tight">{cars?.length ?? 0}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Leads Received</p>
            <p className="text-3xl font-bold tracking-tight">0</p>
          </div>
        </div>
        {/* Dealer Incentive Structure (UI Only) */}
        <div className="w-full mb-4">
          <div className="rounded-lg bg-muted/60 border border-border px-4 py-2 text-xs text-muted-foreground text-center" style={{fontWeight: 400}}>
            Recently updated listings appear higher in marketplace.
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Listings</h2>
              </div>
              <div className="border-b border-border my-4" />
              {!cars || cars.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium">Start growing your dealership</h3>
                  <p className="text-muted-foreground mt-2">Add your first listing to reach verified buyers.</p>
                  <div className="mt-6 flex justify-center">
                    <Link href="/dealer/add-car">
                      <Button>Add Car</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition flex gap-4 items-center"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-base">{car.title}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${car.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {car.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-sm mb-2">₹{car.price}</div>
                        <div className="flex gap-2">
                          <Button variant="secondary">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Leads Panel placeholder */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card min-h-[500px] flex">
              <div className="min-w-[280px] border-r border-border bg-muted/30 p-4 flex flex-col gap-2">
                <span className="font-semibold text-sm text-muted-foreground mb-2">Leads</span>
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <span>No leads yet.</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-muted-foreground">Select a lead to view conversation.</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 border-2 border-primary">
                <span className="text-3xl font-bold text-muted-foreground">D</span>
              </div>
              <span className="font-semibold text-lg mb-1">{dealer.dealership_name || "Demo Dealer"}</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 rounded px-2 py-0.5 mb-2">{dealer.verified ? "✔ Verified Dealer" : "Unverified"}</span>
              <span className="text-muted-foreground text-sm mb-3">{dealer.phone || "dealer@email.com"}</span>
              <Button variant="secondary">Edit Profile</Button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all duration-200">
              <h3 className="font-semibold mb-3">Guidelines</h3>
              <div className="space-y-2">
                <details className="group">
                  <summary className="cursor-pointer font-medium">Listing Rules</summary>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-2">
                    <li>No duplicate listings</li>
                    <li>Accurate details required</li>
                    <li>Clear, real photos only</li>
                  </ul>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium">Response Guidelines</summary>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-2">
                    <li>Respond within 24 hours</li>
                    <li>Be polite and professional</li>
                  </ul>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium">Image Requirements</summary>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-2">
                    <li>At least 3 photos per car</li>
                    <li>No watermarks or overlays</li>
                  </ul>
                </details>
                <details className="group">
                  <summary className="cursor-pointer font-medium">Buyer Communication</summary>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-2">
                    <li>Use in-app chat for all deals</li>
                    <li>Never share personal payment info</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-muted-foreground">
          Powered by OurAuto. For support, contact admin@ourauto.com
        </div>
      </div>
    </div>
  );
}
