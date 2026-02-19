import { SupportTicketCard } from "./support-ticket-card";
import React from "react";

export type Ticket = {
  id: string;
  title: string;
  status: "open" | "closed" | "pending";
  description: string;
  createdAt: string;
};

export function SupportTicketList({ tickets, className }: { tickets: Ticket[]; className?: string }) {
  return (
    <div className={"space-y-4 " + (className || "") }>
      {tickets.map((ticket) => (
        <SupportTicketCard key={ticket.id} {...ticket} />
      ))}
    </div>
  );
}
