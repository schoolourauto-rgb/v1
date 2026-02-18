// parseSmartCarDetails.ts
// Utility to parse car details from WhatsApp-style text

export function parseSmartCarDetails(text: string) {
  // Remove emojis, markdown, extra symbols
  let clean = text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\*\_\~\`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Parse fields
  const year = (clean.match(/\b(20\d{2}|19\d{2})\b/) || [""])[0];
  const make = (clean.match(/\b(Maruti|Hyundai|Tata|Honda|Toyota|Kia|Mahindra|Ford|Volkswagen|Renault|Skoda|MG|Jeep|Nissan|Audi|BMW|Mercedes|Jaguar|Land Rover|Porsche|Lexus|Volvo|Fiat|Chevrolet|Datsun|Isuzu|Mini|Mitsubishi|Peugeot|SsangYong|Tesla)\b/i) || [""])[0];
  const model = (clean.match(/\b(?:[A-Z][a-z]+)\s?(?:[A-Z0-9]+)?\b/) || [""])[0];
  const version = (clean.match(/\b(?:ZX|ZDI|VXI|VDI|LXI|Sport|Alpha|Plus|AMT|Automatic|Manual|Diesel|Petrol|Turbo|Top|Base|Premium|Limited|S|SX|EX|GT|GLS|GL|XZA|XMA|XUV|XUV500|XUV700|XUV300|XUV400|Titanium|Trend|Ambiente|Style|Comfort|Elegance|Luxury|Signature|Adventure|Anniversary|Edition)\b/i) || [""])[0];
  let price = (clean.match(/(?:₹|Rs\.?|INR)?\s*([0-9]{5,8}(?:,[0-9]{2,3})*)\s*(?:\/\-|\/-)?/i) || [""])[1] || "";
  price = price.replace(/,/g, "").replace(/\/-/g, "").replace(/[^0-9]/g, "");
  const km = (clean.match(/([0-9]{1,7})\s*(?:km|kilometers|kms)/i) || [""])[1] || "";
  const fuel = (clean.match(/\b(Petrol|Diesel|CNG|Electric|Hybrid)\b/i) || [""])[0];
  const transmission = (clean.match(/\b(Automatic|Manual|AMT|CVT|DSG|iMT)\b/i) || [""])[0];
  const owner = (clean.match(/\b(1st|2nd|3rd|4th|first|second|third|fourth)\s*owner\b/i) || [""])[0];

  // Title
  let title = "";
  if (year && make && model) {
    title = `${year} ${make} ${model} ${version ? version : ""}`.trim();
  }

  // Slug
  let slug = "";
  if (title) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  // Description
  let description = "";
  if (title && price) {
    description = `${title} for sale. ${km ? km + " km driven. " : ""}${fuel ? fuel + ", " : ""}${transmission ? transmission + ", " : ""}${owner ? owner + ". " : ""}Price ₹${price}.`;
  }

  // Confidence score
  let confidence = 0;
  if (year) confidence += 15;
  if (make) confidence += 15;
  if (model) confidence += 15;
  if (price) confidence += 15;
  if (fuel) confidence += 10;
  if (transmission) confidence += 10;
  if (km) confidence += 10;
  if (owner) confidence += 10;
  if (confidence > 100) confidence = 100;

  return {
    year,
    make,
    model,
    version,
    price,
    km,
    fuel,
    transmission,
    owner,
    title,
    slug,
    description,
    confidence,
  };
}
