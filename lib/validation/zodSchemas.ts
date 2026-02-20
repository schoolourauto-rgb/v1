import { z } from "zod";

export const LeadSchema = z.object({
  car_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20),
  message: z.string().max(500).optional().nullable(),
});

export const CarInsertSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  price: z.number().positive(),
  plate_number: z.string().min(1),
  plate_verified: z.boolean().optional().default(false),
  plate_confidence: z.number().optional(),
  image_ocr_text: z.string().optional(),
  // ...add other fields as needed
});

export const signupSchema = z.object({
    business_name: z.string().min(2),
    owner_name: z.string().min(2),
    mobile: z.string().regex(/^\d{10}$/),
    email: z.string().email(),
    password: z.string().min(6),
    location: z.string().min(2),
    // referral_code removed
}).passthrough();
