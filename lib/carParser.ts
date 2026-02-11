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
  const get = (label: string) =>
    text.match(new RegExp(`${label}.*?:\\s*(.*)`))?.[1]?.trim() || "";

  // 🧠 Auto price cleaning
  const cleanPrice = (raw: string) => {
    const numeric = raw.replace(/[^\d]/g, "");
    return numeric ? Number(numeric) : null;
  };

  // 🧠 KM cleaning
  const cleanKM = (raw: string) => {
    const numeric = raw.replace(/[^\d]/g, "");
    return numeric ? Number(numeric) : null;
  };

  // 🧠 Auto image detection (URL detect)
  const imageUrls =
    text.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)/gi) || [];

  const yearRaw = get("Year");
  const year = yearRaw ? Number(yearRaw.replace(/[^\d]/g, "")) : null;

  const priceRaw = get("Price");
  const kmRaw = get("K/m");

  const errors: string[] = [];

  // ✅ Validation
  if (year && year < 2000) {
    errors.push("Year must be 2000 or newer");
  }

  return {
    regNo: get("Reg.No"),
    year,
    make: get("Make"),
    model: get("Model"),
    version: get("Version"),
    fuel: get("Fuel"),
    color: get("Colour"),
    owner: get("Owner"),
    insurance: get("Insurance"),
    km: cleanKM(kmRaw),
    price: cleanPrice(priceRaw),
    images: imageUrls,
    errors,
  };
}
