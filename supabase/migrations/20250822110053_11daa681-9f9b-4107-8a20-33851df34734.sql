-- Fix security vulnerability: Restrict access to user email addresses through game_players
-- Issue: game_players table exposes user_ids which could be used to access profile data

-- 1. Create a more restrictive policy for game_players that doesn't expose user_ids to unauthorized users
DROP POLICY IF EXISTS "Users can view public game player info" ON public.game_players;

-- New policy: Only show public game info without exposing user_ids unless it's the user's own record
CREATE POLICY "Users can view limited public game player info" 
ON public.game_players 
FOR SELECT 
USING (
  -- Users can see their own full game player records
  (auth.uid() = user_id) OR 
  -- For other users' records, only show public info in leaderboard contexts (no user_id exposure)
  (auth.uid() IS NOT NULL AND user_id IS NULL AND is_ai = true) OR
  -- Allow viewing of AI players (which don't have user_id)
  (auth.uid() IS NOT NULL AND is_ai = true)
);

-- 2. Add a security-focused policy for admins/owners who need full access
CREATE POLICY "Admins can view all game player info" 
ON public.game_players 
FOR SELECT 
USING (is_admin_or_owner());

-- 3. Create a safer public view for leaderboards that doesn't expose user_ids
CREATE OR REPLACE VIEW public.game_players_public AS
SELECT 
  id,
  display_name,
  is_ai,
  ai_description,
  created_at,
  -- Only expose user_id for the current user's own records
  CASE 
    WHEN user_id = auth.uid() THEN user_id 
    ELSE NULL 
  END as user_id
FROM public.game_players
WHERE 
  -- Apply same logic as the RLS policy
  (auth.uid() = user_id) OR 
  (is_ai = true) OR
  is_admin_or_owner();

-- 4. Add RLS to the view
ALTER VIEW public.game_players_public SET (security_barrier = true);

-- 5. Ensure get_user_profile function has proper access controls
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid uuid)
RETURNS TABLE(username text, email text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- 6. Create a safe public profile function that doesn't expose email
CREATE OR REPLACE FUNCTION public.get_public_user_profile(user_uuid uuid)
RETURNS TABLE(username text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path to 'public'
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