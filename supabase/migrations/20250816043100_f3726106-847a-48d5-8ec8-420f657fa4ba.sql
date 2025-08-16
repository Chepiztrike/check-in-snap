-- Make mechanic_id nullable in checkins table to allow demo usage without authentication
ALTER TABLE public.checkins 
ALTER COLUMN mechanic_id DROP NOT NULL;