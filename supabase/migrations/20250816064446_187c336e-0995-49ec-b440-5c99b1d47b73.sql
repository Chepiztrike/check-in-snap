-- Fix checkin_media media_type constraint
ALTER TABLE public.checkin_media DROP CONSTRAINT IF EXISTS checkin_media_media_type_check;

-- Create a more flexible constraint that allows common media types
ALTER TABLE public.checkin_media 
ADD CONSTRAINT checkin_media_media_type_check 
CHECK (media_type IN ('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime', 'image', 'video'));

-- Create a simple mechanic user in auth.users table for testing (if needed)
-- We'll handle auth in the frontend with hardcoded credentials