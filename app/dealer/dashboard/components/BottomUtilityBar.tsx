import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BottomUtilityBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full supports-[backdrop-filter]:bg-background/60 bg-background/80 backdrop-blur-xl border-t border-border z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Input placeholder="Paste details here..." className="flex-1 rounded-xl" />
        <Button className="rounded-xl shadow-md hover:scale-[1.02] transition-all ml-2 w-12 h-12 flex items-center justify-center text-lg">
          &rarr;
        </Button>
      </div>
    </div>
  );
}
