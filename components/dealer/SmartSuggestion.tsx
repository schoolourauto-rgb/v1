
"use client";

import React from "react";
import Link from "next/link";

interface SmartSuggestionProps {
  totalListings: number;
  featuredCredits: number;
  hotDealsAvailable: number;
}

const getSuggestion = (
  totalListings: number,
  featuredCredits: number,
  hotDealsAvailable: number
): { message: string; icon: string } | null => {
  if (totalListings < 5) {
    return {
      message: "Add more listings to increase visibility.",
      icon: "📈",
    };
  }
  if (totalListings >= 10 && hotDealsAvailable > 0) {
    return {
      message: "You unlocked a Hot Deal. Boost one listing for higher reach.",
      icon: "🔥",
    };
  }
  if (featuredCredits > 0) {
    return {
      message: "You have Featured credits available. Upgrade a listing now.",
      icon: "⭐",
    };
  }
  if (totalListings >= 25) {
    return {
      message: "You're growing fast. Consider upgrading 2–3 listings for premium exposure.",
      icon: "🏆",
    };
  }
  return null;
};

const SmartSuggestion: React.FC<SmartSuggestionProps> = ({
  totalListings,
  featuredCredits,
  hotDealsAvailable,
}) => {
  const suggestion = getSuggestion(totalListings, featuredCredits, hotDealsAvailable);
  if (!suggestion) return null;

  return (
    <div
      className="w-full max-w-xl mx-auto my-4 bg-white dark:bg-neutral-900 rounded-lg border-l-4 border-yellow-400 shadow-md p-5 flex items-center gap-4 animate-fadein"
      style={{
        animation: "fadein 0.6s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <span className="text-2xl select-none" aria-hidden>{suggestion.icon}</span>
      <div className="flex-1">
        <div className="font-medium text-black dark:text-white mb-2">{suggestion.message}</div>
        <Link
          href="/dealer/cars"
          className="inline-block mt-1 px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 w-full sm:w-auto text-center"
        >
          Upgrade Listing
        </Link>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          div {
            max-width: 100%;
          }
        }
        @keyframes fadein {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSuggestion;
