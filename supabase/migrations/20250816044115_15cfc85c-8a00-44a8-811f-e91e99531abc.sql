-- Update checkin_items to track service needs better
ALTER TABLE public.checkin_items 
ADD COLUMN service_needed boolean DEFAULT false;

-- Create service requests based on checkin items that need service
-- This will be populated when checkin items are marked as needing service
INSERT INTO public.service_approvals (checkin_id, service_description, estimated_cost, approved)
SELECT 
  ci.checkin_id,
  'Service required for: ' || ci.item_key,
  0.00,
  false
FROM public.checkin_items ci
WHERE ci.result = 'service_needed'
AND NOT EXISTS (
  SELECT 1 FROM public.service_approvals sa 
  WHERE sa.checkin_id = ci.checkin_id 
  AND sa.service_description LIKE '%' || ci.item_key || '%'
);