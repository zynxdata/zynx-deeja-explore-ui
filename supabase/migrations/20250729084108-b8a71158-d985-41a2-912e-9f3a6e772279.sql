-- Create function to create the first owner account
CREATE OR REPLACE FUNCTION public.create_first_owner(
  owner_email text,
  owner_password text
)
RETURNS TABLE(user_id uuid, success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_user_id uuid;
  owner_count integer;
BEGIN
  -- Check if any owner already exists
  SELECT COUNT(*) INTO owner_count
  FROM public.profiles
  WHERE role = 'owner';
  
  IF owner_count > 0 THEN
    RETURN QUERY SELECT null::uuid, false, 'Owner account already exists'::text;
    RETURN;
  END IF;
  
  -- Create the user account using auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_sent_at,
    email_change,
    email_change_token_new,
    email_change_token_current,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    owner_email,
    crypt(owner_password, gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    null,
    '',
    null,
    '',
    '',
    '',
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    NOW(),
    NOW(),
    null,
    null,
    '',
    '',
    null,
    0,
    null,
    '',
    null,
    false,
    null
  )
  RETURNING id INTO new_user_id;
  
  -- Create profile with owner role
  INSERT INTO public.profiles (id, email, role, created_at, updated_at)
  VALUES (new_user_id, owner_email, 'owner', NOW(), NOW());
  
  -- Also add to user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'owner');
  
  RETURN QUERY SELECT new_user_id, true, 'Owner account created successfully'::text;
END;
$$;

-- Function to upgrade existing user to owner (if needed)
CREATE OR REPLACE FUNCTION public.upgrade_user_to_owner(user_email text)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id uuid;
  owner_count integer;
BEGIN
  -- Check if any owner already exists
  SELECT COUNT(*) INTO owner_count
  FROM public.profiles
  WHERE role = 'owner';
  
  IF owner_count > 0 THEN
    RETURN QUERY SELECT false, 'Owner account already exists'::text;
    RETURN;
  END IF;
  
  -- Find user by email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found'::text;
    RETURN;
  END IF;
  
  -- Update user role to owner
  UPDATE public.profiles
  SET role = 'owner'
  WHERE id = target_user_id;
  
  -- Add to user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'owner')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN QUERY SELECT true, 'User successfully upgraded to owner'::text;
END;
$$;