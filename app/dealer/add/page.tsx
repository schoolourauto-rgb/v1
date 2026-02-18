"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import CarCard from "@/components/CarCard";
import { parseCarMessage } from "@/lib/parser/parseCarMessage";
import { validateCarData } from "@/lib/parser/validateCarData";
import { generateTitle } from "@/lib/parser/generateTitle";
import { generateSlug } from "@/lib/parser/generateSlug";
import { aiFallbackParser } from "@/lib/parser/aiFallbackParser";
import { CarData } from "@/lib/parser/types";

export default function DealerAddCarPage() {
  const [message, setMessage] = useState("");
  const [carData, setCarData] = useState<CarData>({ confidence: 0 });
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: false, errors: [] });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let parsed: CarData | null = parseCarMessage(message);
    if (!parsed || parsed.confidence < 30) {
      parsed = aiFallbackParser(message) || { confidence: 0 };
    }
    setCarData(parsed);
    setTitle(generateTitle(parsed));
    setSlug(generateSlug(parsed));
    setValidation(validateCarData(parsed));
  }, [message]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const canPublish = validation.valid && images.length > 0 && carData.confidence >= 60 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPublish) return;
    setLoading(true);
    setSuccess("");
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
      const { error: insertError } = await supabase
        .from("cars")
        .insert([
          {
            ...carData,
            title,
            slug,
            images: imageUrls,
            created_at: new Date().toISOString(),
            raw_message: message,
          },
        ]);
      if (insertError) throw insertError;
      setSuccess("Car listed successfully!");
      setImages([]);
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Failed to list car.");
    } finally {
      setLoading(false);
    }
  };

  // Responsive layout
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col md:flex-row md:items-start pb-24">
      {/* Left: Chat Composer */}
      <form
        className="w-full md:w-1/2 max-w-2xl mx-auto md:mx-0 bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 mt-8 flex flex-col"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* WhatsApp-style chat input */}
        <div className="mb-6">
          <textarea
            className="w-full h-40 md:h-56 p-4 text-lg bg-neutral-100 dark:bg-neutral-800 rounded-xl resize-none font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Paste car details like WhatsApp format..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            autoFocus
            rows={8}
          />
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(carData)
            .filter(([k, v]) =>
              ["year", "make", "model", "variant", "fuel", "transmission", "price", "km", "color", "owner", "insurance", "reg_no"].includes(k) && v
            )
            .map(([k, v]) => (
              <span
                key={k}
                className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-sm rounded-full border border-neutral-300 dark:border-neutral-600"
              >
                {v}
              </span>
            ))}
          {carData.confidence > 0 && (
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold ml-2">
              {carData.confidence}%
            </span>
          )}
        </div>

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
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width={320}
                  height={240}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
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
              className="aspect-square border-2 border-dashed border-neutral-400 rounded-lg flex items-center justify-center text-2xl text-neutral-500"
              aria-label="Add image"
            >
              +
            </button>
          </div>
        </div>

        {/* Error/Success/Loading */}
        <div className="mt-4 min-h-[24px]">
          {error && <div className="text-red-600 text-sm font-medium mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm font-medium mb-2">{success}</div>}
          {loading && <div className="text-yellow-600 text-sm font-medium mb-2">Listing car...</div>}
        </div>

        {/* Validation UI */}
        {!validation.valid && (
          <div className="text-yellow-600 text-sm font-medium mb-2">
            {validation.errors.join(", ")}
          </div>
        )}
        {carData.confidence < 60 && (
          <div className="text-yellow-600 text-sm font-medium mb-2">
            Please review detected fields
          </div>
        )}

        {/* Sticky Publish Button */}
        <div className="sticky bottom-0 left-0 w-full">
          <button
            type="submit"
            className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canPublish}
          >
            {loading ? (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
            ) : (
              "🚀 Generate Listing"
            )}
          </button>
        </div>
      </form>

      {/* Right: Live Preview */}
      <div className="w-full md:w-1/2 flex justify-center items-start mt-8 md:mt-8">
        <div className="w-full max-w-md mx-auto">
          <CarCard
            car={{
              title,
              price: carData.price,
              brand: carData.make,
              model: carData.model,
              year: carData.year,
              fuel: carData.fuel,
              transmission: carData.transmission,
              owner: carData.owner,
              km: carData.km,
              images: images.map(file => URL.createObjectURL(file)),
              description: title,
              slug,
              preview: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
  const [images, setImages] = useState<File[]>([]);
  const [rawText, setRawText] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleRawText(text: string) {
    setRawText(text);

    // Year
    const yearMatch = text.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) setYear(yearMatch[0]);

    // Fuel
    if (text.toLowerCase().includes("petrol")) setFuel("Petrol");
    if (text.toLowerCase().includes("diesel")) setFuel("Diesel");

    // Price
    const priceMatch = text.match(/\b\d{5,8}\b/);
    if (priceMatch) setPrice(priceMatch[0]);
  }

  useEffect(() => {
    if (brand && model && year) {
      setTitle(`${year} ${brand} ${model} for sale`);
    }
  }, [brand, model, year]);

  useEffect(() => {
    if (brand && model && year && price) {
      setDescription(
        `${year} ${brand} ${model} available for sale. Well maintained vehicle. Price ₹${price}.`
      );
    }
  }, [brand, model, year, price]);

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setImages([...images, ...files]);

    // Optional: OCR on first image
    // await handleImageOCR(files[0]);
  };

  // Optional: Image OCR handler (advanced)
  // async function handleImageOCR(file: File) {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const res = await fetch("/api/ocr", { method: "POST", body: formData });
  //   const data = await res.json();
  //   handleRawText(data.text);
  // }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

// ...existing code...
// ...existing code...