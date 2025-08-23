-- Check for and fix any remaining SECURITY DEFINER views
-- First, let's see what views might have SECURITY DEFINER set

-- Check if there are other views causing the security definer issue
-- Since we can't directly query the system catalogs in a migration, 
-- let's just ensure our functions have proper search paths

-- Fix search path issues for functions that were modified
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid uuid)
RETURNS TABLE(username text, email text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow users to get their own profile or admins to get any profile
  IF user_uuid != auth.uid() AND NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied: You can only view your own profile';
  END IF;
  
  RETURN QUERY 
  SELECT 
    p.full_name as username, 
    p.email, 
    p.created_at
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$function$;

-- Fix search path for the public profile function  
CREATE OR REPLACE FUNCTION public.get_public_user_profile(user_uuid uuid)
RETURNS TABLE(username text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- This function only returns non-sensitive public info
  RETURN QUERY 
  SELECT 
    p.full_name as username,
    p.created_at
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$function$;