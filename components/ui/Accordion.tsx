import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";

export const Accordion = RadixAccordion.Root;
export const AccordionItem = RadixAccordion.Item;
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>((props, ref) => (
  <RadixAccordion.Trigger ref={ref} {...props} />
));
export const AccordionContent = RadixAccordion.Content;
