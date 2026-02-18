
"use client";

import { useState } from "react";

export default function AddCarPage() {
  const [images, setImages] = useState<File[]>([]);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Car</h1>

      <form className="grid md:grid-cols-2 gap-6">

        <input placeholder="Brand" className="input" />
        <input placeholder="Model" className="input" />
        <input placeholder="Year" type="number" className="input" />
        <input placeholder="Price" type="number" className="input" />
        <input placeholder="Fuel Type" className="input" />
        <input placeholder="Transmission" className="input" />

        <textarea
          placeholder="Description"
          className="input col-span-2"
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