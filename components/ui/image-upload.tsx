import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: { url: string; id: string; isPrimary?: boolean }[];
  onDrop: (files: FileList) => void;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
  loading?: boolean;
}

export function ImageUpload({ images, onDrop, onRemove, onSetPrimary, loading }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all",
          loading && "opacity-60 pointer-events-none"
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onDrop(e.target.files)}
          disabled={loading}
        />
        <span className="text-gray-500 dark:text-gray-400 text-sm">Drag & Drop or Click to Upload</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.url}
              alt="Car"
              className={cn(
                "w-full h-28 object-cover rounded-xl border-2",
                img.isPrimary
                  ? "border-black dark:border-white"
                  : "border-transparent group-hover:border-neutral-400 dark:group-hover:border-neutral-600"
              )}
              onClick={() => onSetPrimary(img.id)}
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-white dark:bg-neutral-900 rounded-full p-1 shadow hover:bg-red-100 dark:hover:bg-red-900 transition"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(img.id);
              }}
              aria-label="Remove image"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path d="M6 6l6 6M12 6l-6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {img.isPrimary && (
              <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">Primary</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
