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
  price: string;
  remarks: string;
}

export default function CarPasteGenerate() {
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<CarData | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const extract = (regex: RegExp, text: string) =>
    text.match(regex)?.[1]?.trim() || "";

  // Clean price utility
  function cleanPrice(value: string) {
    if (!value) return "";
    return value
      .replace(/,/g, "")
      .replace(/\/-/g, "")
      .replace(/[^\d]/g, "")
      .trim();
  }

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

    // Price extraction (strict)
    let priceRaw = "";
    const priceMatch = clean.match(/price\s*[:\-]?\s*₹?\s*([\d,]+)(?:\/-)?/i);
    if (priceMatch) {
      priceRaw = priceMatch[1];
    }
    const price = cleanPrice(priceRaw);

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
      "price",
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
      price,
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

  const handlePostCar = async () => {
    if (!parsedData) return;

    // Extra frontend price validation
    if (!parsedData.price || Number(parsedData.price) <= 0) {
      alert("Please enter valid price");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(parsedData));
    images.forEach((img) => {
      formData.append("images", img);
    });

    const res = await fetch("/api/dealer/cars", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Car posted successfully!");
      window.location.href = "/dealer/listings";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Paste Box */}
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste WhatsApp vehicle message here..."
        className="w-full min-h-[200px] rounded-lg border p-4 bg-background"
      />

      {/* Analyze button removed for production */}

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

      {/* Premium Preview */}
      {parsedData && (
        <div className="rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">
                {parsedData.make} {parsedData.model}
              </h2>
              <p className="text-zinc-400">
                {parsedData.version} • {parsedData.year}
              </p>
            </div>
            <div className="text-xl font-semibold text-green-400">
              {/* Show formatted price if available */}
              {parsedData.price ? `₹${Number(parsedData.price).toLocaleString('en-IN')}` : ""}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-zinc-300">
            <div>🚗 {parsedData.transmission}</div>
            <div>⛽ {parsedData.fuel}</div>
            <div>🎨 {parsedData.colour}</div>
            <div>👤 {parsedData.owner} Owner</div>
            <div>🛡 {parsedData.insurance}</div>
            <div>📍 {parsedData.km} KM</div>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded-xl"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Always-visible Post Button */}
      <button
        onClick={handlePostCar}
        disabled={!parsedData}
        className={`w-full mt-4 px-6 py-3 rounded-xl font-semibold transition
        ${parsedData 
          ? "bg-yellow-400 text-black hover:bg-yellow-500"
          : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
      >
        🚘 Post Car Listing
      </button>
    </div>
  );
}
