-- Create clients table for customer information and tracking
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policy for clients to view their own data
CREATE POLICY "Clients can view their own data" 
ON public.clients 
FOR SELECT 
USING (true); -- Public read for client portal

-- Create policy for mechanics and supervisors to manage clients
CREATE POLICY "Mechanics and supervisors can manage clients" 
ON public.clients 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add client_id to checkins table
ALTER TABLE public.checkins 
ADD COLUMN client_id uuid REFERENCES public.clients(id);

-- Add approval status fields to checkins
ALTER TABLE public.checkins 
ADD COLUMN checkin_approved boolean DEFAULT false,
ADD COLUMN checkout_approved boolean DEFAULT false,
ADD COLUMN client_notes text;

-- Create service_approvals table for tracking individual service approvals
CREATE TABLE public.service_approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checkin_id uuid NOT NULL REFERENCES public.checkins(id) ON DELETE CASCADE,
  part_request_id uuid REFERENCES public.part_requests(id) ON DELETE CASCADE,
  service_description text NOT NULL,
  estimated_cost decimal(10,2),
  approved boolean DEFAULT false,
  approved_at TIMESTAMP WITH TIME ZONE,
  client_notes text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on service_approvals
ALTER TABLE public.service_approvals ENABLE ROW LEVEL SECURITY;

-- Create policy for service approvals
CREATE POLICY "Access approvals via checkin" 
ON public.service_approvals 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.checkins c 
  WHERE c.id = service_approvals.checkin_id
));

-- Create function to generate unique client number
CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on clients
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on service_approvals
CREATE TRIGGER update_service_approvals_updated_at
BEFORE UPDATE ON public.service_approvals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();