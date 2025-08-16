-- Fix function search path security issue
CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_number := 'CLT-' || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '-' || LPAD(counter::TEXT, 4, '0');
    
    IF NOT EXISTS (SELECT 1 FROM public.clients WHERE client_number = new_number) THEN
      RETURN new_number;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$;