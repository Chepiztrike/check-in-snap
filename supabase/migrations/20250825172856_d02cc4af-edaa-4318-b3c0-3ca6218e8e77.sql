-- Add unique constraint on client_id to prevent duplicate parts service sessions
ALTER TABLE public.parts_service_sessions 
ADD CONSTRAINT parts_service_sessions_client_id_unique UNIQUE (client_id);