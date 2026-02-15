import { z } from "zod";

export const CarSchema = z.object({
  title: z.string().min(3),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().gte(1900),
  price: z.number().positive(),
  fuel_type: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});
