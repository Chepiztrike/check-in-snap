-- Create storage policies for checkins bucket to allow public uploads
CREATE POLICY "Allow public uploads to checkins bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'checkins');

CREATE POLICY "Allow public access to checkins bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'checkins');

-- Check the current constraint on checkin_items.result and remove it if it's too restrictive
ALTER TABLE public.checkin_items DROP CONSTRAINT IF EXISTS checkin_items_result_check;

-- Create a more flexible constraint that allows the values being used
ALTER TABLE public.checkin_items 
ADD CONSTRAINT checkin_items_result_check 
CHECK (result IN ('passed', 'failed', 'service_needed', 'na'));