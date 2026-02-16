
"use client";

import React, { useEffect, useRef, useState } from "react";

interface MomentumLayerProps {
  totalListings: number;
  hotDealsUsed: number;
  featuredCredits: number;
}

export function MomentumLayer({ totalListings, hotDealsUsed, featuredCredits }: MomentumLayerProps) {
  // Step 1: Motivation Message
  const hotDealAvailable = Math.floor(totalListings / 10) - hotDealsUsed;
  let remainingToUnlock = 10 - (totalListings % 10);
  if (remainingToUnlock === 10) remainingToUnlock = 0;

  let message = "";
  if (hotDealAvailable > 0) {
    message = "🔥 Hot Deal unlocked. Use it now.";
  } else if (remainingToUnlock === 1) {
    message = "🔥 You're 1 listing away from unlocking Hot Deal!";
  } else {
    message = `Post ${remainingToUnlock} more listings to unlock Hot Deal.`;
  }

  // Step 2: Progress Bar
  const progressPercent = (totalListings % 10) * 10;
  const [progress, setProgress] = useState(progressPercent);
  useEffect(() => {
    setProgress(progressPercent);
  }, [progressPercent]);

  // Step 3: Credit Count Animation
  const [creditAnim, setCreditAnim] = useState(false);
  const prevCredits = useRef(featuredCredits);
  useEffect(() => {
    if (prevCredits.current !== featuredCredits) {
      setCreditAnim(true);
      const timeout = setTimeout(() => setCreditAnim(false), 300);
      prevCredits.current = featuredCredits;
      return () => clearTimeout(timeout);
    }
  }, [featuredCredits]);

  // Step 4: Hot Deal Pulse
  const hotDealPulse = hotDealAvailable > 0 ? "border-yellow-400 animate-pulse" : "";

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div
        className={`rounded-lg border px-4 py-2 text-sm font-medium text-yellow-900 dark:text-yellow-100 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 shadow-sm ${hotDealPulse}`}
        style={{ minHeight: 40 }}
      >
        {message}
      </div>
      <div className="w-full max-w-xs flex items-center gap-3">
        <div className="flex flex-col items-center flex-shrink-0">
          <span
            className={`text-lg font-bold text-yellow-600 dark:text-yellow-300 transition-all duration-300 ${creditAnim ? "scale-105 opacity-80" : "scale-100 opacity-100"}`}
            style={{ transitionProperty: "transform, opacity" }}
          >
            {featuredCredits}
          </span>
          <span className="text-xs text-yellow-800 dark:text-yellow-200">Featured Credits</span>
        </div>
        <div className="flex-1">
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-700 dark:text-gray-200 text-center">
            {totalListings % 10} / 10 listings to next Hot Deal
          </div>
        </div>
      </div>
    </div>
  );
}
