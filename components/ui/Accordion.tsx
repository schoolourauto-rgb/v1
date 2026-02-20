import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";

const Accordion = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Root>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>
>((props, ref) => <RadixAccordion.Root ref={ref} {...props} />);
Accordion.displayName = "Accordion";
export { Accordion };
export const AccordionItem = RadixAccordion.Item;
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>((props, ref) => (
  <RadixAccordion.Trigger ref={ref} {...props} />
));
export const AccordionContent = RadixAccordion.Content;
