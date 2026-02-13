"use client";
function formatIndianPrice(value: string) {
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("en-IN");
}
function generateDescription(form: {
  year: string;
  make: string;
  model: string;
  version: string;
  fuel: string;
  transmission?: string;
  km: string;
  owner: string;
  colour: string;
  insurance: string;
}) {
  const transmission = form.transmission?.trim() || "Manual";
  const cleanKm = form.km
    ?.replace(/[,]/g, "")
    ?.replace(/\s/g, "");
  return `${form.make} ${form.model} ${form.version} ${transmission} (${form.year})\n\n• ${cleanKm} KM Driven\n• ${form.owner} Owner\n• ${form.colour} Colour\n• Insurance: ${form.insurance}\n• Transmission: ${transmission}\n• Fuel: ${form.fuel}\n\nWell maintained vehicle. Genuine mileage. Contact for more details.`;
}

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";

type CarForm = {
  title: string;
  year: string;
  make: string;
  model: string;
  version: string;
  fuel: string;
  colour: string;
  owner: string;
  insurance: string;
  transmission: string;
  km: string;
  price: string;
  description: string;
  images: File[];
};

export default function CarPasteGenerate() {
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CarForm>({
    title: "",
    year: "",
    make: "",
    model: "",
    version: "",
    fuel: "",
    colour: "",
    owner: "",
    insurance: "",
    transmission: "",
    km: "",
    price: "",
    description: "",
    images: [],
  });

  function extract(regex: RegExp) {
    return rawInput.match(regex)?.[1]?.trim() || "";
  }

  const handleAnalyze = () => {
    // 🔹 Normalize text (remove emojis + bold markers)
    const normalized = rawInput
      .replace(/\*/g, "")
      .replace(/🗓|🏭|🚘|⛽|🎨|👤|📃|🎰|💵|💳|🕹️/g, "");

    const extract = (regex: RegExp) =>
      normalized.match(regex)?.[1]?.trim() || "";

    // Universal Year extraction with short format support
    let year =
      extract(/Year\*?\s*[:-]\s*(\d{4})/i) ||
      extract(/\*Year\*\s*[:-]\s*(\d{4})/i) ||
      extract(/(\d{4})/);

    if (!year) {
      // try format like 10/21
      const shortYearMatch = rawInput.match(/\b\d{1,2}\/(\d{2})\b/);
      if (shortYearMatch) {
        year = "20" + shortYearMatch[1];
      }
    }

    const make = extract(/Make\s*[:-]\s*(.*)/i);
    const model = extract(/Model\s*[:-]\s*(.*)/i);
    const version = extract(/Version\s*[:-]\s*(.*)/i);
    const fuel = extract(/Fuel\s*[:-]\s*(.*)/i);
    const colour = extract(/Colour\s*[:-]\s*(.*)/i);
    const owner = extract(/Owner\s*[:-]\s*(.*)/i);
    const insurance = extract(/Insurance\s*[:-]\s*(.*)/i);

    // Transmission default Manual logic
    let transmission = extract(/Transmission\s*[:-]\s*(.*)/i);
    if (!transmission) {
      transmission = "Manual";
    }

    const kmRaw = extract(/K\/?m\.?\s*[:-]\s*(.*)/i);
    const priceRaw = extract(/Price\s*[:-]\s*(.*)/i);

    const cleanedKm = kmRaw
      .replace(/Genuine/gi, "")
      .replace(/km/gi, "")
      .replace(/[,]/g, "")
      .replace(/\s/g, "");

    const cleanedPrice = priceRaw
      .replace(/[,\/\-]/g, "")
      .replace(/\s/g, "");

    const description = generateDescription({
      year,
      make,
      model,
      version,
      fuel,
      transmission,
      km: cleanedKm,
      owner,
      colour,
      insurance
    });

    const title = `${make} ${model} ${version} ${transmission} (${year})`
      .replace(/\s+/g, " ")
      .trim();

    setForm(prev => ({
      ...prev,
      title,
      year,
      make,
      model,
      version,
      fuel,
      transmission,
      colour,
      owner,
      insurance,
      km: cleanedKm,
      price: formatIndianPrice(cleanedPrice),
      description
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 10) : [];
    setForm(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // your existing submit logic here

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* PREVIEW FIRST */}
      {form.title && (
        <div className="bg-muted rounded-xl p-4 text-sm space-y-2">
          <h3 className="font-semibold text-base">{form.title}</h3>
          <p>• {form.km} KM Driven</p>
          <p>• {form.owner} Owner</p>
          <p>• {form.colour} Colour</p>
          <p>• Insurance: {form.insurance}</p>
          <p>• Transmission: {form.transmission}</p>
          <p>• Fuel: {form.fuel}</p>
        </div>
      )}

      {/* PASTE BOX */}
      <div>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Paste WhatsApp vehicle message..."
          className="w-full min-h-[180px] rounded-xl border p-4"
        />
        <Button onClick={handleAnalyze} className="mt-3">
          Analyze & Fill Details
        </Button>
      </div>

      {/* IMAGE UPLOAD BELOW */}
      <div>
        <Label>Upload Images (max 10)</Label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange}/>
      </div>

      {/* FINAL FORM FIELDS (optional, can be expanded as needed) */}
      {/* ...existing code... */}
    </div>
  );
}
