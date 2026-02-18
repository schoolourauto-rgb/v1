export function generateSmartSuggestions(query: string) {
  const suggestions = []

  if (query.includes("under")) {
    suggestions.push("Under ₹5 lakh")
  }

  if (query.toLowerCase().includes("suv")) {
    suggestions.push("Top rated SUVs")
  }

  suggestions.push("Trending in your city")

  return suggestions
}
