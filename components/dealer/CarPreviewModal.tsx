"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface CarPreviewModalProps {
  open: boolean;
  parsedCar: any;
  onClose: () => void;
  onPublish: () => void;
}

export default function CarPreviewModal({ open, parsedCar, onClose, onPublish }: CarPreviewModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [car, setCar] = useState(parsedCar);

  // ...existing code...

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60 backdrop-blur-lg"
        >
          <motion.div
            className="w-full max-w-2xl bg-[#141414] border border-[#C9A227] rounded-t-2xl p-6 shadow-xl"
            style={{background: 'rgba(20,20,20,0.85)', border: '1.5px solid #C9A227'}}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Image slider placeholder */}
            <div className="mb-4">
              {/* ...image slider... */}
            </div>
            {/* Title + Price */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">{car?.make} {car?.model}</h2>
              <span className="text-xl font-bold text-[#C9A227]">₹{car?.price}</span>
            </div>
            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><Input value={car?.regNo} readOnly={!editMode} /></div>
              <div><Input value={car?.year} readOnly={!editMode} /></div>
              <div><Input value={car?.fuel} readOnly={!editMode} /></div>
              <div><Input value={car?.color} readOnly={!editMode} /></div>
              <div><Input value={car?.owner} readOnly={!editMode} /></div>
              <div><Input value={car?.insurance} readOnly={!editMode} /></div>
              <div><Input value={car?.transmission || "Manual"} readOnly={!editMode} /></div>
              <div><Input value={car?.km} readOnly={!editMode} /></div>
            </div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#C9A227] text-black font-semibold">{car?.insurance}</span>
              <span className="px-3 py-1 rounded-full bg-[#C9A227] text-black font-semibold">{car?.transmission || "Manual"}</span>
              <span className="px-3 py-1 rounded-full bg-[#C9A227] text-black font-semibold">Owner: {car?.owner}</span>
            </div>
            {/* reCAPTCHA placeholder */}
            <div className="mb-4">
              {/* ...reCAPTCHA... */}
            </div>
            {/* Modal buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>{editMode ? "Save" : "Edit"}</Button>
              <Button className="bg-gradient-to-r from-[#C9A227] to-[#FFD700] text-black font-bold px-6 py-2 rounded-lg shadow" onClick={onPublish}>Publish Car</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
