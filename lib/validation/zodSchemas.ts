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
  businessName: z.string().min(1),
  ownerName: z.string().min(1),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});
