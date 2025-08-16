-- Improve the client number generation function to handle concurrent calls better
CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
  current_year INTEGER;
  max_existing INTEGER;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW());
  
  -- Get the maximum existing number for this year
  SELECT COALESCE(
    MAX(CAST(SPLIT_PART(client_number, '-', 3) AS INTEGER)), 
    0
  ) INTO max_existing
  FROM public.clients 
  WHERE client_number LIKE 'CLT-' || current_year || '-%';
  
  -- Start from the next number
  counter := max_existing + 1;
  
  -- Try up to 1000 attempts to find a unique number
  FOR i IN 1..1000 LOOP
    new_number := 'CLT-' || current_year || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Check if this number exists
    IF NOT EXISTS (SELECT 1 FROM public.clients WHERE client_number = new_number) THEN
      RETURN new_number;
    END IF;
    
    counter := counter + 1;
  END LOOP;
  
  -- If we couldn't find a unique number, add timestamp
  new_number := 'CLT-' || current_year || '-' || LPAD(counter::TEXT, 4, '0') || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
  RETURN new_number;
END;
$$;