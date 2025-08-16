-- Fix RLS policies for check-ins to allow creation without authentication requirement for demo
-- Update clients table policies to allow public creation
DROP POLICY IF EXISTS "Mechanics and supervisors can manage clients" ON public.clients;
CREATE POLICY "Allow public client creation" 
ON public.clients 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update checkins table policies to allow public creation
DROP POLICY IF EXISTS "Mechanics can CRUD own checkins" ON public.checkins;
CREATE POLICY "Allow public checkin creation" 
ON public.checkins 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update service_approvals policies
DROP POLICY IF EXISTS "Access approvals via checkin" ON public.service_approvals;
CREATE POLICY "Allow public service approval access" 
ON public.service_approvals 
FOR ALL 
USING (true)
WITH CHECK (true);