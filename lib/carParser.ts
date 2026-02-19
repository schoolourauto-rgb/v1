/**
 * WhatsApp-style car details parser for auto-fill engine.
 * Strictly follows MASTER STABILIZATION PROMPT requirements.
 */

type CarInput = {
  year?: number;
  make?: string;
  model?: string;
  version?: string;
  transmission?: string;
  fuel?: string;
  colour?: string;
  owner?: string;
  insurance?: string;
  km?: number;
  price?: number;
  regNo?: string;
  images?: string[];
  description?: string;
  title?: string;
};

type CarParseResult =
  | { success: true; data: CarInput }
  | { success: false; errors: Record<string, string> };

const transmissionRegex = /(auto|automatic|amt|dct|cvt)/i;
const priceRegex = /([\d,]+)\s*\/?-?/i;
const kmRegex = /([\d,]+)\s*(km|k\/m|kilometers|kms|genuine)?/i;
const regNoRegex = /([a-zA-Z]{2,3}-?\d{1,4})/;

/**
 * Parse WhatsApp-style car details input.
 * @param inputText Raw input string
 * @param images Array of image URLs/paths (required for validation)
 */
export function parseCarInput(inputText: string, images: string[] = []): CarParseResult {
  const lines = inputText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const car: CarInput = { images };
  let descriptionLines: string[] = [];
  const errors: Record<string, string> = {};

  for (const line of lines) {
    // Reg.No.
    if (/reg\.no/i.test(line)) {
      const match = line.match(/[A-Za-z0-9-]+/g);
      if (match) {
        car.regNo = match[match.length - 1].replace(/-/g, '').toUpperCase();
      }
      continue;
    }
    // Year
    if (/year/i.test(line)) {
      const match = line.match(/\d{4}/);
      if (match) car.year = parseInt(match[0], 10);
      continue;
    }
    // Make
    if (/make/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.make = match;
      continue;
    }
    // Model
    if (/model/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.model = match;
      continue;
    }
    // Version
    if (/version/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.version = match;
      continue;
    }
    // Transmission
    if (/transmission/i.test(line)) {
      car.transmission = transmissionRegex.test(line) ? 'Automatic' : 'Manual';
      continue;
    }
    // Fuel
    if (/fuel/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.fuel = match;
      continue;
    }
    // Colour
    if (/colou?r/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.colour = match;
      continue;
    }
    // Owner
    if (/owner/i.test(line)) {
      const match = line.split(/[:-]/).pop()?.trim();
      if (match) car.owner = match;
      continue;
    }
    // Insurance
    if (/insurance/i.test(line)) {
      let val = line.split(/[:-]/).pop()?.trim() || '';
      if (/full/i.test(val)) val = 'Full Insurance';
      else if (/tp/i.test(val)) val = 'Third Party';
      else if (/till\s*\d{1,2}\/\d{1,2}/i.test(val)) val = `Insurance till ${val.match(/\d{1,2}\/\d{1,2}/)![0]}`;
      car.insurance = val;
      continue;
    }
    // K/m.
    if (/k\/m|km|kilometers|kms/i.test(line)) {
      const match = line.replace(/,/g, '').match(/\d{1,7}/);
      if (match) car.km = parseInt(match[0], 10);
      continue;
    }
    // Price
    if (/price|amount|rs\.?/i.test(line)) {
      let val = line.replace(/,/g, '').replace(/\/-/g, '').replace(/[^\d]/g, '');
      if (val) car.price = parseInt(val, 10);
      continue;
    }
    // Unmapped lines
    descriptionLines.push(line);
  }

  // Title auto-generate
  if (car.year && car.make && car.model) {
    car.title = `${car.year} ${car.make} ${car.model}`;
    if (car.version) car.title += ` ${car.version}`;
    if (car.transmission) car.title += ` ${car.transmission}`;
  }

  // Validation
  if (!car.year) errors.year = 'Year is required.';
  if (!car.make) errors.make = 'Make is required.';
  if (!car.model) errors.model = 'Model is required.';
  if (!car.price) errors.price = 'Price is required.';
  if (!car.km) errors.km = 'KM is required.';
  if (!car.images || car.images.length === 0) errors.images = 'At least 1 image is required.';

  // Description
  if (descriptionLines.length) {
    car.description = descriptionLines.join('\n');
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  return { success: true, data: car };
}// =============================
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
    rawText: text
  };
}
