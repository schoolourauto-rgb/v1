import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";

const Tabs = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Root>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Root>
>((props, ref) => <RadixTabs.Root ref={ref} {...props} />);
Tabs.displayName = "Tabs";
export { Tabs };
export const TabsList = RadixTabs.List;
export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>((props, ref) => (
  <RadixTabs.Trigger ref={ref} {...props} />
));
export const TabsContent = RadixTabs.Content;
