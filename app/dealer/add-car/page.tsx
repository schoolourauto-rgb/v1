"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDealerListingEligibility } from "@/lib/marketplace/getDealerListingEligibility";
import { createClient } from "@/lib/supabase/client";



export default function AddCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    km_driven: "",
    city: "",
    fuel_type: "",
    transmission: "",
    description: "",
    listingTier: "simple",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<{
    featuredEligible: boolean;
    featuredCredits: number;
    hotDealEligible: boolean;
    hotDealAvailable: number;
    totalListings: number;
    nextHotDealUnlock: number;
  } | null>(null);
  const [dealerId, setDealerId] = useState<string | null>(null);

  // Fetch dealerId and eligibility on mount
  useEffect(() => {
    async function fetchEligibility() {
      const supabase = createClient();
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;
      const { data: dealer } = await supabase
        .from("dealers")
        .select("id")
        .eq("user_id", user.user.id)
        .maybeSingle();
      if (!dealer?.id) return;
      setDealerId(dealer.id);
      const result = await getDealerListingEligibility(dealer.id);
      setEligibility(result);
    }
    fetchEligibility();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validate required fields
    if (!form.title || !form.brand || !form.model || !form.year || !form.price) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    // Smart Lock: Prevent submission exploit
    if (form.listingTier === "featured" && eligibility && !eligibility.featuredEligible) {
      setForm(f => ({ ...f, listingTier: "simple" }));
      setLoading(false);
      return;
    }
    if (form.listingTier === "hot" && eligibility && !eligibility.hotDealEligible) {
      setForm(f => ({ ...f, listingTier: "simple" }));
      setLoading(false);
      return;
    }
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      km_driven: form.km_driven ? Number(form.km_driven) : undefined,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    const res = await fetch("/api/dealer/cars", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      router.push("/dealer/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add car");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- 3-TIER LISTING TYPE --- */}
        <div>
          <label className="block text-sm font-medium mb-1">Listing Type:</label>
          <div className="flex gap-4">
            {/* Simple */}
            <label className="flex flex-col items-center gap-1 text-xs">
              <input
                type="radio"
                name="listingTier"
                value="simple"
                checked={form.listingTier === "simple"}
                onChange={handleChange}
                className="accent-yellow-500"
              />
              <span className="font-medium">Simple</span>
            </label>
            {/* Featured */}
            <label
              className={`flex flex-col items-center gap-1 text-xs transition-opacity ${eligibility && !eligibility.featuredEligible ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="listingTier"
                value="featured"
                checked={form.listingTier === "featured"}
                onChange={handleChange}
                disabled={eligibility ? !eligibility.featuredEligible : true}
                className="accent-yellow-500"
              />
              <span className="font-medium">Featured</span>
              {eligibility && !eligibility.featuredEligible && (
                <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                  Invite dealers to earn 5 Featured credits.
                </span>
              )}
            </label>
            {/* Hot Deal */}
            <label
              className={`flex flex-col items-center gap-1 text-xs transition-opacity ${eligibility && !eligibility.hotDealEligible ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="listingTier"
                value="hot"
                checked={form.listingTier === "hot"}
                onChange={handleChange}
                disabled={eligibility ? !eligibility.hotDealEligible : true}
                className="accent-yellow-500"
              />
              <span className="font-medium">Hot Deal</span>
              {eligibility && !eligibility.hotDealEligible && (
                <span className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                  Post {eligibility.nextHotDealUnlock} more listings to unlock.
                </span>
              )}
            </label>
          </div>
        </div>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title*" className="w-full p-2 border rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand*" className="w-full p-2 border rounded" required />
        <input name="model" value={form.model} onChange={handleChange} placeholder="Model*" className="w-full p-2 border rounded" required />
        <input name="year" value={form.year} onChange={handleChange} placeholder="Year*" className="w-full p-2 border rounded" required type="number" min="2000" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price*" className="w-full p-2 border rounded" required type="number" min="1" />
        <input name="km_driven" value={form.km_driven} onChange={handleChange} placeholder="KM Driven" className="w-full p-2 border rounded" type="number" min="0" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
        <input name="fuel_type" value={form.fuel_type} onChange={handleChange} placeholder="Fuel Type" className="w-full p-2 border rounded" />
        <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" className="w-full p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-yellow-500 text-black font-semibold py-2 rounded" disabled={loading}>
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}
