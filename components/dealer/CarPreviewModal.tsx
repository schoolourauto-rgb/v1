"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, useRef } from "react";

interface CarPreviewModalProps {
  open: boolean;
  parsedCar: any;
  onClose: () => void;
  onPublish: () => void;
}

  const [editMode, setEditMode] = useState(false);
  const [car, setCar] = useState(parsedCar);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate previews and clean up URLs
  useEffect(() => {
    if (!images.length) {
      setImagePreviews([]);
      return;
    }
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Autofill attributes for inputs
  const autofill = {
    business_name: 'organization',
    owner_name: 'name',
    mobile: 'tel',
    email: 'email',
    price: 'off',
  };

  // Focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 supports-[backdrop-filter]:bg-background/80"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="w-full max-w-3xl bg-background border border-border rounded-2xl p-6 shadow-xl outline-none"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Image Preview Grid */}
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-border">
                    <img src={url} alt="preview" className="w-full h-28 object-cover rounded-xl hover:opacity-80 transition" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition min-h-[112px]">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => {
                        if (!e.target.files) return;
                        const files = Array.from(e.target.files);
                        setImages(prev => [...prev, ...files].slice(0, 10));
                      }}
                      aria-label="Add images"
                    />
                    <span className="text-2xl text-muted-foreground">+</span>
                  </label>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">You can upload up to 10 images.</div>
            </div>
            {/* Title + Price */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-foreground">{car?.make} {car?.model}</h2>
              <span className="text-xl font-bold text-primary">₹{car?.price}</span>
            </div>
            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><Input name="regNo" value={car?.regNo} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="year" value={car?.year} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="fuel" value={car?.fuel} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="color" value={car?.color} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="owner" value={car?.owner} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="insurance" value={car?.insurance} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="transmission" value={car?.transmission || "Manual"} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
              <div><Input name="km" value={car?.km} readOnly={!editMode} autoComplete="off" className="placeholder:text-muted-foreground" /></div>
            </div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">{car?.insurance}</span>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">{car?.transmission || "Manual"}</span>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">Owner: {car?.owner}</span>
            </div>
            {/* reCAPTCHA placeholder */}
            <div className="mb-4">
              {/* ...reCAPTCHA... */}
            </div>
            {/* Modal buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={onClose} className="rounded-xl border border-border bg-muted/30">Cancel</Button>
              <Button variant="secondary" onClick={() => setEditMode(!editMode)} className="rounded-xl border border-border bg-muted/30">{editMode ? "Save" : "Edit"}</Button>
              <Button className="rounded-xl bg-primary text-primary-foreground px-6 py-2 font-bold shadow" onClick={onPublish}>Publish Car</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
