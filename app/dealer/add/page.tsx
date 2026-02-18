
"use client";

import { useState, useEffect } from "react";

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>

      <form className="grid md:grid-cols-2 gap-6">

        <textarea
          placeholder="Paste OLX / WhatsApp car details here..."
          value={rawText}
          onChange={(e) => handleRawText(e.target.value)}
          className="input col-span-2"
        />

        <input
          placeholder="Brand"
          className="input"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
        <input
          placeholder="Model"
          className="input"
          value={model}
          onChange={e => setModel(e.target.value)}
        />
        <input
          placeholder="Year"
          type="number"
          className="input"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          className="input"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          placeholder="Fuel Type"
          className="input"
          value={fuel}
          onChange={e => setFuel(e.target.value)}
        />
        <input
          placeholder="Transmission"
          className="input"
          value={transmission}
          onChange={e => setTransmission(e.target.value)}
        />

        <input
          placeholder="Title"
          className="input col-span-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="input col-span-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="block mb-2 font-semibold">Car Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="mb-4"
          />

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded-lg object-cover h-24 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="col-span-2 bg-yellow-500 text-black py-3 rounded-lg font-semibold">
          Add Car
        </button>
      </form>
    </div>
  );
}