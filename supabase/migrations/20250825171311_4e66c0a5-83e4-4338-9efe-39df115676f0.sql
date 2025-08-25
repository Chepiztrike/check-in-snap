-- Fix security warnings by setting search_path for functions

-- Fix validate_complete_client function
CREATE OR REPLACE FUNCTION public.validate_complete_client()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow "Pending" temporarily but warn about incomplete data
  IF NEW.customer_name = 'Pending' THEN
    -- Log a warning but don't block the insert
    RAISE NOTICE 'Client created with pending status: %', NEW.client_number;
  END IF;
  
  -- Prevent empty/null essential fields in completed records
  IF NEW.customer_name != 'Pending' AND (
    NEW.customer_name IS NULL OR 
    NEW.customer_name = '' OR
    NEW.client_number IS NULL OR
    NEW.client_number = ''
  ) THEN
    RAISE EXCEPTION 'Complete client records must have customer_name and client_number';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Fix cleanup_pending_clients function
CREATE OR REPLACE FUNCTION public.cleanup_pending_clients()
RETURNS TABLE(cleaned_count INTEGER) AS $$
DECLARE
  count_cleaned INTEGER;
BEGIN
  -- Delete pending clients older than 24 hours that have no associated checkins
  DELETE FROM public.clients 
  WHERE customer_name = 'Pending' 
    AND created_at < NOW() - INTERVAL '24 hours'
    AND id NOT IN (SELECT DISTINCT client_id FROM public.checkins WHERE client_id IS NOT NULL);
  
  GET DIAGNOSTICS count_cleaned = ROW_COUNT;
  RETURN QUERY SELECT count_cleaned;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Fix get_incomplete_clients function
CREATE OR REPLACE FUNCTION public.get_incomplete_clients()
RETURNS TABLE(
  id UUID,
  client_number TEXT,
  customer_name TEXT,
  created_at TIMESTAMPTZ,
  has_checkin BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.client_number,
    c.customer_name,
    c.created_at,
    EXISTS(SELECT 1 FROM public.checkins ch WHERE ch.client_id = c.id) as has_checkin
  FROM public.clients c
  WHERE c.customer_name = 'Pending' OR c.customer_name = '' OR c.customer_name IS NULL
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;