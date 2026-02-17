-- Add trust_score to dealers if not exists
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS trust_score INT DEFAULT 100;