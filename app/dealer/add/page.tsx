"use client";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';

export default function AddCarPage() {
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

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen pb-24">
      <form
        className="max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 mt-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setSuccess("");
          setError("");
          // Validation
          if (!title.trim() || !price.trim() || images.length === 0) {
            setError("Title, price, and at least one image are required.");
            setLoading(false);
            return;
          }
          try {
            const supabase = createClient();
            // Upload images
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
            // Insert car
            const { error: insertError } = await supabase
              .from("cars")
              .insert([
                {
                  title,
                  price,
                  description,
                  brand,
                  model,
                  year,
                  fuel,
                  transmission,
                  images: imageUrls,
                  created_at: new Date().toISOString(),
                },
              ]);
            if (insertError) throw insertError;
            setSuccess("Car listed successfully!");
            setImages([]);
            setTitle("");
            setPrice("");
            setDescription("");
            setBrand("");
            setModel("");
            setYear("");
            setFuel("");
            setTransmission("");
            setRawText("");
          } catch (err: any) {
            setError(err?.message || "Failed to list car.");
          } finally {
            setLoading(false);
          }
        }}
        noValidate
      >
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

        {/* Chat Style Inputs */}
        <div className="space-y-4 px-4">
          <input
            className="w-full p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
            placeholder="Car Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            type="number"
            min="0"
          />
          <textarea
            className="w-full p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={4}
          />
        </div>

        {/* Error/Success/Loading */}
        <div className="mt-4 min-h-[24px]">
          {error && <div className="text-red-600 text-sm font-medium mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm font-medium mb-2">{success}</div>}
          {loading && <div className="text-yellow-600 text-sm font-medium mb-2">Listing car...</div>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition"
          disabled={loading}
        >
          🚀 Publish Listing
        </button>
      </form>
    </div>
  );
}