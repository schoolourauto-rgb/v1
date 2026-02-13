"use client";

import { useState } from "react";

interface FormData {
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
  remarks: string;
}

export default function CarPasteGenerate() {
  const [rawInput, setRawInput] = useState("");
  const [form, setForm] = useState<FormData>({
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
    remarks: "",
  });

  const extract = (regex: RegExp) => {
    return rawInput.match(regex)?.[1]?.trim() || "";
  };

  const handleAnalyze = () => {
    const clean = rawInput.replace(/\*/g, "");

    let year =
      extract(/Year\s*[:-]?\s*(\d{4})/i) ||
      extract(/(\b20\d{2}\b)/) ||
      "";

    if (!year) {
      const shortYear = extract(/\/(\d{2})/);
      if (shortYear) year = "20" + shortYear;
    }

    const make = extract(/Make\s*[:-]?\s*(.*)/i);
    const model = extract(/Model\s*[:-]?\s*(.*)/i);
    const version = extract(/Version\s*[:-]?\s*(.*)/i);
    const transmission =
      extract(/Transmission\s*[:-]?\s*(.*)/i) || "Manual";
    const fuel = extract(/Fuel\s*[:-]?\s*(.*)/i);
    const colour = extract(/Colour\s*[:-]?\s*(.*)/i);
    const owner = extract(/Owner\s*[:-]?\s*(.*)/i);
    const insurance = extract(/Insurance\s*[:-]?\s*(.*)/i);
    const km = extract(/K\/?m\.?\s*[:-]?\s*([\d,]+)/i).replace(/,/g, "");

    const title = `${make} ${model} ${version} ${transmission} (${year})`
      .replace(/\s+/g, " ")
      .trim();

    const usedKeywords = [
      "year",
      "make",
      "model",
      "version",
      "fuel",
      "colour",
      "owner",
      "insurance",
      "km",
      "k/m",
      "transmission",
    ];

    const lines = clean
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const remarks = lines
      .filter(
        (line) =>
          !usedKeywords.some((k) =>
            line.toLowerCase().includes(k)
          )
      )
      .join("\n");

    setForm({
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
      remarks,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">

      {/* Preview */}
      <div className="rounded-xl border p-5 bg-muted/30 text-sm space-y-2">
        <h2 className="text-lg font-semibold">
          {form.title || "Vehicle Preview"}
        </h2>

        {form.km && <p>• {form.km} KM Driven</p>}
        {form.owner && <p>• {form.owner} Owner</p>}
        {form.colour && <p>• {form.colour} Colour</p>}
        {form.insurance && <p>• Insurance: {form.insurance}</p>}
        {form.transmission && <p>• Transmission: {form.transmission}</p>}
        {form.fuel && <p>• Fuel: {form.fuel}</p>}
        {form.remarks && (
          <div className="pt-2 whitespace-pre-line text-muted-foreground">
            {form.remarks}
          </div>
        )}
      </div>

      {/* Paste Box */}
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder="Paste full WhatsApp vehicle message here..."
        className="w-full min-h-[200px] rounded-lg border p-4 bg-background"
      />

      {/* Button */}
      <button
        onClick={handleAnalyze}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Analyze & Fill Details
      </button>

      {/* Structured Fields */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {Object.entries(form).map(([key, value]) =>
          key !== "title" && key !== "remarks" ? (
            <input
              key={key}
              value={value}
              readOnly
              placeholder={key}
              className="rounded border p-2 bg-background"
            />
          ) : null
        )}
      </div>
    </div>
  );
}
