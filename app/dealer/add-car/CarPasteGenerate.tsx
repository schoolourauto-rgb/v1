"use client";


import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { createClient } from "@supabase/supabase-js";
import { generateCarTitle } from "@/lib/generateCarTitle";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CarForm = {
  title: string;
  make: string;
  model: string;
  version: string;
  year: string;
  fuel: string;
  transmission: string;
  price: string;
  km: string;
  owner: string;
  insurance: string;
  colour: string;
  description: string;
  images: File[];
};

type ParsedField = {
  value: string;
  confidence: "high" | "medium" | "low";
};

type ParsedResult = {
  year: ParsedField;
  make: ParsedField;
  model: ParsedField;
  version: ParsedField;
  fuel: ParsedField;
  transmission: ParsedField;
  price: ParsedField;
  km: ParsedField;
  owner: ParsedField;
  insurance: ParsedField;
  colour: ParsedField;
};


// --- Pro WhatsApp Message Parser ---
function parseVehicleMessage(message: string) {
  // Helper to extract value by label
  const get = (label: string) => {
    const match = message.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\n]*)`, "i"));
    return match ? match[1].trim() : "";
  };

  // Clean price/km
  const cleanNumber = (val: string) => val.replace(/[^\d]/g, "");

  // Transmission is not in the WhatsApp format, so leave blank
  return {
    regNo: get("Reg\\. No"),
    year: get("Year"),
    make: get("Make"),
    model: get("Model"),
    version: get("Version"),
    fuel: get("Fuel"),
    colour: get("Colour"),
    owner: get("Owner"),
    insurance: get("Insurance"),
    km: cleanNumber(get("KM")),
    price: cleanNumber(get("Price")),
    title:
      (message.match(/### 🏷 Auto Generated Title[\s\S]*?```([^`]*)```/) || [,""])[1].trim() || "",
    transmission: "",
    description: message,
  };
}

function smartParse(raw: string): ParsedResult {
  const text = raw.toLowerCase().replace(/[₹,]/g, "");

  const extract = (regex: RegExp, confidence: ParsedField["confidence"] = "high"): ParsedField => {
    const match = text.match(regex);
    if (!match) return { value: "", confidence: "low" };
    return { value: match[1].trim(), confidence };
  };

  const year = extract(/\b(20\d{2})\b/);

  const priceRaw = extract(/price\s*[:-]?\s*([\w\.,₹ ]+)/i);
  const price: ParsedField = {
    value: normalizePrice(priceRaw.value || priceRaw),
    confidence: priceRaw.value ? "high" : "low",
  };

  const km = extract(/(\d{4,6})\s?(km|kms|driven)/i, "medium");

  const owner = extract(/(1st|2nd|3rd|\d+)\s?owner/i, "medium");

  const fuelTypes = ["diesel", "petrol", "cng", "electric"];
  const fuelValue = fuelTypes.find(f => text.includes(f)) || "";
  const fuel: ParsedField = {
    value: fuelValue,
    confidence: fuelValue ? "high" : "low",
  };

  const transmissionTypes = ["automatic", "manual"];
  const transmissionValue = transmissionTypes.find(t => text.includes(t)) || "";
  const transmission: ParsedField = {
    value: transmissionValue,
    confidence: transmissionValue ? "medium" : "low",
  };

  const colour = extract(/colour\s*[:-]?\s*(\w+)/i, "medium");
  const insurance = extract(/insurance\s*[:-]?\s*(.*)/i, "medium");

  // --- Advanced Make/Model/Version Detection ---
  let detectedMake: ParsedField = { value: "", confidence: "low" };
  let detectedModel: ParsedField = { value: "", confidence: "low" };
  let detectedVersion: ParsedField = { value: "", confidence: "low" };

  for (const brand in CAR_DATABASE) {
    if (text.includes(brand)) {
      detectedMake = { value: brand, confidence: "high" };
      const models = CAR_DATABASE[brand];
      for (const model of models) {
        if (similarity(text, model) > 0.7) {
          detectedModel = { value: model, confidence: "high" };
          break;
        }
      }
      break;
    }
  }

  if (detectedModel.value) {
    const words = text.split(" ");
    const modelIndex = words.findIndex(w => similarity(w, detectedModel.value) > 0.7);
    if (modelIndex !== -1 && words[modelIndex + 1]) {
      detectedVersion = {
        value: words[modelIndex + 1].toUpperCase(),
        confidence: "medium",
      };
    }
  }

  return {
    year,
    make: detectedMake,
    model: detectedModel,
    version: detectedVersion,
    fuel,
    transmission,
    price,
    km,
    owner,
    insurance,
    colour,
  };
}

