import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";

export const Tabs = RadixTabs.Root;
Tabs.displayName = "Tabs";
export const TabsList = RadixTabs.List;
export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>((props, ref) => (
  <RadixTabs.Trigger ref={ref} {...props} />
));
export const TabsContent = RadixTabs.Content;
