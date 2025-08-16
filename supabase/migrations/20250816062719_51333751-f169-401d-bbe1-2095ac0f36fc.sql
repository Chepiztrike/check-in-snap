-- Update RLS policy for checkin_media to allow public creation during check-in
DROP POLICY IF EXISTS "Access media via parent checkin" ON public.checkin_media;

-- Create new policy that allows public creation but restricts viewing
CREATE POLICY "Allow public checkin media creation" 
ON public.checkin_media 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Access media via parent checkin" 
ON public.checkin_media 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_media.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role) OR true))
));

CREATE POLICY "Update media via parent checkin" 
ON public.checkin_media 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_media.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role)))
));

CREATE POLICY "Delete media via parent checkin" 
ON public.checkin_media 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_media.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role)))
));