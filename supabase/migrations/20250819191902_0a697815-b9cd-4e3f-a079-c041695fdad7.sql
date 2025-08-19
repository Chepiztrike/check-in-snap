-- Fix RLS policies to allow client creation and public client portal access

-- Allow public client creation (check-in process should work without auth)
DROP POLICY IF EXISTS "Mechanics can manage clients" ON public.clients;

CREATE POLICY "Allow public client creation" ON public.clients
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mechanics can manage clients" ON public.clients
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

CREATE POLICY "Mechanics can update clients" ON public.clients
FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- Allow public checkin creation (check-in process should work without auth)
DROP POLICY IF EXISTS "Mechanics can manage checkins" ON public.checkins;

CREATE POLICY "Allow public checkin creation" ON public.checkins
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mechanics can manage checkins" ON public.checkins
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

CREATE POLICY "Mechanics can update checkins" ON public.checkins
FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- Allow public checkin item creation
DROP POLICY IF EXISTS "Mechanics can manage checkin items" ON public.checkin_items;

CREATE POLICY "Allow public checkin item creation" ON public.checkin_items
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mechanics can manage checkin items" ON public.checkin_items
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

CREATE POLICY "Mechanics can update checkin items" ON public.checkin_items
FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- Allow public checkin media creation
DROP POLICY IF EXISTS "Mechanics can manage checkin media" ON public.checkin_media;

CREATE POLICY "Allow public checkin media creation" ON public.checkin_media
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Mechanics can manage checkin media" ON public.checkin_media
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

CREATE POLICY "Mechanics can update checkin media" ON public.checkin_media
FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- Allow public access to client portal data (clients need to see their own data)
CREATE POLICY "Allow public client portal access" ON public.clients
FOR SELECT 
USING (true);

-- Allow public access to checkin data for client portal
CREATE POLICY "Allow public checkin portal access" ON public.checkins
FOR SELECT 
USING (true);

CREATE POLICY "Allow public checkin items portal access" ON public.checkin_items
FOR SELECT 
USING (true);

CREATE POLICY "Allow public checkin media portal access" ON public.checkin_media
FOR SELECT 
USING (true);

CREATE POLICY "Allow public service approvals portal access" ON public.service_approvals
FOR SELECT 
USING (true);