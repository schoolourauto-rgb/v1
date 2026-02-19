"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { FormCard } from "@/components/ui/form-card"
import { FormLabel } from "@/components/ui/form-label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SupportTicketList } from "@/components/ui/support-ticket-list"


const dummyTickets: Ticket[] = [
  {
    id: "1",
    title: "Unable to upload car image",
    status: "open",
    description: "Image upload fails with error.",
    createdAt: "2026-02-18 10:30",
  },
  {
    id: "2",
    title: "Car listing not visible",
    status: "closed",
    description: "My car is not showing in search results.",
    createdAt: "2026-02-15 14:12",
  },
]

import type { Ticket } from "@/components/ui/support-ticket-list";

export default function DealerSupportPage() {
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>(dummyTickets)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement)?.value || "";
    setTimeout(() => {
      setTickets([
        {
          id: (tickets.length + 1).toString(),
          title: getValue("title"),
          status: "pending",
          description: getValue("description"),
          createdAt: new Date().toLocaleString(),
        },
        ...tickets,
      ]);
      setLoading(false);
      form.reset();
    }, 1200);
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <FormCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FormLabel>Ticket Title</FormLabel>
              <Input name="title" placeholder="Issue title" required />
            </div>
            <div>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" placeholder="Describe your issue..." required rows={4} />
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </FormCard>
        <SupportTicketList tickets={tickets} />
      </div>
    </DashboardLayout>
  )
}
