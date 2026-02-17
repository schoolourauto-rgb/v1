"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDealerListingEligibility } from "@/lib/marketplace/getDealerListingEligibility";
import { createClient } from "@/lib/supabase/client";
import { parseCarText, StructuredFields } from "@/lib/carParser";



export default function AddCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    version: "",
    year: "",
    price: "",
    km_driven: "",
    city: "",
    fuel_type: "",
    transmission: "",
    description: "",
    listingTier: "simple",
    raw_description: "",
    formatted_description: "",
  });
  const [detectedFeatures, setDetectedFeatures] = useState<Record<string, boolean>>({});
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

  // WhatsApp smart parser on paste
  const handleDescriptionPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;
    const { structuredFields, detectedFeatures, rawText } = parseCarText(pasted);
    // Transmission business rule
    const transmissionValue =
      detectedFeatures.automatic
        ? "Automatic"
        : detectedFeatures.manual
        ? "Manual"
        : "Manual";
    setForm(prev => ({
      ...prev,
      // Headings auto-fill
      brand: structuredFields.make || prev.brand,
      model: structuredFields.model || prev.model,
      year: structuredFields.year || prev.year,
      fuel_type: structuredFields.fuel || prev.fuel_type,
      version: structuredFields.version || prev.version,
      transmission: transmissionValue,
      // Other fields
      title: structuredFields.regNo || prev.title,
      price: structuredFields.price || prev.price,
      km_driven: structuredFields.km || prev.km_driven,
      description: pasted,
      raw_description: rawText,
      formatted_description: formatDescription(structuredFields, detectedFeatures, pasted),
    }));
    setDetectedFeatures(detectedFeatures);
    // Do NOT preventDefault, allow paste
  };

  function formatDescription(fields: StructuredFields, features: Record<string, boolean>, raw: string) {
    // Example: return a formatted string for display/DB
    let out = `Reg.No: ${fields.regNo}\nYear: ${fields.year}\nMake: ${fields.make}\nModel: ${fields.model}\nVersion: ${fields.version}\nFuel: ${fields.fuel}\nColour: ${fields.colour}\nOwner: ${fields.owner}\nInsurance: ${fields.insurance}\nKM: ${fields.km}\nPrice: ${fields.price}`;
    const featureList = Object.entries(features).filter(([k, v]) => v).map(([k]) => k).join(", ");
    if (featureList) out += `\nFeatures: ${featureList}`;
    out += `\n\n${raw}`;
    return out;
  }

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
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          onPaste={handleDescriptionPaste}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        {/* Feature badges */}
        {Object.keys(detectedFeatures).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(detectedFeatures).filter(([_, v]) => v).map(([k]) => (
              <span key={k} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold border border-green-300">
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              const formatted = `\n💳 *Reg.No.* :- ${form.title}\n🗓 *Year*  :- ${form.year}\n🏭 *Make*  :- ${form.brand}\n🚘 *Model* :- ${form.model}\n🚘 *Version*:- ${form.transmission}\n⛽ *Fuel* :- ${form.fuel_type}\n🎨 *Colour*:- ${form.city}\n👤 *Owner* :- \n📃 *Insurance* :- \n🎰 *K/m.* :- ${form.km_driven}\n💵 *Price* :- ${form.price}/-\n`;
              setForm(f => ({ ...f, description: formatted }));
            }}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg mt-3"
          >
            Generate WhatsApp Format
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(form.description);
            }}
            className="ml-3 bg-gray-800 text-white px-4 py-2 rounded-lg mt-3"
          >
            Copy
          </button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-yellow-500 text-black font-semibold py-2 rounded" disabled={loading}>
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}
