export interface ParsedCar {
  regNo: string;
  year: number | null;
  make: string;
  model: string;
  version: string;
  fuel: string;
  color: string;
  owner: string;
  insurance: string;
  km: number | null;
  price: number | null;
  images: string[];
  errors: string[];
}

export function parseCarMessage(text: string): ParsedCar {
  // Helper to extract field by label
  const get = (label: string) => {
    const regex = new RegExp(`${label}.*?:-*\\s*(.*)`, "i");
    return text.match(regex)?.[1]?.trim() || "";
  };

  // Bulletproof price extraction: handles emoji, stars, formatting
  function extractPrice(text: string): string {
    const match = text.match(/price[^0-9]*([\d,]+)/i);
    if (!match) return "";
    return match[1].replace(/,/g, "");
  }

  // Clean and normalize mileage
  const cleanKM = (raw: string) => {
    if (!raw) return 0;
    let km = raw.replace(/[^\d]/g, "");
    return km ? Number(km) : 0;
  };

  // Insurance parsing
  const insuranceRaw = get("Insurance");
  let insurance = "NIL";
  if (/till\s*\d{1,2}\/\d{1,2}\/\d{4}/i.test(insuranceRaw)) {
    // If date is in future, set FULL
    const dateMatch = insuranceRaw.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (dateMatch) {
      const date = new Date(dateMatch[0].split("/").reverse().join("-"));
      if (date.getFullYear() > new Date().getFullYear()) insurance = "FULL";
    }
  } else if (/tp|third/i.test(insuranceRaw)) {
    insurance = "THIRD PARTY";
  } else if (/nil|expired/i.test(insuranceRaw)) {
    insurance = "NIL";
  }

  // Transmission parsing
  let transmission = "Manual";
  if (/automatic/i.test(text)) transmission = "Automatic";

  // Year detection
  let year: number | null = null;
  const regDateRaw = get("Reg. Date");
  if (regDateRaw) {
    const yearMatch = regDateRaw.match(/\d{4}/);
    if (yearMatch) year = Number(yearMatch[0]);
  } else {
    const yearRaw = get("Year");
    if (yearRaw) {
      const yearMatch = yearRaw.match(/\d{4}/);
      if (yearMatch) year = Number(yearMatch[0]);
    }
  }
  if (!year) year = null;

  // Owner parsing
  let owner = get("Owner");
  owner = owner ? owner.replace(/[^\d]/g, "") : "1";
  if (!owner) owner = "1";

  // Fuel detection
  let fuel = "";
  if (/diesel/i.test(text)) fuel = "Diesel";
  else if (/petrol/i.test(text)) fuel = "Petrol";
  else if (/cng/i.test(text)) fuel = "CNG";
  else if (/ev|electric/i.test(text)) fuel = "EV";

  // Colour parsing
  let color = get("Colour");
  color = color.replace(/[^a-zA-Z\s]/g, "").trim();
  if (color) color = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();

  // Make + Model parsing
  let make = get("Make");
  let model = get("Model");
  make = make ? make.trim().replace(/\s+/g, " ") : "";
  model = model ? model.trim().replace(/\s+/g, " ") : "";
  make = make.charAt(0).toUpperCase() + make.slice(1);
  model = model.charAt(0).toUpperCase() + model.slice(1);

  // Version parsing
  let version = get("Version");
  version = version ? version.trim() : "";

  // RegNo parsing
  let regNo = get("Reg.No");
  regNo = regNo ? regNo.trim() : "";

  // Images
  const imageUrls = text.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/gi) || [];

  // Mileage
  const kmRaw = get("K/m");
  const km = cleanKM(kmRaw);

  // Price (bulletproof extraction)
  const priceStr = extractPrice(text);
  const price = priceStr ? Number(priceStr) : null;
  console.log("Parsed price:", price);

  // Error validation
  const errors: string[] = [];
  if (year && year < 2000) errors.push("Year must be 2000 or newer");

  return {
    regNo,
    year,
    make,
    model,
    version,
    fuel,
    color,
    owner,
    insurance,
    km,
    price,
    images: imageUrls,
    errors,
  };
}
