"use client";
import dynamic from "next/dynamic";
import React from "react";
import InsightsPanel from "./components/InsightsPanel";
import NotificationSettings from "./components/NotificationSettings";
import NotificationCenterPanel from "./components/NotificationCenterPanel";

const MomentumLayer = dynamic(() => import("@/components/dealer/MomentumLayer").then(m => m.MomentumLayer));
const SmartSuggestion = dynamic(() => import("@/components/dealer/SmartSuggestion"));


interface Props {
  totalListings: number;
  hotDealsUsed: number;
  featuredCredits: number;
  hotDealsAvailable: number;
  cars: any[];
  dealer: any;
  wallet: any;
}

export default function DealerDashboardClient({
  totalListings,
  hotDealsUsed,
  featuredCredits,
  hotDealsAvailable,
  cars,
  dealer,
  wallet,
}: Props) {
  // Gamified trust score logic
  let status = '';
  if (dealer?.trust_score >= 90) status = 'Elite Dealer';
  else if (dealer?.trust_score >= 70) status = 'Verified Dealer';
  else if (dealer?.trust_score >= 40) status = 'Active Dealer';
  else status = 'At Risk';

  // Example insights (replace with real logic)
  const insights = [
    dealer?.city ? `🔥 Your cars are trending in ${dealer.city}` : null,
    totalListings < 5 ? '📸 Add more cars to increase visibility' : null,
    status === 'Elite Dealer' ? '🏆 You are a top dealer in your city!' : null,
  ].filter(Boolean);

  return (
    <>
      <NotificationCenterPanel />
      <InsightsPanel insights={insights} />
      <NotificationSettings />
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl text-white mb-6">
        <h3 className="font-bold">Trust Score: {dealer?.trust_score ?? 0} / 100</h3>
        <div className="w-full bg-neutral-800 rounded-full h-3 my-2">
          <div
            className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${dealer?.trust_score ?? 0}%` }}
          />
        </div>
        <div className="mt-1 font-semibold">{status}</div>
        <div className="text-xs mt-1">
          Next badge at {dealer?.trust_score >= 90 ? '🏆 Max badge unlocked!' : `${dealer?.trust_score >= 70 ? 90 : 70}`}
        </div>
      </div>
      <MomentumLayer
        totalListings={totalListings}
        hotDealsUsed={hotDealsUsed}
        featuredCredits={featuredCredits}
      />
      <SmartSuggestion
        totalListings={totalListings}
        featuredCredits={featuredCredits}
        hotDealsAvailable={hotDealsAvailable}
      />
      {/* Render listings and dealer info here as needed */}
    </>
  );
}