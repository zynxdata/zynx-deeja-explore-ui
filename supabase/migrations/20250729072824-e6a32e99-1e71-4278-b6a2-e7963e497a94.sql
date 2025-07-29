-- Fix security warnings by setting search_path for functions

-- Update calculate_agi_similarity function with proper search_path
CREATE OR REPLACE FUNCTION calculate_agi_similarity(
  total_score integer,
  accuracy_percentage float,
  streak_bonus integer,
  category_diversity integer
) RETURNS float
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  agi_score float;
BEGIN
  -- AGI similarity formula: combines multiple factors
  agi_score := (
    (total_score * 0.3) + 
    (accuracy_percentage * 0.4) + 
    (LEAST(streak_bonus, 50) * 0.2) + 
    (category_diversity * 2 * 0.1)
  );
  
  -- Cap at 100
  RETURN LEAST(agi_score, 100.0);
END;
$$;

-- Update should_enable_championship function with proper search_path
CREATE OR REPLACE FUNCTION should_enable_championship() RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  player_count integer;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO player_count
  FROM public.game_players
  WHERE created_at >= NOW() - INTERVAL '30 days';
  
  RETURN player_count >= 100;
END;
$$;

-- Update trigger_championship_reset function with proper search_path
CREATE OR REPLACE FUNCTION trigger_championship_reset(
  defeated_champion_id uuid,
  new_champion_id uuid,
  leaderboard_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Mark all active sessions as completed
  UPDATE public.game_sessions 
  SET status = 'champion_defeated', session_end = NOW()
  WHERE status = 'active';
  
  -- Reset scores (keep history but mark as reset)
  INSERT INTO public.championship_defeats (
    defeated_champion_id, 
    new_champion_id, 
    leaderboard_id,
    defeat_score,
    defeat_agi_similarity
  )
  SELECT 
    defeated_champion_id,
    new_champion_id,
    leaderboard_id,
    gs.total_score,
    gs.agi_similarity_score
  FROM public.game_sessions gs
  WHERE gs.player_id = new_champion_id
    AND gs.status = 'champion_defeated'
  ORDER BY gs.total_score DESC
  LIMIT 1;
  
  -- Update leaderboard
  UPDATE public.leaderboards
  SET champion_player_id = new_champion_id,
      is_active = false
  WHERE id = leaderboard_id;
END;
$$;