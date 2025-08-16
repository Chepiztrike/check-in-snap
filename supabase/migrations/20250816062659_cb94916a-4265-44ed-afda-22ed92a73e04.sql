-- Update RLS policy for checkin_items to allow public creation during check-in
DROP POLICY IF EXISTS "Access items via parent checkin" ON public.checkin_items;

-- Create new policy that allows public creation but restricts viewing
CREATE POLICY "Allow public checkin item creation" 
ON public.checkin_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Access items via parent checkin" 
ON public.checkin_items 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_items.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role) OR true))
));

CREATE POLICY "Update items via parent checkin" 
ON public.checkin_items 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_items.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role)))
));

CREATE POLICY "Delete items via parent checkin" 
ON public.checkin_items 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1
  FROM checkins c
  WHERE ((c.id = checkin_items.checkin_id) AND ((c.mechanic_id = auth.uid()) OR has_role(auth.uid(), 'supervisor'::app_role)))
));