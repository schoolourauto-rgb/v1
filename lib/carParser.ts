// =============================
// NORMALIZATION ENGINE
// =============================

export interface NormalizedCar {
  brand: string | null;
  model: string | null;
  version: string | null;
  year: number | null;
  fuel_type: string | null;
  transmission: "Automatic" | "Manual";
  price: number | null;
  km_driven: number | null;
  owner: number | null;
  title: string;
  insurance_status: "Full" | "Third Party" | null;
  insurance_expiry: string | null; // ISO YYYY-MM-01 or null
}

export function normalizeStructuredData(
  structuredFields: StructuredFields,
  detectedFeatures: Record<string, boolean>,
  rawText: string
): NormalizedCar {
  // 1. PRICE CLEANING
  let price: number | null = null;
  if (structuredFields.price) {
    const cleaned = structuredFields.price.replace(/[,/\-\s]/g, "");
    const num = Number(cleaned);
    price = !isNaN(num) && num >= 10000 ? num : null;
  }

  // 2. KM CLEANING
  let km_driven: number | null = null;
  if (structuredFields.km) {
    const cleaned = structuredFields.km.replace(/[,\s]|genuine/gi, "");
    const num = Number(cleaned);
    km_driven = !isNaN(num) ? num : null;
  }

  // 3. YEAR VALIDATION
  let year: number | null = null;
  if (structuredFields.year) {
    const num = Number(structuredFields.year);
    const now = new Date().getFullYear();
    year = !isNaN(num) && num >= 1990 && num <= now ? num : null;
  }

  // 4. OWNER CONVERSION
  let owner: number | null = null;
  if (structuredFields.owner) {
    const val = structuredFields.owner.toLowerCase();
    if (/(1st|first|1)/.test(val)) owner = 1;
    else if (/(2nd|second|2)/.test(val)) owner = 2;
    else if (/(3rd|third|3)/.test(val)) owner = 3;
    else owner = null;
  }

  // 5. TRANSMISSION RULE
  let transmission: "Automatic" | "Manual" = "Manual";
  if (detectedFeatures.automatic) transmission = "Automatic";
  else if (detectedFeatures.manual) transmission = "Manual";
  // Always default to Manual if not detected

  // 6. FUEL FALLBACK
  let fuel: string | null = structuredFields.fuel || null;
  if (!fuel) {
    if (/diesel/i.test(rawText)) fuel = "Diesel";
    else if (/petrol/i.test(rawText)) fuel = "Petrol";
    else if (/cng/i.test(rawText)) fuel = "CNG";
    else if (/(ev|electric)/i.test(rawText)) fuel = "EV";
  }

  // Ensure fuel_type is properly declared before use
  const fuel_type = fuel;

  // 7. AUTO TITLE GENERATION
  const titleParts = [year, structuredFields.make, structuredFields.model, structuredFields.version, fuel_type]
    .filter(Boolean)
    .map(String);
  const title = titleParts.join(" ").replace(/\s+/g, " ").trim();

  // 8. INSURANCE RULE
  let insurance_status: "Full" | "Third Party" | null = null;
  let insurance_expiry: string | null = null;
  const ins = structuredFields.insurance.toLowerCase();
  if (/(till|valid till|upto|up to|full)/.test(ins)) {
    insurance_status = "Full";
    // Try to extract expiry date
    // MM/YYYY
    let dateMatch = ins.match(/(0?[1-9]|1[0-2])[\/\-](\d{4})/);
    if (dateMatch) {
      insurance_expiry = `${dateMatch[2]}-${dateMatch[1].padStart(2, "0")}-01`;
    } else {
      // Month YYYY
      dateMatch = ins.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[ .-]*(\d{4})/i);
      if (dateMatch) {
        const monthMap: Record<string, string> = {
          jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
          jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
        };
        const m = monthMap[dateMatch[1].slice(0,3).toLowerCase()] || "01";
        insurance_expiry = `${dateMatch[2]}-${m}-01`;
      } else {
        // YYYY
        dateMatch = ins.match(/(\d{4})/);
        if (dateMatch) {
          insurance_expiry = `${dateMatch[1]}-01-01`;
        }
      }
    }
  } else if (/third party/.test(ins)) {
    insurance_status = "Third Party";
    insurance_expiry = null;
  } else {
    insurance_status = null;
    insurance_expiry = null;
  }

  return {
    brand: structuredFields.make || null,
    model: structuredFields.model || null,
    version: structuredFields.version || null,
    year,
    fuel_type,
    transmission,
    price,
    km_driven,
    owner,
    title,
    insurance_status,
    insurance_expiry,
  };
}
export interface StructuredFields {
  regNo: string;
  year: string;
  make: string;
  model: string;
  version: string;
  fuel: string;
  colour: string;
  owner: string;
  insurance: string;
  km: string;
  price: string;
}

