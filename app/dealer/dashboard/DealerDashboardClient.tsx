"use client";
import dynamic from "next/dynamic";
import React from "react";

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
  return (
    <>
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