"use client";

import { useState } from "react";

interface CarData {
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
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<CarData | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const extract = (regex: RegExp, text: string) =>
    text.match(regex)?.[1]?.trim() || "";

  const parseCarText = (text: string): CarData => {
    const clean = text.replace(/\*/g, "");

    let year =
      extract(/Year\s*[:-]?\s*(\d{4})/i, text) ||
      extract(/(\b20\d{2}\b)/, text) ||
      "";

    if (!year) {
      const shortYear = extract(/\/(\d{2})/, text);
      if (shortYear) year = "20" + shortYear;
    }

    const make = extract(/Make\s*[:-]?\s*(.*)/i, text);
    const model = extract(/Model\s*[:-]?\s*(.*)/i, text);
    const version = extract(/Version\s*[:-]?\s*(.*)/i, text);
    const transmission =
      extract(/Transmission\s*[:-]?\s*(.*)/i, text) || "Manual";
    const fuel = extract(/Fuel\s*[:-]?\s*(.*)/i, text);
    const colour = extract(/Colour\s*[:-]?\s*(.*)/i, text);
    const owner = extract(/Owner\s*[:-]?\s*(.*)/i, text);
    const insurance = extract(/Insurance\s*[:-]?\s*(.*)/i, text);
    const km = extract(/K\/?m\.?\s*[:-]?\s*([\d,]+)/i, text).replace(/,/g, "");

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

    return {
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
    };
  };

  const handleAnalyze = () => {
    const result = parseCarText(rawText);
    setParsedData(result);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files).slice(0, 8));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    setImages(Array.from(e.dataTransfer.files).slice(0, 8));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Preview */}
      {parsedData && (
        <div className="rounded-xl border p-5 bg-muted/30 text-sm space-y-2">
          <h2 className="text-lg font-semibold">
            {parsedData.title || "Vehicle Preview"}
          </h2>
          {parsedData.km && <p>• {parsedData.km} KM Driven</p>}
          {parsedData.owner && <p>• {parsedData.owner} Owner</p>}
          {parsedData.colour && <p>• {parsedData.colour} Colour</p>}
          {parsedData.fuel && <p>• Fuel: {parsedData.fuel}</p>}
        </div>
      )}

      {/* Paste Box */}
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste WhatsApp vehicle message here..."
        className="w-full min-h-[200px] rounded-lg border p-4 bg-background"
      />

      <button
        onClick={handleAnalyze}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Analyze
      </button>

      {/* Image Upload */}
      <div
        className={`p-6 border-2 border-dashed rounded-lg ${
          dragActive ? "border-blue-400" : "border-zinc-500"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