export type FeatureMap = Record<string, string[]>;

export interface ParseCarTextResult {
  structuredFields: StructuredFields;
  detectedFeatures: Record<string, boolean>;
  rawText: string;
}

const featureKeywords: FeatureMap = {
  sunroof: ["sunroof", "sun roof"],
  automatic: ["automatic", "auto gear"],
  manual: ["manual"],
  petrol: ["petrol"],
  diesel: ["diesel"],
  cng: ["cng"],
  ev: ["ev", "electric"],
  alloy: ["alloy", "alloy wheels"],
  leather: ["leather seat", "leather"],
  pushStart: ["push start", "start stop button"],
  abs: ["abs"],
  airbags: ["airbag", "air bags"],
};

const fieldPatterns: Record<keyof StructuredFields, RegExp[]> = {
  regNo: [/(reg(\.|istration)?\s*no\s*[:-]?\s*)([a-z0-9-]+)/i],
  year: [/year\s*[:-]?\s*(\d{4})/i],
  make: [/(make\s*[:-]?\s*|🏭\s*)([a-z0-9 ]+)/i],
  model: [/(model\s*[:-]?\s*|🚘\s*)([a-z0-9 ]+)/i],
  version: [/(version\s*[:-]?\s*|variant\s*[:-]?\s*)([a-z0-9 ]+)/i],
  fuel: [/(fuel\s*[:-]?\s*|⛽\s*)([a-z0-9 ]+)/i],
  colour: [/(colou?r\s*[:-]?\s*|🎨\s*)([a-z0-9 ]+)/i],
  owner: [/(owner\s*[:-]?\s*|👤\s*)([a-z0-9 ]+)/i],
  insurance: [/(insurance\s*[:-]?\s*|📃\s*)([a-z0-9 ()\/\-]+)/i],
  km: [/([kK]m|kilometers?|🎰|km driven)\s*[:-]?\s*([\d,. ]+)/i],
  price: [/(price\s*[:-]?\s*|💵\s*)([\d,.\/\-]+)/i],
};

function extractField(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Return last group if exists, else first
      return match[match.length - 1].toString().trim();
    }
  }
  return "";
}

export function parseCarText(text: string): ParseCarTextResult {
  const lower = text.toLowerCase();
  const structuredFields: StructuredFields = {
    regNo: extractField(text, fieldPatterns.regNo),
    year: extractField(text, fieldPatterns.year),
    make: extractField(text, fieldPatterns.make),
    model: extractField(text, fieldPatterns.model),
    version: extractField(text, fieldPatterns.version),
    fuel: extractField(text, fieldPatterns.fuel),
    colour: extractField(text, fieldPatterns.colour),
    owner: extractField(text, fieldPatterns.owner),
    insurance: extractField(text, fieldPatterns.insurance),
    km: extractField(text, fieldPatterns.km),
    price: extractField(text, fieldPatterns.price),
  };

  // Feature detection
  const detectedFeatures: Record<string, boolean> = {};
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    detectedFeatures[feature] = keywords.some((kw) => lower.includes(kw));
  }

  return {
    structuredFields,
    detectedFeatures,
    rawText: text,
  };


  // No color field in DB, skip color parsing

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

  // Price (strict extraction)
  const priceStr = extractPrice(text);
  const price = priceStr ? Number(priceStr) : null;

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
    owner,
    insurance,
    km,
    price,
    images: imageUrls,
    errors,
  };
}
