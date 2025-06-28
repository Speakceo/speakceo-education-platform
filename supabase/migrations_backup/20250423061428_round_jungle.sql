/*
  # Add attendees column to live_classes table

  1. Changes
    - Add `attendees` column to `live_classes` table with default value of 0
    - Add `max_attendees` column to `live_classes` table with default value of 30

  2. Notes
    - Both columns are nullable to maintain compatibility with existing records
    - Default values ensure data consistency for new records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_classes' AND column_name = 'attendees'
  ) THEN
    ALTER TABLE live_classes ADD COLUMN attendees integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'live_classes' AND column_name = 'max_attendees'
  ) THEN
    ALTER TABLE live_classes ADD COLUMN max_attendees integer DEFAULT 30;
  END IF;
END $$;