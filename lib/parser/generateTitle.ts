// lib/parser/generateTitle.ts
import { CarData } from "./types";

export function generateTitle(data: CarData): string {
  const parts = [
    data.year,
    data.make,
    data.model,
    data.variant,
    data.fuel,
    data.transmission,
  ];
  const title = parts.filter(Boolean).join(" ");
  return title || "Car Listing";
}
