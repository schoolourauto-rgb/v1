// lib/parser/normalizeCarData.ts
import { CarData } from "./types";

export function normalizeCarData(data: Partial<CarData>): CarData {
  let price: number | undefined = undefined;
  if (typeof data.price === "string") {
    let p = (data.price ?? "").trim().toLowerCase();
    if (p.includes("lakh")) {
      p = p.replace(/[^0-9]/g, "");
      price = parseInt(p) * 100000;
    } else if (p.endsWith("l")) {
      p = p.replace(/[^0-9]/g, "");
      price = parseInt(p) * 100000;
    } else {
      price = parseInt(p.replace(/,/g, ""));
    }
  } else if (typeof data.price === "number") {
    price = data.price;
  }

  let km: number | undefined = undefined;
  if (typeof data.km === "string") {
    km = parseInt(data.km.replace(/,/g, ""));
  } else if (typeof data.km === "number") {
    km = data.km;
  }

  let fuel: CarData["fuel"] | undefined = undefined;
  if (typeof data.fuel === "string") {
    const f = data.fuel.trim().toLowerCase();
    if (f === "diesel") fuel = "Diesel";
    else if (f === "petrol") fuel = "Petrol";
    else if (f === "cng") fuel = "CNG";
    else if (["ev", "electric"].includes(f)) fuel = "EV";
  }

  let transmission: CarData["transmission"] | undefined = undefined;
  if (typeof data.transmission === "string") {
    const t = data.transmission.trim().toLowerCase();
    if (["automatic", "auto", "amt", "cvt", "dsg", "imt"].includes(t)) transmission = "Automatic";
    else if (t === "manual") transmission = "Manual";
  }

  return {
    year: data.year,
    make: data.make,
    model: data.model,
    variant: data.variant,
    fuel,
    transmission,
    price,
    km,
    color: data.color,
    owner: data.owner,
    insurance: data.insurance,
    reg_no: data.reg_no,
    confidence: data.confidence ?? 0,
  };
}
