-- Add missing columns to checkins table for car model and year
ALTER TABLE public.checkins 
ADD COLUMN IF NOT EXISTS car_model text,
ADD COLUMN IF NOT EXISTS car_year text;

-- Update existing records that have null values
UPDATE public.checkins 
SET car_model = 'Not specified', car_year = 'Not specified' 
WHERE car_model IS NULL OR car_year IS NULL;

-- Create parts_service_sessions table for Parts & Service workflow data
CREATE TABLE IF NOT EXISTS public.parts_service_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id),
  vehicle_details jsonb NOT NULL DEFAULT '{}',
  general_media jsonb NOT NULL DEFAULT '[]',
  parts_data jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for parts_service_sessions
ALTER TABLE public.parts_service_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for parts_service_sessions
CREATE POLICY "Allow public access to parts service sessions" 
ON public.parts_service_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create checkout_sessions table for Check-Out workflow data
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id),
  vehicle_details jsonb NOT NULL DEFAULT '{}',
  general_media jsonb NOT NULL DEFAULT '[]',
  checkout_items jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for checkout_sessions
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for checkout_sessions
CREATE POLICY "Allow public access to checkout sessions" 
ON public.checkout_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add update triggers for new tables
CREATE TRIGGER update_parts_service_sessions_updated_at
BEFORE UPDATE ON public.parts_service_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checkout_sessions_updated_at
BEFORE UPDATE ON public.checkout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();