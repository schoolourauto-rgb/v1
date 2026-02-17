-- Create fraud_flags table for admin intelligence
CREATE TABLE IF NOT EXISTS fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  type TEXT,
  severity INT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);