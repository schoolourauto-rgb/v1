
"use client";

import ChatInput from "@/components/dealer/ChatInput";
import CarPreviewModal from "@/components/dealer/CarPreviewModal";
import DashboardWallet from "../DashboardWallet";
import { useState, useEffect } from "react";

export default function DealerDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [parsedCar, setParsedCar] = useState(null);
  const [dealerId, setDealerId] = useState<string | null>(null);

  useEffect(() => {
    // Get dealerId from local/session storage or fetch from supabase auth
    const id = window.localStorage.getItem('dealer_id');
    if (id) setDealerId(id);
    // In production, fetch from supabase if not found
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between bg-[#141414] border-b border-[#C9A227]">
        <h1 className="text-xl font-bold text-white">Dealer Dashboard</h1>
      </header>

      {/* Wallet & Referral UI */}
      {dealerId && <DashboardWallet dealerId={dealerId} />}

      {/* Car Preview Modal */}
      <CarPreviewModal
        open={modalOpen}
        parsedCar={parsedCar}
        onClose={() => setModalOpen(false)}
        onPublish={() => {/* ...publish logic... */}}
      />

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        {/* Car list grid here */}
      </main>

      {/* Bottom Chat Input */}
      <ChatInput
        onParse={car => {
          setParsedCar(car);
          setModalOpen(true);
        }}
      />
    </div>
  );
}


