
"use client";


import ChatInput from "@/components/dealer/ChatInput";
import CarPreviewModal from "@/components/dealer/CarPreviewModal";
import DashboardWallet from "../DashboardWallet";
import { useState, useEffect } from "react";
import TERMS from "./termsContent";

export default function DealerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [parsedCar, setParsedCar] = useState<any>(null);
  const [dealerId, setDealerId] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en');

  useEffect(() => {
    // Get dealerId from local/session storage or fetch from supabase auth
    const id = window.localStorage.getItem('dealer_id');
    if (id) setDealerId(id);
    // Fetch cars for this dealer
    if (id) fetchCars(id);
  }, []);

  async function fetchCars(dealerId: string) {
    setLoading(true);
    const supabase = (await import("@/lib/supabase/client")).createClient();
    const { data } = await supabase.from("cars").select("*", { count: "exact" }).eq("dealer_id", dealerId).order("created_at", { ascending: false });
    setCars(data || []);
    setLoading(false);
  }

  async function handlePublish() {
    if (!parsedCar || !dealerId) return;
    // Insert car into cars table, apply featured credit if selected
    const supabase = (await import("@/lib/supabase/client")).createClient();
    // TODO: Add featured credit logic if needed
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
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col relative">
      {/* Header */}
      <header className="w-full py-4 px-6 flex flex-col gap-1 bg-[#141414] border-b border-[#C9A227] relative">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Welcome Dealer 👋</h1>
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded border border-yellow-400 bg-[#181818] text-yellow-300 text-sm hover:bg-yellow-50 hover:text-yellow-900 dark:hover:bg-zinc-900 transition"
              aria-label="Select language"
              type="button"
            >
              <span role="img" aria-label="Language">🌐</span> Language
            </button>
            <select
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              value={lang}
              onChange={e => setLang(e.target.value as 'en' | 'gu' | 'hi')}
              aria-label="Language selector"
            >
              <option value="en">English</option>
              <option value="gu">Gujarati</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
        {dealerId && <DashboardWallet dealerId={dealerId} />}
      </header>

      {/* Car Preview Modal */}
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

      {/* Main Content: Car Grid */}
      <main className="flex-1 px-2 md:px-6 py-4 md:py-8 max-w-4xl mx-auto w-full">
        {/* Conditional Dealer Terms Section */}
        {!loading && cars.length < 6 && (
          <section
            className="mb-8 rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-zinc-900/60 px-4 py-6 shadow max-w-2xl mx-auto overflow-x-auto"
            aria-label="Dealer Terms and Platform Guidelines"
          >
            <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mb-4">{TERMS[lang].title}</h2>
            <div className="flex flex-col gap-4">
              {TERMS[lang].sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100 mb-1">{section.heading}</h3>
                  <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                    {section.content.map((line, i) => (
                      <li key={i} className="mb-1 whitespace-pre-line">{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
        <h2 className="text-lg font-semibold text-white mb-4">Your Live Cars</h2>
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No cars listed yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cars.map((car) => (
              <div key={car.id} className="bg-[#181818] border border-[#C9A227] rounded-xl p-4 flex flex-col gap-2 shadow">
                <div className="text-lg font-bold text-yellow-400">{car.title || car.make + ' ' + car.model}</div>
                <div className="text-sm text-muted-foreground">{car.year} • {car.fuel_type || car.fuel} • {car.transmission || 'Manual'}</div>
                <div className="text-base font-semibold text-white">₹{car.price?.toLocaleString('en-IN')}</div>
                <div className="text-xs text-muted-foreground">{car.mileage || car.km} KM</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Chat-style Input Bar */}
      <div className="sticky bottom-0 left-0 w-full z-40">
        <ChatInput
          onParse={car => {
            setParsedCar(car);
            setModalOpen(true);
          }}
        />
      </div>
    </div>
  );
}


