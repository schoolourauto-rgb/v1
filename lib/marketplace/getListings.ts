

// Tier system structure:
// hot > featured > simple
// Future monetization must modify tierWeight only.
// Do not modify priorityScore.
// Listing ranking system:
// priorityScore = freshness
// qualityScore = completeness
// activeDealer = engagement signal
// Future paid logic must adjust finalScore only.
// Do not directly sort by updated_at in UI layers.

import { createClient } from "@/lib/supabase/server";
import { Car } from "@/types/car";

interface GetListingsParams {
  filters?: Record<string, any>;
  from: number;
  to: number;
}

export interface MarketplaceListing extends Car {
  image: string;
  location: string;
  updated_at?: string;
  created_at?: string;
  dealer_id: string;
  dealer_name?: string;
  // Monetization-ready placeholders
  priorityScore: number;
  isFeatured: boolean;
  isHotDeal: boolean;
  boostLevel: number;
  // 3-tier system
  listingTier: "hot" | "featured" | "simple";
  // Quality system
  qualityScore: number;
  activeDealer: boolean;
  finalScore: number;
}

export async function getListings({ filters = {}, from, to }: GetListingsParams): Promise<{ listings: MarketplaceListing[]; count: number; error: any }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("cars")
      .select("id, title, brand, model, year, price, fuel_type, transmission, city, car_images(image_url), updated_at, created_at, dealer_id", { count: "exact" })
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (filters.brand) query = query.ilike("brand", filters.brand);
    if (filters.model) query = query.ilike("model", filters.model);
    if (filters.city) query = query.ilike("city", filters.city);
    if (filters.maxPrice) query = query.lte("price", filters.maxPrice);
    if (filters.fuel) query = query.ilike("fuel_type", filters.fuel);
    if (filters.transmission) query = query.ilike("transmission", filters.transmission);
    if (filters.year) query = query.eq("year", filters.year);

    const { data, count, error } = await query;
    if (error) {
      return { listings: [], count: 0, error: false };
    }

    // --- PART 2: Dealer activity signal ---
    // Collect dealer_id set
    const dealerIds = Array.from(new Set((data ?? []).map((row: any) => row.dealer_id).filter(Boolean)));
    let dealerListingCounts: Record<string, number> = {};
    if (dealerIds.length > 0) {
      // Lightweight: count listings per dealer in one query
      const { data: dealerCounts } = await supabase
        .from("cars")
        .select("dealer_id, count:id")
        .eq("status", "active")
        .in("dealer_id", dealerIds);
      if (dealerCounts) {
        for (const row of dealerCounts) {
          if (row.dealer_id) dealerListingCounts[row.dealer_id] = row.count;
        }
      }
    }

    // Compute priorityScore, qualityScore, activeDealer, finalScore, and placeholders
    let listings: MarketplaceListing[] = (data ?? []).map((row: any) => {
      // --- PART 1: Listing quality score ---
      let qualityScore = 0;
      if ((row.car_images as { image_url: string }[] | undefined)?.[0]?.image_url) qualityScore += 1;
      if (row.price) qualityScore += 1;
      if (row.city) qualityScore += 1;
      if (row.transmission) qualityScore += 1;
      if (row.fuel_type) qualityScore += 1;

      // --- PART 2: Dealer activity signal ---
      const dealerId = row.dealer_id ?? '';
      const activeDealer = dealerId && dealerListingCounts[dealerId] >= 5;

      // --- PART 1: 3-tier system (internal only) ---
      // Default: all simple
      let listingTier: "hot" | "featured" | "simple" = "simple";
      let isFeatured = false;
      let isHotDeal = false;
      let tierWeight = 0;

      // --- DEV MODE: Simulate tier assignment ---
      if (process.env.NODE_ENV === "development") {
        // Will assign after mapping
      }

      // --- PART 2: Priority score update ---
      const priorityScore = row.updated_at ? new Date(row.updated_at).getTime() : 0;
      // tierWeight will be set after
      let finalScore = priorityScore;

      return {
        id: row.id,
        title: row.title,
        brand: row.brand,
        dealer_id: dealerId,
        dealer_name: row.dealer_name ?? '',
        model: row.model,
        year: row.year,
        fuel: row.fuel_type,
        price: row.price,
        transmission: row.transmission,
        city: row.city ?? '',
        image: (row.car_images as { image_url: string }[] | undefined)?.[0]?.image_url ?? "/logo.png",
        location: row.city ?? "Unknown",
        updated_at: row.updated_at,
        created_at: row.created_at,
        // Monetization-ready fields
        priorityScore,
        isFeatured,
        isHotDeal,
        boostLevel: 0,
        // 3-tier system
        listingTier,
        // Quality system
        qualityScore,
        activeDealer,
        finalScore,
      };
    });

    // --- DEV MODE: Simulate tier assignment and ordering ---
    if (process.env.NODE_ENV === "development") {
      // Assign tiers: first 1 hot, next 2 featured, rest simple
      listings = listings.map((listing, idx) => {
        let listingTier: "hot" | "featured" | "simple" = "simple";
        let isFeatured = false;
        let isHotDeal = false;
        let tierWeight = 0;
        if (idx === 0) {
          listingTier = "hot";
          isHotDeal = true;
          tierWeight = 1000000;
        } else if (idx === 1 || idx === 2) {
          listingTier = "featured";
          isFeatured = true;
          tierWeight = 500000;
        }
        // else simple
        return {
          ...listing,
          listingTier,
          isFeatured,
          isHotDeal,
          finalScore: tierWeight + listing.priorityScore,
        };
      });
      // Resort after tier assignment
      listings.sort((a, b) => {
        if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
        if (b.created_at && a.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
    }

    // Final sort: finalScore DESC, created_at DESC (future ready)
    listings.sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      if (b.created_at && a.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return { listings, count: typeof count === "number" ? count : 0, error: false };
  } catch (error) {
    console.error("Marketplace fetch error:", error);
    return { listings: [], count: 0, error: false };
  }
}
