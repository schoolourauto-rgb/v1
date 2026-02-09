export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          business_name: string
          owner_name: string
          mobile: string
          role: 'dealer' | 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      cars: {
        Row: {
          id: string
          dealer_id: string
          name: string
          brand: string
          model: string
          year: number
          price: number
          mileage: number
          fuel_type: string
          transmission: string
          color?: string
          description?: string
          status: 'draft' | 'active' | 'sold'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cars']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cars']['Insert']>
      }
      car_images: {
        Row: {
          id: string
          car_id: string
          image_url: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['car_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['car_images']['Insert']>
      }
    }
  }
}
