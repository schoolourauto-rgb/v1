import type { ParsedFilters } from "./parseFilters";

export function buildMetadata(filters: ParsedFilters) {
  const titleParts = [
    filters.brand && `Used ${capitalize(filters.brand)}`,
    filters.model && capitalize(filters.model),
    filters.city && `in ${capitalize(filters.city)}`,
    filters.fuel && capitalize(filters.fuel),
    filters.transmission && capitalize(filters.transmission),
    filters.maxPrice && `Under ₹${filters.maxPrice.toLocaleString()}`,
    filters.year && filters.year,
  ].filter(Boolean);

  const title = titleParts.length
    ? `${titleParts.join(" ")} Cars for Sale`
    : "Used Cars for Sale";

  const description = `Explore verified ${title.toLowerCase()} with transparent pricing and real inventory.`;

  return {
    title,
    description,
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
