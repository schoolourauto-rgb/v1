"use client";
"use client";

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
    km: "",
    price: "",
    description: "",
    images: [],
  });

  function extract(regex: RegExp) {
    return rawInput.match(regex)?.[1]?.trim() || "";
  }

  const handleAnalyze = () => {
    const year = extract(/Year\s*[:-]\s*(\d{4})/i);
    const make = extract(/Make\s*[:-]\s*(.*)/i);
    const model = extract(/Model\s*[:-]\s*(.*)/i);
    const version = extract(/Version\s*[:-]\s*(.*)/i);
    const fuel = extract(/Fuel\s*[:-]\s*(.*)/i);
    const colour = extract(/Colour\s*[:-]\s*(.*)/i);
    const owner = extract(/Owner\s*[:-]\s*(.*)/i);
    const insurance = extract(/Insurance\s*[:-]\s*(.*)/i);
    const kmRaw = extract(/K\/?m\s*[:-]\s*(.*)/i);
    const priceRaw = extract(/Price\s*[:-]\s*(.*)/i);

    const cleanedKm = kmRaw
      .replace(/Genuine/gi, "")
      .replace(/[,]/g, "")
      .replace(/\s/g, "");

    const cleanedPrice = priceRaw
      .replace(/[,\/\-]/g, "")
      .replace(/\s/g, "");

    let title = `${year} ${make} ${model} ${version} ${fuel}`
      .replace(/\s+/g, " ")
      .trim();

    if (!title) {
      const firstLine = rawInput
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)[0] || "";
      title = firstLine;
    }

    setForm(prev => ({
      ...prev,
      title,
      year,
      make,
      model,
      version,
      fuel,
      colour,
      owner,
      insurance,
      km: cleanedKm,
      price: cleanedPrice,
      description: rawInput
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
    <div className="space-y-8">

      {/* Smart Paste Section */}
      <div>
        <h2 className="text-lg font-bold mb-2">
          🧠 Smart Paste Vehicle Details
        </h2>

        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Paste full WhatsApp vehicle message here..."
          className="w-full min-h-[150px] rounded-lg border border-border bg-background p-3 text-base resize-none"
        />

        <Button
          type="button"
          onClick={handleAnalyze}
          className="mt-3"
        >
          Analyze & Fill Details
        </Button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        <Card>
          <Input value={form.title} placeholder="Title" readOnly />
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
          <Input value={form.description} placeholder="Description" readOnly />
        </Card>

        <div>
          <Label>Upload Images (max 10)</Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Car"}
        </Button>

      </form>
    </div>
  );
}
