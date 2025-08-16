-- Add car model and year to checkins table
ALTER TABLE public.checkins 
ADD COLUMN IF NOT EXISTS car_model TEXT,
ADD COLUMN IF NOT EXISTS car_year TEXT;

-- Update existing records with sample data if needed (optional)
UPDATE public.checkins 
SET car_model = 'Not specified', car_year = 'Not specified' 
WHERE car_model IS NULL;