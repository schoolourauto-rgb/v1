"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  price: number
  status: 'draft' | 'active' | 'sold'
  created_at: string
}

export default function DealerDashboardPage() {
  const supabase = createClient()
  const [cars, setCars] = useState<Car[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('dealer_id', user.id)
        .order('created_at', { ascending: false })
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*, cars(name, brand, model, year)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
      if (carsError) {
        console.error('Error fetching cars:', carsError)
      } else {
        setCars(carsData || [])
      }
      if (leadsError) {
        console.error('Error fetching leads:', leadsError)
      } else {
        setLeads(leadsData || [])
      }
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalCars = cars.length
  const activeCars = cars.filter((c) => c.status === 'active').length
  const draftCars = cars.filter((c) => c.status === 'draft').length
  const totalLeads = leads.length
  const leadsThisMonth = leads.filter(l => new Date(l.created_at).getMonth() === new Date().getMonth()).length
  const isUnlocked = totalCars >= 6

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dealer Dashboard</h1>
          <p className="text-muted-foreground">Manage your car inventory</p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Total Cars</p>
                                <p className="text-4xl font-bold mt-2">{totalCars}</p>
                              </div>
                              <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Active Listings</p>
                                <p className="text-4xl font-bold mt-2 text-green-500">{activeCars}</p>
                              </div>
                              <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Drafts</p>
                                <p className="text-4xl font-bold mt-2 text-yellow-500">{draftCars}</p>
                              </div>
                              <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Total Leads</p>
                                <p className="text-4xl font-bold mt-2 text-blue-500">{totalLeads}</p>
                              </div>
                              <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                                <p className="text-muted-foreground text-sm font-medium">Leads This Month</p>
                                <p className="text-4xl font-bold mt-2 text-purple-500">{leadsThisMonth}</p>
                              </div>
                            </div>
                            {/* Leads Table */}
                            <div className="mt-16">
                              <h2 className="text-2xl font-bold mb-6">Leads</h2>
                              {loading ? (
                                <div className="text-center py-12">
                                  <p className="text-zinc-400">Loading leads...</p>
                                </div>
                              ) : leads.length === 0 ? (
                                <div className="bg-card text-card-foreground border border-border p-12 rounded-xl shadow-sm text-center">
                                  <p className="text-muted-foreground mb-4">No leads received yet</p>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr className="bg-muted">
                                        <th className="px-4 py-2 text-left">Car</th>
                                        <th className="px-4 py-2 text-left">Buyer Name</th>
                                        <th className="px-4 py-2 text-left">Phone</th>
                                        <th className="px-4 py-2 text-left">Message</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {leads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-border">
                                          <td className="px-4 py-2">
                                            {lead.cars?.name} ({lead.cars?.brand} {lead.cars?.model} {lead.cars?.year})
                                          </td>
                                          <td className="px-4 py-2">{lead.buyer_name}</td>
                                          <td className="px-4 py-2">{lead.buyer_phone}</td>
                                          <td className="px-4 py-2">{lead.buyer_message}</td>
                                          <td className="px-4 py-2">{new Date(lead.created_at).toLocaleString()}</td>
                                          <td className="px-4 py-2">
                                            <span className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-300">New</span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }


