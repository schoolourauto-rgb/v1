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
  transmission: string;
  fuel: string;
  colour: string;
  owner: string;
  insurance: string;
  km: string;
  price: string;
  remarks: string;
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
    transmission: "",
    fuel: "",
    colour: "",
    owner: "",
    insurance: "",
    km: "",
    price: "",
    remarks: "",
    images: [],
  });

  function extract(regex: RegExp) {
    return rawInput.match(regex)?.[1]?.trim() || "";
  }

  const handleAnalyze = () => {
    const lines = rawInput
      .split("\n")
      .map(l => l.replace(/\*/g, "").trim())
      .filter(Boolean);

    const extractField = (regex: RegExp) =>
      rawInput.match(regex)?.[1]?.trim() || "";

    let year = extractField(/Year\s*[:-]\s*(\d{4})/i);
    if (!year) {
      const shortYear = rawInput.match(/\b\d{1,2}\/(\d{2})\b/);
      if (shortYear) year = "20" + shortYear[1];
    }

    const make = extractField(/Make\s*[:-]\s*(.*)/i);
    const model = extractField(/Model\s*[:-]\s*(.*)/i);
    const version = extractField(/Version\s*[:-]\s*(.*)/i);
    const fuel = extractField(/Fuel\s*[:-]\s*(.*)/i);
    const colour = extractField(/Colour\s*[:-]\s*(.*)/i);
    const owner = extractField(/Owner\s*[:-]\s*(.*)/i);
    const insurance = extractField(/Insurance\s*[:-]\s*(.*)/i);

    let transmission =
      extractField(/Transmission\s*[:-]\s*(.*)/i) || "Manual";

    const kmRaw = extractField(/K\/?m\s*[:-]\s*(.*)/i);
    const priceRaw = extractField(/Price\s*[:-]\s*(.*)/i);

    const km = kmRaw
      .replace(/Genuine/gi, "")
      .replace(/[,]/g, "")
      .replace(/\s/g, "");

    const price = priceRaw
      .replace(/[,\/\-]/g, "")
      .replace(/\s/g, "");

    // 🎯 TITLE FORMAT
    const title = `${make} ${model} ${version} ${transmission} (${year})`
      .replace(/\s+/g, " ")
      .trim();

    // 🎯 REMOVE USED LINES → REMARKS
    const usedKeywords = [
      "Reg",
      "Year",
      "Make",
      "Model",
      "Version",
      "Transmission",
      "Fuel",
      "Colour",
      "Owner",
      "Insurance",
      "K/m",
      "KM",
      "Price",
    ];

    const remarksLines = lines.filter(
      line => !usedKeywords.some(keyword =>
        line.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const remarks = remarksLines.join("\n");

    setForm(prev => ({
      ...prev,
      title,
      year,
      make,
      model,
      version,
      transmission,
      fuel,
      colour,
      owner,
      insurance,
      km,
      price,
      remarks
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
