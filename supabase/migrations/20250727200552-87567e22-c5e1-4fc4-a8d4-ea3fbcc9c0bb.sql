-- Create leaderboard and scoring system for algorithm game

-- Create enum for championship periods
CREATE TYPE championship_period AS ENUM ('monthly', 'seasonal', 'yearly');

-- Create enum for game status
CREATE TYPE game_status AS ENUM ('active', 'completed', 'champion_defeated');

-- Create players table to track game participants
CREATE TABLE public.game_players (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  is_ai boolean DEFAULT false,
  ai_description text, -- Description of AI used (if applicable)
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create game sessions table
CREATE TABLE public.game_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  total_score integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  category_scores jsonb DEFAULT '{}', -- Scores by category
  agi_similarity_score float DEFAULT 0, -- How close to real AGI (0-100)
  session_start timestamp with time zone NOT NULL DEFAULT now(),
  session_end timestamp with time zone,
  status game_status DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create leaderboards table
CREATE TABLE public.leaderboards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period championship_period NOT NULL,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  champion_player_id uuid REFERENCES public.game_players(id),
  champion_score integer,
  champion_agi_similarity float,
  total_participants integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create championship defeats table (who defeated whom)
CREATE TABLE public.championship_defeats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  defeated_champion_id uuid REFERENCES public.game_players(id) NOT NULL,
  new_champion_id uuid REFERENCES public.game_players(id) NOT NULL,
  leaderboard_id uuid REFERENCES public.leaderboards(id) NOT NULL,
  defeat_score integer NOT NULL,
  defeat_agi_similarity float NOT NULL,
  defeat_timestamp timestamp with time zone NOT NULL DEFAULT now(),
  reset_triggered boolean DEFAULT true -- Whether this defeat triggered a reset
);

-- Create category performance table
CREATE TABLE public.category_performance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid REFERENCES public.game_players(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  total_score integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  accuracy_percentage float DEFAULT 0,
  agi_similarity_score float DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now()
);

-- Create zone champions table (for regional/category champions)
CREATE TABLE public.zone_champions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_type text NOT NULL, -- 'category', 'region', etc.
  zone_identifier text NOT NULL, -- category name or region identifier
  champion_player_id uuid REFERENCES public.game_players(id) NOT NULL,
  champion_score integer NOT NULL,
  champion_agi_similarity float NOT NULL,
  championship_start timestamp with time zone NOT NULL DEFAULT now(),
  championship_end timestamp with time zone,
  is_active boolean DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.championship_defeats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_champions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_players
CREATE POLICY "Anyone can view game players" ON public.game_players FOR SELECT USING (true);
CREATE POLICY "Users can insert their own player profile" ON public.game_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own player profile" ON public.game_players FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for game_sessions
CREATE POLICY "Users can view all game sessions" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own game sessions" ON public.game_sessions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.game_players gp WHERE gp.id = player_id AND gp.user_id = auth.uid())
);
CREATE POLICY "Users can update their own game sessions" ON public.game_sessions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.game_players gp WHERE gp.id = player_id AND gp.user_id = auth.uid())
);

-- RLS Policies for leaderboards (public read-only)
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Admins can manage leaderboards" ON public.leaderboards FOR ALL USING (is_admin_or_owner());

-- RLS Policies for championship_defeats (public read-only)
CREATE POLICY "Anyone can view championship defeats" ON public.championship_defeats FOR SELECT USING (true);
CREATE POLICY "Users can record defeats involving their player" ON public.championship_defeats FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.game_players gp WHERE gp.id IN (defeated_champion_id, new_champion_id) AND gp.user_id = auth.uid())
);

-- RLS Policies for category_performance
CREATE POLICY "Anyone can view category performance" ON public.category_performance FOR SELECT USING (true);
CREATE POLICY "Users can manage their own category performance" ON public.category_performance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.game_players gp WHERE gp.id = player_id AND gp.user_id = auth.uid())
);

-- RLS Policies for zone_champions (public read-only)
CREATE POLICY "Anyone can view zone champions" ON public.zone_champions FOR SELECT USING (true);
CREATE POLICY "Admins can manage zone champions" ON public.zone_champions FOR ALL USING (is_admin_or_owner());

-- Create functions for game logic

-- Function to calculate AGI similarity score
CREATE OR REPLACE FUNCTION calculate_agi_similarity(
  total_score integer,
  accuracy_percentage float,
  streak_bonus integer,
  category_diversity integer
) RETURNS float
LANGUAGE plpgsql
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

-- Function to check if championship mode should be enabled
CREATE OR REPLACE FUNCTION should_enable_championship() RETURNS boolean
LANGUAGE plpgsql
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

-- Function to trigger championship reset
CREATE OR REPLACE FUNCTION trigger_championship_reset(
  defeated_champion_id uuid,
  new_champion_id uuid,
  leaderboard_id uuid
) RETURNS void
LANGUAGE plpgsql
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

-- Create indexes for performance
CREATE INDEX idx_game_sessions_player_score ON public.game_sessions(player_id, total_score DESC);
CREATE INDEX idx_game_sessions_agi_similarity ON public.game_sessions(agi_similarity_score DESC);
CREATE INDEX idx_leaderboards_active ON public.leaderboards(is_active, period);
CREATE INDEX idx_category_performance_player ON public.category_performance(player_id, category);
CREATE INDEX idx_zone_champions_active ON public.zone_champions(is_active, zone_type, zone_identifier);