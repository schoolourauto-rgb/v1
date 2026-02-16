-- Add indexes for referral_code and referred_by columns in dealers table
CREATE INDEX IF NOT EXISTS idx_dealers_referral_code
ON dealers(referral_code);

CREATE INDEX IF NOT EXISTS idx_dealers_referred_by
ON dealers(referred_by);
