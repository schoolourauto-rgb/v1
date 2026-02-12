

"use client";

import { useState, useEffect } from "react";
import CarPreviewModal from "@/components/dealer/CarPreviewModal";
import LeadsPanel from "./components/LeadsPanel";
import ProfilePanel from "./components/ProfilePanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DealerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cars, setCars] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setDealerId(user.id);
      setLoading(true);
      const [{ data: carsData }, { data: profileData }] = await Promise.all([
        supabase.from("cars").select("*").eq("dealer_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);
      setCars(carsData || []);
      setProfile(profileData || {});
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleProfileSave(data: any) {
    if (!dealerId) return;
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.from("profiles").update(data).eq("id", dealerId);
    setProfile({ ...profile, ...data });
  }

  // Welcome Section
  function WelcomeSection() {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
        <p className="text-sm text-muted-foreground">Manage your listings and profile here.</p>
        <div className="mt-4">
          <Button className="rounded-xl" onClick={() => setModalOpen(true)}>
            + Add New Car
          </Button>
        </div>
      </div>
    );
  }

  // My Listings Section
  function MyListingsSection() {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Skeleton />
        </div>
      );
    }
    if (!cars || cars.length === 0) {
      return (
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-2m0 0l7-7 7 7M5 11v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
          <h3 className="text-2xl font-semibold mb-1">No listings yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start by adding your first car listing to reach buyers.</p>
          <Button className="rounded-xl" onClick={() => setModalOpen(true)}>
            Add Your First Car
          </Button>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow duration-200">
              <img src={car.image_url || "/placeholder.png"} alt={car.title} className="w-full h-40 object-cover rounded-xl mb-2" />
              <div className="text-base font-medium truncate">{car.title || `${car.make} ${car.model}`}</div>
              <div className="text-base font-semibold">₹{car.price?.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground">{car.year} • {car.fuel_type || car.fuel} • {car.transmission || "Manual"}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-xl font-medium ${car.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{car.status === "active" ? "Active" : "Sold"}</span>
                <Button className="rounded-xl px-3 py-1 text-xs h-7" variant="secondary">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Leads Section
  function LeadsSection() {
    return (
      <div className="space-y-2 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Buyer Leads</h2>
        <LeadsPanel dealerId={dealerId || ""} />
      </div>
    );
  }

  // Profile Section
  function ProfileSection() {
    return (
      <div className="space-y-2 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
        <ProfilePanel profile={profile} onSave={handleProfileSave} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <WelcomeSection />
        <MyListingsSection />
        <LeadsSection />
        <ProfileSection />
      </div>
      <CarPreviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-card text-foreground px-6 py-3 rounded-xl shadow-lg font-semibold animate-in fade-in duration-300">
          Car published successfully!
        </div>
      )}
    </div>
  );
}


