-- EMERGENCY SECURITY FIX: Remove dangerous public access policies
-- These policies currently allow ANYONE to access all sensitive data

-- Drop all existing public access policies
DROP POLICY IF EXISTS "Allow public client creation" ON public.clients;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.clients;
DROP POLICY IF EXISTS "Allow public checkin creation" ON public.checkins;
DROP POLICY IF EXISTS "Allow public checkin item creation" ON public.checkin_items;
DROP POLICY IF EXISTS "Allow public checkin media creation" ON public.checkin_media;
DROP POLICY IF EXISTS "Allow public service approval access" ON public.service_approvals;
DROP POLICY IF EXISTS "Allow public access to parts service sessions" ON public.parts_service_sessions;
DROP POLICY IF EXISTS "Allow public access to checkout sessions" ON public.checkout_sessions;

-- Create secure RLS policies that require authentication

-- CLIENTS: Only mechanics and supervisors can manage clients
CREATE POLICY "Mechanics can manage clients" ON public.clients
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- CHECKINS: Only mechanics and supervisors can manage checkins
CREATE POLICY "Mechanics can manage checkins" ON public.checkins
FOR ALL TO authenticated  
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- CHECKIN ITEMS: Only mechanics and supervisors can manage checkin items
CREATE POLICY "Mechanics can manage checkin items" ON public.checkin_items
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- CHECKIN MEDIA: Only mechanics and supervisors can manage checkin media
CREATE POLICY "Mechanics can manage checkin media" ON public.checkin_media
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- SERVICE APPROVALS: Only mechanics and supervisors can manage service approvals
CREATE POLICY "Mechanics can manage service approvals" ON public.service_approvals
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- PARTS SERVICE SESSIONS: Only mechanics and supervisors can manage parts service sessions
CREATE POLICY "Mechanics can manage parts service sessions" ON public.parts_service_sessions
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- CHECKOUT SESSIONS: Only mechanics and supervisors can manage checkout sessions
CREATE POLICY "Mechanics can manage checkout sessions" ON public.checkout_sessions
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'mechanic'::app_role) OR 
  has_role(auth.uid(), 'supervisor'::app_role)
);

-- Add mechanic role to enum if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('mechanic', 'supervisor');
    ELSE
        -- Add mechanic if it doesn't exist
        BEGIN
            ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'mechanic';
        EXCEPTION 
            WHEN duplicate_object THEN null;
        END;
    END IF;
END $$;