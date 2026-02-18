import { z } from "zod";

export const carSchema = z.object({
  title: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().gte(1990),
  price: z.number().int().positive(),
  fuel_type: z.string(),
  transmission: z.string(),
  city: z.string(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});
