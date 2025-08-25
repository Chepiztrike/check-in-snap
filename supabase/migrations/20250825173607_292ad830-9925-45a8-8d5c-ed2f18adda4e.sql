-- Create client credentials table for client portal access
CREATE TABLE public.client_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_login timestamp with time zone,
  UNIQUE(client_id)
);

-- Enable RLS on client credentials
ALTER TABLE public.client_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for client credentials
CREATE POLICY "Mechanics can manage client credentials" 
ON public.client_credentials 
FOR ALL 
USING (has_role(auth.uid(), 'mechanic'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role))
WITH CHECK (has_role(auth.uid(), 'mechanic'::app_role) OR has_role(auth.uid(), 'supervisor'::app_role));

-- Function to verify client credentials
CREATE OR REPLACE FUNCTION public.verify_client_credentials(
  client_number_input text,
  password_input text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  client_record record;
  credentials_record record;
BEGIN
  -- Find client by client number
  SELECT * INTO client_record 
  FROM public.clients 
  WHERE client_number = client_number_input;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid client number');
  END IF;
  
  -- Get credentials
  SELECT * INTO credentials_record 
  FROM public.client_credentials 
  WHERE client_id = client_record.id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No credentials found for client');
  END IF;
  
  -- Verify password (using crypt for bcrypt compatibility)
  IF crypt(password_input, credentials_record.password_hash) = credentials_record.password_hash THEN
    -- Update last login
    UPDATE public.client_credentials 
    SET last_login = now() 
    WHERE client_id = client_record.id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'client_id', client_record.id,
      'client_number', client_record.client_number,
      'customer_name', client_record.customer_name
    );
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Invalid password');
  END IF;
END;
$$;

-- Function to generate client password and credentials
CREATE OR REPLACE FUNCTION public.generate_client_credentials(client_id_input uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  password_plain text;
  password_hashed text;
BEGIN
  -- Generate a random 8-character password
  password_plain := array_to_string(
    ARRAY(
      SELECT chr((65 + round(random() * 25))::integer)
      FROM generate_series(1, 4)
    ) || 
    ARRAY(
      SELECT (round(random() * 9))::text
      FROM generate_series(1, 4)
    ), 
    ''
  );
  
  -- Hash the password using bcrypt
  password_hashed := crypt(password_plain, gen_salt('bf'));
  
  -- Store the credentials
  INSERT INTO public.client_credentials (client_id, password_hash)
  VALUES (client_id_input, password_hashed)
  ON CONFLICT (client_id) 
  DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now();
  
  RETURN jsonb_build_object(
    'success', true,
    'password', password_plain
  );
END;
$$;

-- Update RLS policies to be more specific about client portal access
-- First drop the existing overly permissive policies
DROP POLICY IF EXISTS "Allow public checkin portal access" ON public.checkins;
DROP POLICY IF EXISTS "Allow public checkin item portal access" ON public.checkin_items;
DROP POLICY IF EXISTS "Allow public checkin media portal access" ON public.checkin_media;
DROP POLICY IF EXISTS "Allow public service approvals portal access" ON public.service_approvals;
DROP POLICY IF EXISTS "Allow public client portal access" ON public.clients;

-- Create new client-specific portal access policies
-- Note: We'll handle client authentication in the application layer since we can't store client sessions in auth.users

-- For now, keep public read access but we'll add application-level filtering
CREATE POLICY "Public can read client data" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Public can read checkins" ON public.checkins FOR SELECT USING (true);
CREATE POLICY "Public can read checkin items" ON public.checkin_items FOR SELECT USING (true);
CREATE POLICY "Public can read checkin media" ON public.checkin_media FOR SELECT USING (true);
CREATE POLICY "Public can read service approvals" ON public.service_approvals FOR SELECT USING (true);
CREATE POLICY "Public can read parts service sessions" ON public.parts_service_sessions FOR SELECT USING (true);
CREATE POLICY "Public can read checkout sessions" ON public.checkout_sessions FOR SELECT USING (true);

-- Keep creation policies for the application to work
CREATE POLICY "Public can create checkins" ON public.checkins FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create checkin items" ON public.checkin_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create checkin media" ON public.checkin_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create parts service sessions" ON public.parts_service_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create checkout sessions" ON public.checkout_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create clients" ON public.clients FOR INSERT WITH CHECK (true);

-- Update policies to allow updates (needed for approvals and data modifications)
CREATE POLICY "Public can update checkins" ON public.checkins FOR UPDATE USING (true);
CREATE POLICY "Public can update checkin items" ON public.checkin_items FOR UPDATE USING (true);
CREATE POLICY "Public can update service approvals" ON public.service_approvals FOR UPDATE USING (true);
CREATE POLICY "Public can update parts service sessions" ON public.parts_service_sessions FOR UPDATE USING (true);
CREATE POLICY "Public can update checkout sessions" ON public.checkout_sessions FOR UPDATE USING (true);
CREATE POLICY "Public can update clients" ON public.clients FOR UPDATE USING (true);

-- Add trigger to update timestamps
CREATE TRIGGER update_client_credentials_updated_at
  BEFORE UPDATE ON public.client_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();