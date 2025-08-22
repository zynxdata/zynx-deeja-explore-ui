-- Fix the security definer view error by removing the problematic view property
-- and replacing it with a regular view that relies on RLS

-- Remove the security definer property from the view
DROP VIEW IF EXISTS public.game_players_public;

-- Create a regular view without security definer that relies on RLS
CREATE VIEW public.game_players_public AS
SELECT 
  id,
  display_name,
  is_ai,
  ai_description,
  created_at,
  -- Only expose user_id for the current user's own records or null for AI players
  CASE 
    WHEN user_id = auth.uid() THEN user_id 
    WHEN is_ai = true THEN NULL
    ELSE NULL 
  END as user_id
FROM public.game_players;

-- The view will automatically use the RLS policies defined on game_players table