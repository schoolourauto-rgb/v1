// lib/parser/parseCarMessage.ts
import { CarData } from "./types";
import { normalizeCarData } from "./normalizeCarData";

export function parseCarMessage(message: string): CarData {
  // Remove emojis
  let clean = message.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
  // Remove markdown, extra symbols
  clean = clean.replace(/[\*\_\~\`]/g, "").replace(/\s+/g, " ").trim();

  // Extract fields
  const yearMatch = clean.match(/(?:Year[:\-\s]*|\b)(20\d{2}|19\d{2})\b/i);
  const year = yearMatch ? parseInt(yearMatch[1]) : undefined;

  const makeMatch = clean.match(/\b(Maruti|Hyundai|Tata|Honda|Toyota|Kia|Mahindra|Ford|Volkswagen|Renault|Skoda|MG|Jeep|Nissan|Audi|BMW|Mercedes|Jaguar|Land Rover|Porsche|Lexus|Volvo|Fiat|Chevrolet|Datsun|Isuzu|Mini|Mitsubishi|Peugeot|SsangYong|Tesla)\b/i);
  const make = makeMatch ? makeMatch[1] : undefined;

  const modelMatch = clean.match(/\b(?:Harrier|Creta|Swift|Baleno|Fortuner|Venue|Seltos|XUV700|XUV500|Thar|Scorpio|Ertiga|Alto|i20|City|Ciaz|Verna|Brezza|Sonet|Tiago|Nexon|Kwid|Duster|Rapid|Compass|Hector|Gloster|Kicks|Civic|Jazz|Ignis|EcoSport|Figo|Aspire|Polo|Vento|Octavia|Superb|Amaze|WRV|Santro|Altroz|Bolero|Bolero Neo|XUV300|XUV400|Tigor|Hexa|Safari|S-Cross|Celerio|S-Presso|Go|Redi-Go|Micra|Terrano|Sunny|Pulse|Scala|Datsun|KUV100|TUV300|Xylo|Quanto|Ritz|Dzire|Etios|Liva|Corolla|Camry|Yaris|Prius|Land Cruiser|Hilux|Innova|Crysta|Etios Cross|Avanza|Rush|Raize|Agya|Calya|Sigra|Vios|Vitz|Wigo|Yaris Cross|Urban Cruiser|Magnite|Triber|Kiger|Captur|Lodgy|Logan|Fluence|Pulse|Scala|Duster|Terrano|Sunny|Micra|Go|Redi-Go|KUV100|TUV300|Xylo|Quanto|Ritz|Dzire|Etios|Liva|Corolla|Camry|Yaris|Prius|Land Cruiser|Hilux|Innova|Crysta|Etios Cross|Avanza|Rush|Raize|Agya|Calya|Sigra|Vios|Vitz|Wigo|Yaris Cross|Urban Cruiser|Magnite|Triber|Kiger|Captur|Lodgy|Logan|Fluence|Pulse|Scala|Duster|Terrano|Sunny|Micra|Go|Redi-Go|KUV100|TUV300|Xylo|Quanto|Ritz|Dzire|Etios|Liva|Corolla|Camry|Yaris|Prius|Land Cruiser|Hilux|Innova|Crysta|Etios Cross|Avanza|Rush|Raize|Agya|Calya|Sigra|Vios|Vitz|Wigo|Yaris Cross|Urban Cruiser)\b/i);
  const model = modelMatch ? modelMatch[1] : undefined;

  const variantMatch = clean.match(/\b([A-Z0-9\+\-]+(?:\s*[A-Z0-9\+\-]+)*)\b(?=\s*(?:variant|model|version|trim|type))/i);
  const variant = variantMatch ? variantMatch[1] : undefined;

  const fuelMatch = clean.match(/\b(Petrol|Diesel|CNG|EV|Electric)\b/i);
  const fuel = fuelMatch ? (fuelMatch[1].toLowerCase() === "electric" ? "EV" : fuelMatch[1]) as CarData["fuel"] : undefined;

  const transmissionMatch = clean.match(/\b(Manual|Automatic|Auto|AMT|CVT|DSG|iMT)\b/i);
  let transmission: CarData["transmission"] | undefined = undefined;
  if (transmissionMatch) {
    const t = transmissionMatch[1].toLowerCase();
    if (["automatic", "auto", "amt", "cvt", "dsg", "imt"].includes(t)) transmission = "Automatic";
    else if (t === "manual") transmission = "Manual";
  }

  const priceMatch = clean.match(/(?:₹|Rs\.?|INR)?\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{5,8}|[0-9]{1,2}\s*lakh|[0-9]{1,2}L)\b/i);
  const priceRaw = priceMatch ? priceMatch[1] : undefined;

  const kmMatch = clean.match(/([0-9]{1,7}(?:,[0-9]{2,3})*)\s*(?:km|kilometers|kms)/i);
  const kmRaw = kmMatch ? kmMatch[1] : undefined;

  const colorMatch = clean.match(/\b(White|Black|Grey|Silver|Red|Blue|Green|Yellow|Orange|Brown|Beige|Gold|Purple|Maroon)\b/i);
  const color = colorMatch ? colorMatch[1] : undefined;

  const ownerMatch = clean.match(/\b(1st|2nd|3rd|4th|first|second|third|fourth)\s*owner\b/i);
  const owner = ownerMatch ? ownerMatch[1] : undefined;

  const insuranceMatch = clean.match(/\b(Insurance|Insured|Comprehensive|Third Party|TP|Zero Dep|Expired)\b/i);
  const insurance = insuranceMatch ? insuranceMatch[1] : undefined;

  const regNoMatch = clean.match(/\b([A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{4})\b/i);
  const reg_no = regNoMatch ? regNoMatch[1] : undefined;

  // Normalize
  const normalized = normalizeCarData({
    year,
    make,
    model,
    variant,
    fuel,
    transmission,
    price: priceRaw,
    km: kmRaw,
    color,
    owner,
    insurance,
    reg_no,
  });

  // Confidence
  const fields = ["year", "make", "model", "variant", "fuel", "transmission", "price", "km", "color", "owner", "insurance", "reg_no"];
  const detected = fields.filter(f => normalized[f as keyof CarData] !== undefined && normalized[f as keyof CarData] !== "");
  const confidence = Math.round((detected.length / fields.length) * 100);

  return {
    ...normalized,
    confidence,
  };
}
