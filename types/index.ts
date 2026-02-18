
import { Database } from "@/lib/supabase/types"


export type Car = Database["public"]["Tables"]["cars"]["Row"]
export type CarImage = Database["public"]["Tables"]["car_images"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]


export type Dealer = any;

// For relational selects
export type CarWithImages = Car & { car_images: CarImage[]; location?: string }
