"use client";

import React, { useState } from "react";

interface CarFormData {
  title: string;
  price: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  description: string;
  phone: string;
  images: File[];
}


type CarForm = {
  title: string;
  price: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  description: string;
  phone: string;
  images: File[];
}

type CarPreviewModalProps = {
  onClose: () => void;
  onPublish: (car: { title: string; price: number }) => void;
}

const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
const transmissionOptions = ["Manual", "Automatic"];

const CarPreviewModal: React.FC<CarPreviewModalProps> = ({ onClose, onPublish }) => {
  const [form, setForm] = useState<CarForm>({
    title: "",
    price: "",
    brand: "",
    model: "",
    year: "",
    fuel: "",
    transmission: "",
    description: "",
    phone: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10),
    }));
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleImageDelete = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) return;
    onPublish({
      title: form.title.trim(),
      price: Number(form.price),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Car
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background p-3"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background p-3"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-border bg-background p-3"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm mb-2">Images (max 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Publish Car
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CarPreviewModal;
