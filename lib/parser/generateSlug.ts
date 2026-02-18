// lib/parser/generateSlug.ts
import { CarData } from "./types";

export function generateSlug(data: CarData): string {
  const parts = [
    data.year,
    data.make,
    data.model,
    data.variant,
    data.fuel,
    data.transmission,
  ];
  return parts
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
