import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface GamePlayer {
  id: string;
  user_id: string | null;
  display_name: string;
  is_ai: boolean;
  ai_description?: string;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  player_id: string;
  total_score: number;
  correct_answers: number;
  total_questions: number;
  current_streak: number;
  best_streak: number;
  category_scores: any; // JSON field from database
  agi_similarity_score: number;
  session_start: string;
  session_end?: string;
  status: 'active' | 'completed' | 'champion_defeated';
  created_at: string;
}

export interface Leaderboard {
  id: string;
  period: 'monthly' | 'seasonal' | 'yearly';
  period_start: string;
  period_end: string;
  champion_player_id?: string;
  champion_score?: number;
  champion_agi_similarity?: number;
  total_participants: number;
  is_active: boolean;
  created_at: string;
}

export interface ChampionshipDefeat {
  id: string;
  defeated_champion_id: string;
  new_champion_id: string;
  leaderboard_id: string;
  defeat_score: number;
  defeat_agi_similarity: number;
  defeat_timestamp: string;
  reset_triggered: boolean;
}

export interface ZoneChampion {
  id: string;
  zone_type: string;
  zone_identifier: string;
  champion_player_id: string;
  champion_score: number;
  champion_agi_similarity: number;
  championship_start: string;
  championship_end?: string;
  is_active: boolean;
}

export const useGameData = () => {
  const { user } = useAuth();
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [topPlayers, setTopPlayers] = useState<(GameSession & { player: GamePlayer })[]>([]);
  const [zoneChampions, setZoneChampions] = useState<ZoneChampion[]>([]);
  const [championshipEnabled, setChampionshipEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize player profile
  const initializePlayer = async (displayName: string, isAi: boolean = false, aiDescription?: string) => {
    if (!user) return null;

    try {
      const { data: existingPlayer } = await supabase
        .from('game_players')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingPlayer) {
        setCurrentPlayer(existingPlayer);
        return existingPlayer;
      }

      const { data: newPlayer, error } = await supabase
        .from('game_players')
        .insert({
          user_id: user.id,
          display_name: displayName,
          is_ai: isAi,
          ai_description: aiDescription
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentPlayer(newPlayer);
      return newPlayer;
    } catch (error) {
      console.error('Error initializing player:', error);
      return null;
    }
  };

  // Create or get current session
  const initializeSession = async () => {
    if (!currentPlayer) return null;

    try {
      const { data: activeSession } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('player_id', currentPlayer.id)
        .eq('status', 'active')
        .single();

      if (activeSession) {
        setCurrentSession(activeSession);
        return activeSession;
      }

      const { data: newSession, error } = await supabase
        .from('game_sessions')
        .insert({
          player_id: currentPlayer.id,
          total_score: 0,
          correct_answers: 0,
          total_questions: 0,
          current_streak: 0,
          best_streak: 0,
          category_scores: {},
          agi_similarity_score: 0
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error initializing session:', error);
      return null;
    }
  };

  // Update game session with new score
  const updateSession = async (
    correct: boolean,
    category: string,
    currentStreak: number,
    totalQuestions: number,
    correctAnswers: number
  ) => {
    if (!currentSession) return;

    try {
      const categoryScores = { ...currentSession.category_scores };
      categoryScores[category] = (categoryScores[category] || 0) + (correct ? 10 : 0);

      const totalScore = currentSession.total_score + (correct ? 10 : 0);
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const categoryDiversity = Object.keys(categoryScores).length;

      // Calculate AGI similarity score
      const { data: agiScore } = await supabase.rpc('calculate_agi_similarity', {
        total_score: totalScore,
        accuracy_percentage: accuracy,
        streak_bonus: currentStreak,
        category_diversity: categoryDiversity
      });

      const { data: updatedSession, error } = await supabase
        .from('game_sessions')
        .update({
          total_score: totalScore,
          correct_answers: correctAnswers,
          total_questions: totalQuestions,
          current_streak: currentStreak,
          best_streak: Math.max(currentSession.best_streak, currentStreak),
          category_scores: categoryScores,
          agi_similarity_score: agiScore || 0
        })
        .eq('id', currentSession.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(updatedSession);
      return updatedSession;
    } catch (error) {
      console.error('Error updating session:', error);
      return null;
    }
  };

  // Fetch leaderboards
  const fetchLeaderboards = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .order('period_start', { ascending: false });

      if (error) throw error;

      setLeaderboards(data || []);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    }
  };

  // Fetch top players
  const fetchTopPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          player:game_players(*)
        `)
        .eq('status', 'active')
        .order('agi_similarity_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      setTopPlayers(data || []);
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

  // Fetch zone champions
  const fetchZoneChampions = async () => {
    try {
      const { data, error } = await supabase
        .from('zone_champions')
        .select(`
          *,
          champion:game_players(*)
        `)
        .eq('is_active', true);

      if (error) throw error;

      setZoneChampions(data || []);
    } catch (error) {
      console.error('Error fetching zone champions:', error);
    }
  };

  // Check if championship mode should be enabled
  const checkChampionshipMode = async () => {
    try {
      const { data, error } = await supabase.rpc('should_enable_championship');

      if (error) throw error;

      setChampionshipEnabled(data || false);
    } catch (error) {
      console.error('Error checking championship mode:', error);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    if (user) {
      fetchLeaderboards();
      fetchTopPlayers();
      fetchZoneChampions();
      checkChampionshipMode();
    }
  }, [user]);

  return {
    currentPlayer,
    currentSession,
    leaderboards,
    topPlayers,
    zoneChampions,
    championshipEnabled,
    loading,
    initializePlayer,
    initializeSession,
    updateSession,
    fetchLeaderboards,
    fetchTopPlayers,
    fetchZoneChampions,
    checkChampionshipMode
  };
};