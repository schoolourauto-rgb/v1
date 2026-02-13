// Extensible filter parser for SEO routes
export interface ParsedFilters {
  brand?: string;
  model?: string;
  city?: string;
  maxPrice?: number;
  fuel?: string;
  transmission?: string;
  year?: number;
}

export function parseFilters(filters: string[] | undefined): ParsedFilters {
  const result: ParsedFilters = {};
  if (!filters) return result;

  let i = 0;
  while (i < filters.length) {
    const val = filters[i]?.toLowerCase();
    if (!val) { i++; continue; }
    if (val === "city" && filters[i + 1]) {
      result.city = filters[i + 1];
      i += 2;
      continue;
    }
    if (val === "budget" && filters[i + 1]) {
      const raw = filters[i + 1];
      if (raw.startsWith("under-")) {
        const num = Number(raw.replace("under-", "").replace("-lakh", ""));
        if (!isNaN(num)) result.maxPrice = num * 100000;
      }
      i += 2;
      continue;
    }
    if (["petrol","diesel","electric","hybrid","cng","lpg"].includes(val)) {
      result.fuel = val;
      i++;
      continue;
    }
    if (["automatic","manual"].includes(val)) {
      result.transmission = val;
      i++;
      continue;
    }
    if (/^\d{4}$/.test(val)) {
      result.year = Number(val);
      i++;
      continue;
    }
    // Assume first is brand, second is model
    if (!result.brand) {
      result.brand = val;
      i++;
      continue;
    }
    if (!result.model) {
      result.model = val;
      i++;
      continue;
    }
    i++;
  }
  return result;
}
