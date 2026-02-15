// URL Normalization Utility for Marketplace SEO
// Lowercase, hyphenize, sort, dedupe, and canonicalize filter segments

import type { ParsedFilters } from "./parseFilters";

const FILTER_ORDER = [
  "brand",
  "model",
  "city",
  "budget",
  "fuel",
  "transmission",
];

export function normalizeFilters(filters: ParsedFilters): string[] {
  const segments: string[] = [];
  for (const key of FILTER_ORDER) {
    const value = filters[key as keyof ParsedFilters];
    if (value) {
      if (key === "city") {
        segments.push("city");
        segments.push(hyphenize(String(value)));
      } else if (key === "budget") {
        segments.push("budget");
        segments.push(hyphenize(String(value)));
      } else {
        segments.push(hyphenize(String(value)));
      }
    }
  }
  // Remove duplicates
  return Array.from(new Set(segments));
}

function hyphenize(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}
