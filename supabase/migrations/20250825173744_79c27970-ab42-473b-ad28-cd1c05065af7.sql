-- Fix function search path security issues
-- Update verify_client_credentials function to set search_path
CREATE OR REPLACE FUNCTION public.verify_client_credentials(
  client_number_input text,
  password_input text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update generate_client_credentials function to set search_path
CREATE OR REPLACE FUNCTION public.generate_client_credentials(client_id_input uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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