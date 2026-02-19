// lib/parser/types.ts
export interface CarData {
  year?: number;
  make?: string;
  model?: string;
  variant?: string;
  fuel?: "Petrol" | "Diesel" | "CNG" | "EV";
  transmission?: "Manual" | "Automatic";
  price?: number | string;
  km?: number | string;
  color?: string;
  owner?: string;
  insurance?: string;
  reg_no?: string;
  confidence: number;
}
