
"use client"

import { useState } from "react"

interface DashboardTabsProps {
  cars: any[]
}

export default function DashboardTabs({ cars }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("cars")

  const activeCount = cars?.filter((c) => c.status === "active").length || 0
  const soldCount = cars?.filter((c) => c.status === "sold").length || 0

  return (
    <div className="w-full">
      <div className="flex gap-6 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("cars")}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === "cars"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Posted Cars ({activeCount})
        </button>

        <button
          onClick={() => setActiveTab("sold")}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === "sold"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sold ({soldCount})
        </button>
      </div>

      <div>
        {activeTab === "cars" && (
          <div className="text-muted-foreground">
            Active cars list will render here.
          </div>
        )}

        {activeTab === "sold" && (
          <div className="text-muted-foreground">
            Sold cars list will render here.
          </div>
        )}
      </div>
    </div>
  )
}
