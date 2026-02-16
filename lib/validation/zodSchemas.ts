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
  // ...add other fields as needed
});

export const SignupSchema = z.object({
  business_name: z.string().min(3),
  contact_person: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/),
  email: z.string().email(),
  password: z.string().min(6),
  location: z.string().min(5),
  referral_code: z.string().optional(),
});
