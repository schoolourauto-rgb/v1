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
import React from "react";
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
    <React.Fragment>
      {/* --- Smart Paste Vehicle Details Section --- */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Smart Paste Vehicle Details</h2>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Paste full WhatsApp vehicle message here..."
          className="w-full min-h-[150px] rounded-lg border border-border bg-background p-3 text-base resize-none"
        />
        <button
          type="button"
          onClick={() => {
            // --- Senior-level strong parser ---
            const extract = (label: string, regex: RegExp) => {
              return rawInput.match(regex)?.[1]?.trim() || "";
            };
            const year = extract("Year", /Year\s*[:-]\s*(\d{4})/i);
            const make = extract("Make", /Make\s*[:-]\s*(.*)/i);
            const model = extract("Model", /Model\s*[:-]\s*(.*)/i);
            const version = extract("Version", /Version\s*[:-]\s*(.*)/i);
            const fuel = extract("Fuel", /Fuel\s*[:-]\s*(.*)/i);
            const colour = extract("Colour", /Colour\s*[:-]\s*(.*)/i);
            const owner = extract("Owner", /Owner\s*[:-]\s*(.*)/i);
            const insurance = extract("Insurance", /Insurance\s*[:-]\s*(.*)/i);
            let km = extract("KM", /K\/?m\s*[:-]\s*(.*)/i);
            let price = extract("Price", /Price\s*[:-]\s*(.*)/i);
            // Clean price: remove commas, /-, spaces
            let cleanedPrice = price.replace(/[,\/-]/g, "").replace(/\s/g, "");
            // Clean km: remove text like 'Genuine', commas, spaces
            let cleanedKm = km.replace(/Genuine/gi, "").replace(/[,]/g, "").replace(/\s/g, "");
            // Title generation
            let title = `${year} ${make} ${model} ${version} ${fuel}`.replace(/\s+/g, " ").trim();
            // Fallback: if title is blank, use first non-empty line
            if (!title || title === "") {
              const lines = rawInput.split("\n").map(l => l.trim()).filter(l => l);
              title = lines[0] || "";
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
          }}
          className="mt-3 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90"
        >
          Analyze & Fill Details
        </button>
      </div>
      {/* --- Existing Form Section --- */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
    </React.Fragment>
  );
}
