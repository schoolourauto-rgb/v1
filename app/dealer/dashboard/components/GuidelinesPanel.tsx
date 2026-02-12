import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";

export default function GuidelinesPanel() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="image" className="transition-colors hover:bg-muted/40 rounded-lg">
          <AccordionTrigger>📸 Image Quality Rules</AccordionTrigger>
          <AccordionContent>
            Upload clear, well-lit photos showing all angles of the car. Avoid blurry or dark images.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pricing" className="transition-colors hover:bg-muted/40 rounded-lg">
          <AccordionTrigger>💰 Smart Pricing Tips</AccordionTrigger>
          <AccordionContent>
            Research similar listings and price competitively. Highlight unique features to justify value.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="restricted" className="transition-colors hover:bg-muted/40 rounded-lg">
          <AccordionTrigger>🚫 Restricted Listings</AccordionTrigger>
          <AccordionContent>
            Do not post stolen, unregistered, or incomplete vehicles. All cars must have valid documentation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="communication" className="transition-colors hover:bg-muted/40 rounded-lg">
          <AccordionTrigger>📞 Buyer Communication Standards</AccordionTrigger>
          <AccordionContent>
            Respond promptly and professionally to buyer inquiries. Never share personal or sensitive information.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
