"use client";

import { useState } from "react";
import { parseCarMessage } from "@/lib/carParser";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  onParse: (parsedCar: any) => void;
}

export default function ChatInput({ onParse }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handlePaste = () => {
    const parsed = parseCarMessage(input);
    if (parsed && parsed.regNo) {
      onParse(parsed);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 w-full bg-[#141414] border-t border-[#C9A227] flex items-center px-4 py-3 gap-2" style={{backdropFilter: 'blur(8px)'}}>
      <label className="flex items-center cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files) setImages(Array.from(e.target.files));
          }}
        />
        <span className="text-xl text-[#C9A227] mr-2">📎</span>
      </label>
      <input
        className="flex-1 bg-transparent text-white placeholder:text-[#C9A227] border-none outline-none px-2"
        placeholder="Paste details here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onPaste={handlePaste}
      />
      <Button
        className="bg-gradient-to-r from-[#C9A227] to-[#FFD700] text-black font-bold px-4 py-2 rounded-lg shadow"
        onClick={handlePaste}
        type="button"
      >
        ➤
      </Button>
    </div>
  );
}
