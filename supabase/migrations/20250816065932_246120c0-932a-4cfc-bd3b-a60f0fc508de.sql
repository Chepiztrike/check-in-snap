-- Create a demo mechanic user using Supabase Admin API approach
-- First, let's use a simpler approach by creating the user through auth.users table

INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  instance_id
) VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated', 
  'mechanic@autocheck.com',
  crypt('mechanic123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo Mechanic"}',
  false,
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (email) DO NOTHING;

-- Also create an identity record
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'mechanic@autocheck.com'),
  '{"sub": "' || (SELECT id FROM auth.users WHERE email = 'mechanic@autocheck.com')::text || '", "email": "mechanic@autocheck.com"}',
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, id) DO NOTHING;