-- Dealer notification settings migration
ALTER TABLE dealers
ADD COLUMN IF NOT EXISTS notification_settings jsonb DEFAULT '{
  "chat": true,
  "lead": false,
  "sold": false,
  "weekly": false,
  "system": true
}';

-- Ensure all existing rows get default values
UPDATE dealers
SET notification_settings = COALESCE(notification_settings, '{
  "chat": true,
  "lead": false,
  "sold": false,
  "weekly": false,
  "system": true
}');
