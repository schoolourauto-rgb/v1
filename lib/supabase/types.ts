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
      dealer_wallet: {
        Row: {
          dealer_id: string
          featured_credits: number
          first_car_published: boolean
          total_reward_credits: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['dealer_wallet']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['dealer_wallet']['Insert']>
      }
      dealers: {
        Row: {
          id: string
          user_id: string
          dealership_name: string
          phone: string | null
          location: string | null
          verified: boolean
          created_at: string
          referral_code: string | null
          referred_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['dealers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['dealers']['Insert']>
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
