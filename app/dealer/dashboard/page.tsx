
"use client";


import { useState, useEffect } from "react";
import CarPreviewModal from "@/components/dealer/CarPreviewModal";
import DashboardWallet from "../DashboardWallet";
import WelcomeBlock from "./components/WelcomeBlock";
import PostedCars from "./components/PostedCars";
import ProfilePanel from "./components/ProfilePanel";
import GuidelinesPanel from "./components/GuidelinesPanel";
import BottomUtilityBar from "./components/BottomUtilityBar";
import SidebarLink from "./components/SidebarLink";

export default function DealerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [parsedCar, setParsedCar] = useState<any>(null);
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cars' | 'profile' | 'guidelines'>('cars');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get dealerId from local/session storage or fetch from supabase auth
    const id = window.localStorage.getItem('dealer_id');
    if (id) setDealerId(id);
    // Fetch cars and profile for this dealer
    if (id) {
      fetchCars(id);
      fetchProfile(id);
    }
    async function fetchProfile(dealerId: string) {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", dealerId)
        .maybeSingle();
      if (!error && data) setProfile(data);
    }
  }, []);

  async function fetchCars(dealerId: string) {
    setLoading(true);
    const supabase = (await import("@/lib/supabase/client")).createClient();
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*", { count: "exact" })
        .eq("dealer_id", dealerId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Car fetch error:", error);
        setCars([]);
        setLoading(false);
        return;
      }
      setCars(data || []);
    } catch (err) {
      console.error("Unexpected error fetching cars:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSave(data: any) {
    if (!dealerId) return;
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.from("profiles").update(data).eq("id", dealerId);
    setProfile({ ...profile, ...data });
  }

  async function handlePublish() {
    if (!parsedCar || !dealerId) return;
    const supabase = (await import("@/lib/supabase/client")).createClient();
    await supabase.from("cars").insert({
      ...parsedCar,
      dealer_id: dealerId,
      status: "active",
      created_at: new Date().toISOString(),
    });
    setModalOpen(false);
    setSuccess(true);
    fetchCars(dealerId);
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="md:grid md:grid-cols-[240px_1fr] md:gap-10">
          {/* Sidebar for desktop */}
          <div className="hidden md:block sticky top-24 space-y-2">
            <SidebarLink label="Posted Cars" active={activeTab === 'cars'} onClick={() => setActiveTab('cars')} />
            <SidebarLink label="Edit Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <SidebarLink label="Guidelines" active={activeTab === 'guidelines'} onClick={() => setActiveTab('guidelines')} />
            <SidebarLink label="Leads" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
          </div>
          {/* Main content */}
          <div>
            <WelcomeBlock profile={profile} activeCars={cars.filter((c) => c.status === 'active').length} />
            <div className="mt-8">
              {activeTab === 'cars' && <PostedCars cars={cars} setAddCarOpen={setModalOpen} />}
              {activeTab === 'profile' && <ProfilePanel profile={profile} onSave={handleProfileSave} />}
              {activeTab === 'guidelines' && <GuidelinesPanel />}
              {activeTab === 'leads' && dealerId && <LeadsPanel dealerId={dealerId} />}
            </div>
          </div>
        </div>
      </div>
      <BottomUtilityBar />
      {/* Modal for car preview/publish */}
      <CarPreviewModal
        open={modalOpen}
        parsedCar={parsedCar}
        onClose={() => setModalOpen(false)}
        onPublish={handlePublish}
      />
      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#C9A227] to-[#FFD700] text-black px-6 py-3 rounded-xl shadow-lg font-semibold animate-in fade-in duration-300">
          Car published successfully!
        </div>
      )}
    </div>
  );
}


