
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import CarCard from "@/components/CarCard";
import { parseCarInput } from "@/lib/carParser";

type CarData = {
  year?: number;
  make?: string;
  model?: string;
  version?: string;
  transmission?: string;
  fuel?: string;
  price?: number;
  km?: number;
  colour?: string;
  owner?: string;
  insurance?: string;
  regNo?: string;
  title?: string;
  description?: string;
};

type ChipConfidence = "high" | "low";

function getChipConfidence(key: string, value: string | number | undefined): ChipConfidence {
  // Simple confidence: if value exists and is not empty, high; else low
  if (typeof value === "number" && value > 0) return "high";
  if (typeof value === "string" && value.trim().length > 0) return "high";
  return "low";
}

const REQUIRED_FIELDS: (keyof CarData)[] = ["year", "make", "model", "price", "km", "regNo", "title"];

export default function AddCarClient() {
  const [message, setMessage] = useState("");
  const [carData, setCarData] = useState<CarData>({});
  const [chips, setChips] = useState<{ key: keyof CarData; value: string | number; confidence: ChipConfidence }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parse and normalize on message/images change
  useEffect(() => {
    const result = parseCarInput(message, images.map(f => f.name));
    if (result.success) {
      const { images: _img, ...parsed } = result.data;
      setCarData(parsed);
      // Chips
      const chipFields: (keyof CarData)[] = ["year", "make", "model", "version", "transmission", "fuel", "price", "km", "colour", "owner", "insurance", "regNo"];
      setChips(
        chipFields
          .filter(k => parsed[k] !== undefined && parsed[k] !== "")
          .map(k => ({ key: k, value: parsed[k]!, confidence: getChipConfidence(k, parsed[k]) }))
      );
      setError("");
    } else {
      setCarData({});
      setChips([]);
      setError(Object.values(result.errors).join(", "));
    }
  }, [message, images]);

  // Image handlers
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) return;
    setImages([...images, ...files]);
  };
  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  // Drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length + images.length > 10) return;
    setImages([...images, ...files]);
  };

  // Validation
  const isValid =
    REQUIRED_FIELDS.every(f => carData[f]) &&
    images.length > 0 &&
    typeof carData.regNo === "string" && carData.regNo.length > 0 &&
    typeof carData.title === "string" && carData.title.length > 0 &&
    typeof carData.price === "number" && carData.price > 0;

  // Preview modal open
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  // Publish
  const handlePublish = async () => {
    if (!isValid) return;
    setPublishLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const imageUrls: string[] = [];
      for (const file of images) {
        const { data, error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(`dealer/${Date.now()}-${file.name}`, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(data.path);
        imageUrls.push(urlData.publicUrl);
      }
      const res = await fetch("/api/dealer/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_message: message,
          parsed_data: carData,
          image_urls: imageUrls,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to list car.");
        setPublishLoading(false);
        return;
      }
      setPreviewOpen(false);
      setImages([]);
      setMessage("");
    } catch (err) {
      setError("Failed to list car.");
    } finally {
      setPublishLoading(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row md:items-start pb-24">
      {/* Left: Chat Composer */}
      <div className="w-full md:w-1/2 max-w-xl mx-auto md:mx-0 bg-background card-bg rounded-2xl soft-border p-6 mt-8 flex flex-col" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map(({ key, value, confidence }) => (
            <span
              key={key}
              className={`px-3 py-1 rounded-2xl text-sm font-medium border ${confidence === "high" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}`}
            >
              {String(value)}
            </span>
          ))}
        </div>
        {/* Chat input */}
        <textarea
          className="w-full h-40 md:h-56 p-4 text-lg bg-background card-bg rounded-2xl resize-none font-mono focus:outline-none focus:ring-2 focus:ring-accent soft-border mb-4"
          placeholder="Paste WhatsApp car details..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          autoFocus
          rows={8}
        />
        {/* Image Picker */}
        <div className="mb-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="grid grid-cols-3 gap-2">
            {images.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden soft-border">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width={320}
                  height={240}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-accent text-accentFg text-xs px-2 py-0.5 rounded-2xl">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-background text-foreground text-xs px-2 rounded-2xl soft-border"
                  aria-label="Remove image"
                >
                  X
                </button>
              </div>
            ))}
            {/* Add button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-accent rounded-2xl flex items-center justify-center text-2xl text-accent"
              aria-label="Add image"
            >
              +
            </button>
          </div>
        </div>
        {/* Error/Validation */}
        {error && <div className="text-accent text-sm font-medium mb-2">{error}</div>}
        {/* Preview/Publish Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          {isMobile ? (
            <>
              <button
                type="button"
                className="w-full btn-accent font-semibold py-3 rounded-2xl"
                onClick={openPreview}
                disabled={!isValid}
              >
                Preview
              </button>
            </>
          ) : (
            <button
              type="button"
              className="w-full btn-accent font-semibold py-3 rounded-2xl"
              onClick={openPreview}
              disabled={!isValid}
            >
              🚀 Generate Listing
            </button>
          )}
        </div>
      </div>
      {/* Right: Live Preview (desktop) */}
      {!isMobile && (
        <div className="w-full md:w-1/2 flex justify-center items-start mt-8 md:mt-8">
          <div className="w-full max-w-md mx-auto">
            <CarCard
              car={{
                title: carData.title || "",
                price: carData.price,
                brand: carData.make,
                model: carData.model,
                year: carData.year,
                fuel: carData.fuel,
                transmission: carData.transmission,
                owner: carData.owner,
                km: carData.km,
                images: images.map(file => URL.createObjectURL(file)),
                description: carData.description,
                slug: "",
                preview: true,
              }}
            />
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-2xl p-6 max-w-lg w-full relative shadow-2xl">
            <button
              className="absolute top-2 right-2 text-2xl text-foreground/60 hover:text-accent"
              onClick={closePreview}
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              {images[0] && (
                <Image
                  src={URL.createObjectURL(images[0])}
                  alt="Main image"
                  width={320}
                  height={240}
                  className="object-cover rounded-xl mb-4"
                />
              )}
              <div className="w-full flex flex-col gap-2 mb-4">
                <div className="text-xl font-bold">{carData.title}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip">₹ {carData.price?.toLocaleString()}</span>
                  <span className="chip">{carData.km} KM</span>
                  <span className="chip">{carData.fuel}</span>
                  <span className="chip">{carData.transmission}</span>
                  <span className="chip">{carData.owner}</span>
                  <span className="chip">{carData.insurance}</span>
                </div>
                <div className="text-foreground/80 text-sm">{carData.description}</div>
              </div>
              <div className="flex gap-4 w-full">
                <button
                  className="flex-1 btn-secondary py-2 rounded-2xl"
                  onClick={closePreview}
                  disabled={publishLoading}
                >
                  Edit
                </button>
                <button
                  className="flex-1 btn-accent py-2 rounded-2xl"
                  onClick={handlePublish}
                  disabled={!isValid || publishLoading}
                >
                  {publishLoading ? "Publishing..." : "Confirm & Publish"}
                </button>
              </div>
              {!isValid && (
                <div className="text-accent text-xs mt-2 font-medium">
                  Main image must clearly show number plate and registration number must be detected.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
