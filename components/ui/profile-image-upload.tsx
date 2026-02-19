import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface ProfileImageUploadProps {
  image?: string;
  onDrop: (file: File) => void;
  loading?: boolean;
}

export function ProfileImageUpload({ image, onDrop, loading }: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer",
        loading && "opacity-60 pointer-events-none"
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && onDrop(e.target.files[0])}
        disabled={loading}
      />
      <img
        src={image || "/default-avatar.png"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">Change Photo</span>
    </div>
  );
}
