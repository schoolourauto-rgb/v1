-- Add notification_settings column to dealers table
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS notification_settings jsonb DEFAULT '{}'::jsonb;