const confidenceColor = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};


export default function CarPasteGenerate() {
  const [rawInput, setRawInput] = useState("");
  const [form, setForm] = useState<CarForm>({
    title: "",
    make: "",
    model: "",
    version: "",
    year: "",
    fuel: "",
    transmission: "",
    price: "",
    km: "",
    owner: "",
    insurance: "",
    colour: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  // --- Handler for WhatsApp Paste Parse ---
  const handleParseAndAutofill = () => {
    const parsed = parseVehicleMessage(rawInput);
    setForm(prev => ({
      ...prev,
      title: parsed.title,
      make: parsed.make,
      model: parsed.model,
      version: parsed.version,
      year: parsed.year,
      fuel: parsed.fuel,
      transmission: parsed.transmission,
      price: parsed.price,
      km: parsed.km,
      owner: parsed.owner,
      insurance: parsed.insurance,
      colour: parsed.colour,
      description: parsed.description,
    }));
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10),
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const uploadedUrls: string[] = [];
    for (const file of form.images) {
      const filePath = `cars/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("car-images")
        .upload(filePath, file);
      if (error) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }
      const { data } = supabase.storage
        .from("car-images")
        .getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }
    const res = await fetch("/api/car", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: uploadedUrls,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      alert("Submission failed");
      return;
    }
    alert("Car added successfully 🚗");
    setForm({
      title: "",
      make: "",
      model: "",
      version: "",
      year: "",
      fuel: "",
      transmission: "",
      price: "",
      km: "",
      owner: "",
      insurance: "",
      colour: "",
      description: "",
      images: [],
    });
    setRawInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Paste Full Vehicle Message
        </label>
        <textarea
          name="full_message"
          value={rawInput}
          onChange={e => setRawInput(e.target.value)}
          placeholder="Ahiya full WhatsApp vehicle details paste karo..."
          className="w-full min-h-[120px] rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-vertical"
        />
        <Button type="button" className="mt-2" onClick={handleParseAndAutofill}>
          Parse & Autofill
        </Button>
      </div>

      <Card className="p-4 space-y-2">
        <Input value={form.title} placeholder="Title" readOnly className="mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <Input value={form.year} placeholder="Year" readOnly />
          <Input value={form.make} placeholder="Make" readOnly />
          <Input value={form.model} placeholder="Model" readOnly />
          <Input value={form.version} placeholder="Version" readOnly />
          <Input value={form.fuel} placeholder="Fuel" readOnly />
          <Input value={form.colour} placeholder="Colour" readOnly />
          <Input value={form.owner} placeholder="Owner" readOnly />
          <Input value={form.insurance} placeholder="Insurance" readOnly />
          <Input value={form.km} placeholder="KM" readOnly />
          <Input value={form.price} placeholder="Price" readOnly />
        </div>
        <Input value={form.description} placeholder="Description" readOnly className="mt-2" />
      </Card>

      <div>
        <Label>Upload Images (max 10)</Label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="flex gap-2 mt-2">
          {form.images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="w-20 h-20 object-cover rounded"
                alt="preview"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Car"}
      </Button>
    </form>
  );
}
