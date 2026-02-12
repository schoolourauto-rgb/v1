"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { createClient } from "@supabase/supabase-js";
import { generateCarTitle } from "@/lib/generateCarTitle";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAR_DATABASE: Record<string, string[]> = {
  hyundai: ["creta", "i20", "verna", "venue", "alcazar"],
  maruti: ["swift", "baleno", "brezza", "wagonr", "dzire"],
  honda: ["city", "amaze", "elevate", "jazz"],
  toyota: ["fortuner", "innova", "glanza", "urban cruiser"],
  tata: ["nexon", "harrier", "punch", "altroz"],
};

function similarity(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8;
  return 0;
}

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

function normalizePrice(raw: string): string {
  if (!raw) return "";
  let str = raw.toLowerCase().replace(/[^\d\.lk]/g, "");
  // Handle lakh/"l"/"lk"/"lac"
  if (/([\d\.]+)\s*(l|lk|lac|lakh)/.test(str)) {
    const match = str.match(/([\d\.]+)\s*(l|lk|lac|lakh)/);
    if (match) {
      const num = parseFloat(match[1]);
      if (!isNaN(num)) return String(Math.round(num * 100000));
    }
  }
  // Handle comma separated (e.g. 13,50,000)
  if (/\d{1,2},\d{2,3},\d{3}/.test(str)) {
    return str.replace(/,/g, "");
  }
  // Handle plain number (e.g. 1350000)
  if (/^\d{5,8}$/.test(str)) {
    return str;
  }
  // Handle decimal lakh (e.g. 13.5)
  if (/^\d{1,2}\.\d{1,2}$/.test(str)) {
    return String(Math.round(parseFloat(str) * 100000));
  }
  return raw.replace(/[^\d]/g, "");
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  const [detected, setDetected] = useState<ParsedResult | null>(null);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [summary, setSummary] = useState<{
    summaryText: string;
    score: number;
    status: "high" | "medium" | "low";
    detectedCount: number;
    totalFields: number;
  } | null>(null);

  const extract = (regex: RegExp) =>
    rawInput.match(regex)?.[1]?.trim() || "";

  const handleAutoFill = () => {
    const parsed = smartParse(rawInput);

    const autoTitle = generateCarTitle({
      year: parsed.year.value,
      make: parsed.make.value,
      model: parsed.model.value,
      version: parsed.version.value,
      fuel: parsed.fuel.value,
      transmission: parsed.transmission.value,
    });

    setForm(prev => ({
      ...prev,
      title: autoTitle,
      year: parsed.year.value,
      fuel: parsed.fuel.value,
      transmission: parsed.transmission.value,
      price: parsed.price.value,
      km: parsed.km.value,
      owner: parsed.owner.value,
      insurance: parsed.insurance.value,
      colour: parsed.colour.value,
    }));

    setDetected(parsed);
    setHighlightedFields([
      "year",
      "fuel",
      "transmission",
      "price",
      "km",
      "owner",
      "insurance",
      "colour",
    ]);
    setTimeout(() => {
      setHighlightedFields([]);
    }, 1500);

    // --- AI Summary Panel Logic ---
    const totalFields = Object.keys(parsed).length;
    const detectedFields = Object.values(parsed).filter(f => f.value !== "");
    const detectedCount = detectedFields.length;
    const score = Math.round((detectedCount / totalFields) * 100);
    let status: "high" | "medium" | "low" = "low";
    if (score >= 80) status = "high";
    else if (score >= 50) status = "medium";
    // Compose summary string
    const summaryText = [
      [parsed.year.value, parsed.make.value, parsed.model.value, parsed.version.value, parsed.fuel.value, parsed.transmission.value].filter(Boolean).join(" "),
      parsed.price.value ? `₹${Number(parsed.price.value).toLocaleString()}` : null,
      parsed.km.value ? `${parsed.km.value} KM` : null,
      parsed.owner.value ? `${parsed.owner.value} Owner` : null,
    ].filter(Boolean).join("\n");
    setSummary({ summaryText, score, status, detectedCount, totalFields });
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

    if (!captchaToken) {
      alert("Please verify CAPTCHA");
      return;
    }

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
        token: captchaToken,
      }),
    });

    setLoading(false);
    setCaptchaToken(null);

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
      {/* AI Summary Panel */}
      {summary && (
        <div className="mb-4">
          <Card className="p-4 bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🤖</span>
              <span className="font-semibold text-lg">AI Detected Vehicle</span>
            </div>
            <pre className="text-base font-mono whitespace-pre-wrap leading-snug mb-2">{summary.summaryText}</pre>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-40 h-2 bg-gray-200 rounded">
                <div
                  className={
                    summary.status === "high"
                      ? "bg-green-500"
                      : summary.status === "medium"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }
                  style={{ width: `${summary.score}%`, height: "100%", borderRadius: 4 }}
                />
              </div>
              <span className="text-xs font-semibold">
                {summary.status === "high"
                  ? "🟢 High"
                  : summary.status === "medium"
                  ? "🟡 Review"
                  : "🔴 Manual Check"}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {summary.detectedCount}/{summary.totalFields} fields
              </span>
            </div>
            {summary.status === "high" && (
              <div className="text-green-700 text-sm font-medium mt-1">Looks Good!</div>
            )}
            {summary.status === "medium" && (
              <div className="text-yellow-700 text-sm font-medium mt-1">Review suggested: Some fields missing</div>
            )}
            {summary.status === "low" && (
              <div className="text-red-700 text-sm font-medium mt-1">Manual check required: Many fields missing</div>
            )}
          </Card>
        </div>
      )}
      <div>
        <Label>Paste WhatsApp Vehicle Details</Label>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full h-36 border rounded p-3"
          placeholder="Paste full vehicle details here..."
        />
        <Button type="button" onClick={handleAutoFill}>
          Auto Detect & Fill
        </Button>
      </div>

      <Card className="p-4 space-y-2">
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("title") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.title} placeholder="Title" readOnly />
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("price") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.price} placeholder="Price" readOnly />
          {detected?.price.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.price.confidence]
              }`}
            >
              Detected • {detected.price.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("km") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.km} placeholder="KM" readOnly />
          {detected?.km.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.km.confidence]
              }`}
            >
              Detected • {detected.km.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("year") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.year} placeholder="Year" readOnly />
          {detected?.year.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.year.confidence]
              }`}
            >
              Detected • {detected.year.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("fuel") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.fuel} placeholder="Fuel" readOnly />
          {detected?.fuel.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.fuel.confidence]
              }`}
            >
              Detected • {detected.fuel.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("transmission") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.transmission} placeholder="Transmission" readOnly />
          {detected?.transmission.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.transmission.confidence]
              }`}
            >
              Detected • {detected.transmission.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("owner") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.owner} placeholder="Owner" readOnly />
          {detected?.owner.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.owner.confidence]
              }`}
            >
              Detected • {detected.owner.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("insurance") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.insurance} placeholder="Insurance" readOnly />
          {detected?.insurance.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.insurance.confidence]
              }`}
            >
              Detected • {detected.insurance.confidence}
            </span>
          )}
        </div>
        <div
          className={`relative transition-all duration-300 ${
            highlightedFields.includes("colour") ? "ring-2 ring-green-500 shadow-lg shadow-green-500/20" : ""
          }`}
        >
          <Input value={form.colour} placeholder="Colour" readOnly />
          {detected?.colour.value && (
            <span
              className={`absolute right-2 top-2 text-xs px-2 py-0.5 rounded ${
                confidenceColor[detected.colour.confidence]
              }`}
            >
              Detected • {detected.colour.confidence}
            </span>
          )}
        </div>
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

      {isClient && siteKey && (
        <ReCAPTCHA sitekey={siteKey} onChange={setCaptchaToken} />
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Car"}
      </Button>
    </form>
  );
}
