"use client";
import { useState } from "react";
import CarPreviewModal from "@/components/dealer/CarPreviewModal";
import { Button } from "@/components/ui/Button";

type Car = {
  id: number;
  title: string;
  price: number;
  status: "active" | "sold";
};

type NewCarInput = {
  title: string;
  price: number;
};

export default function DealerDashboard() {
  // Simulated dealer profile (replace with real fetch in production)
  const [profile, setProfile] = useState<{
    business_name: string;
    phone: string;
    city: string;
    description: string;
  }>({
    business_name: "",
    phone: "",
    city: "",
    description: "",
  });

  const [onboardingForm, setOnboardingForm] = useState({
    business_name: "",
    phone: "",
    city: "",
    description: "",
  });
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [leads] = useState([]); // Placeholder for leads
  // Placeholder car image
  const placeholderImg = "https://placehold.co/120x80?text=Car";

  // Simulated save handler (replace with real API call)
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingLoading(true);
    // Simulate save delay
    setTimeout(() => {
      setProfile({ ...onboardingForm });
      setOnboardingLoading(false);
    }, 1000);
  };

  const handlePublishCar = (newCar: NewCarInput) => {
    const formattedCar: Car = {
      id: Date.now(),
      title: newCar.title,
      price: newCar.price,
      status: "active",
    };
    setCars((prev) => [...prev, formattedCar]);
    setModalOpen(false);
  };

  // Onboarding gate: if profile incomplete, show onboarding form
  const isProfileIncomplete = !profile.business_name || !profile.phone;
  if (isProfileIncomplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30">
        <form
          className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 shadow-sm"
          onSubmit={handleOnboardingSubmit}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Complete Your Dealer Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="business_name">Business Name</label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                value={onboardingForm.business_name}
                onChange={e => setOnboardingForm(f => ({ ...f, business_name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={onboardingForm.phone}
                onChange={e => setOnboardingForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={onboardingForm.city}
                onChange={e => setOnboardingForm(f => ({ ...f, city: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={onboardingForm.description}
                onChange={e => setOnboardingForm(f => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 rounded-xl bg-primary text-primary-foreground py-2 font-semibold disabled:bg-muted-foreground"
            disabled={onboardingLoading}
          >
            {onboardingLoading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Quick Actions Bar */}
        <div className="flex flex-col gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dealer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage listings, respond to buyers, and grow your dealership.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>➕ Add Car</Button>
            <Button variant="secondary">📋 Listings</Button>
            <Button variant="secondary">✏️ Profile</Button>
            <Button variant="secondary">💬 Leads</Button>
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Total Cars</p>
            <p className="text-3xl font-bold tracking-tight">{cars.length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Active Cars</p>
            <p className="text-3xl font-bold tracking-tight">{cars.filter((c) => c.status === "active").length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm text-muted-foreground mt-1">Leads Received</p>
            <p className="text-3xl font-bold tracking-tight">{leads.length}</p>
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Listings + Leads */}
          <div className="lg:col-span-2 space-y-8">
            {/* Listings Panel */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Listings</h2>
              </div>
              <div className="border-b border-border my-4" />
              {cars.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium">Start growing your dealership</h3>
                  <p className="text-muted-foreground mt-2">Add your first listing to reach verified buyers.</p>
                  <div className="mt-6 flex justify-center">
                    <Button onClick={() => setModalOpen(true)}>
                      + Add Car
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition flex gap-4 items-center"
                    >
                      <img
                        src={placeholderImg}
                        alt="Car"
                        className="w-24 h-16 object-cover rounded-lg border border-border bg-muted"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-base">{car.title}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${car.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                            {car.status === "active" ? "Active" : "Sold"}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-sm mb-2">₹{car.price}</div>
                        <div className="flex gap-2">
                          <Button variant="secondary">Edit</Button>
                          <Button variant="outline">Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Leads Panel - 2-column chat layout */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card min-h-[500px] flex">
              {/* Chat list */}
              <div className="min-w-[280px] border-r border-border bg-muted/30 p-4 flex flex-col gap-2">
                <span className="font-semibold text-sm text-muted-foreground mb-2">Leads</span>
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <span>No leads yet.</span>
                </div>
              </div>
              {/* Conversation area */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-muted-foreground">Select a lead to view conversation.</span>
              </div>
            </div>
          </div>
          {/* Right: Profile + Guidelines */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 border-2 border-primary">
                {/* Placeholder avatar */}
                <span className="text-3xl font-bold text-muted-foreground">D</span>
              </div>
              <span className="font-semibold text-lg mb-1">{profile.business_name || "Demo Dealer"}</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 rounded px-2 py-0.5 mb-2">✔ Verified Dealer</span>
              <span className="text-muted-foreground text-sm mb-3">{profile.phone || "dealer@email.com"}</span>
              <Button variant="secondary">Edit Profile</Button>
            </div>
            {/* Guidelines Card */}
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
        {/* Bottom Utility Strip */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          Powered by OurAuto. For support, contact admin@ourauto.com
        </div>
        {modalOpen && (
          <CarPreviewModal
            onClose={() => setModalOpen(false)}
            onPublish={handlePublishCar}
          />
        )}
      </div>
    </div>
  );
}
