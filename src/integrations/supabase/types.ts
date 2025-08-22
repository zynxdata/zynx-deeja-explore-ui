export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_decisions: {
        Row: {
          cost_saved: number | null
          decision_type: string
          devices_affected: string[]
          energy_saved_kwh: number | null
          execution_status: string | null
          id: string
          reasoning: string
          timestamp: string | null
          user_id: string
          user_satisfaction_score: number | null
        }
        Insert: {
          cost_saved?: number | null
          decision_type: string
          devices_affected: string[]
          energy_saved_kwh?: number | null
          execution_status?: string | null
          id?: string
          reasoning: string
          timestamp?: string | null
          user_id: string
          user_satisfaction_score?: number | null
        }
        Update: {
          cost_saved?: number | null
          decision_type?: string
          devices_affected?: string[]
          energy_saved_kwh?: number | null
          execution_status?: string | null
          id?: string
          reasoning?: string
          timestamp?: string | null
          user_id?: string
          user_satisfaction_score?: number | null
        }
        Relationships: []
      }
      category_performance: {
        Row: {
          accuracy_percentage: number | null
          agi_similarity_score: number | null
          category: string
          correct_answers: number | null
          id: string
          last_updated: string
          player_id: string
          total_questions: number | null
          total_score: number | null
        }
        Insert: {
          accuracy_percentage?: number | null
          agi_similarity_score?: number | null
          category: string
          correct_answers?: number | null
          id?: string
          last_updated?: string
          player_id: string
          total_questions?: number | null
          total_score?: number | null
        }
        Update: {
          accuracy_percentage?: number | null
          agi_similarity_score?: number | null
          category?: string
          correct_answers?: number | null
          id?: string
          last_updated?: string
          player_id?: string
          total_questions?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "category_performance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_performance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      championship_defeats: {
        Row: {
          defeat_agi_similarity: number
          defeat_score: number
          defeat_timestamp: string
          defeated_champion_id: string
          id: string
          leaderboard_id: string
          new_champion_id: string
          reset_triggered: boolean | null
        }
        Insert: {
          defeat_agi_similarity: number
          defeat_score: number
          defeat_timestamp?: string
          defeated_champion_id: string
          id?: string
          leaderboard_id: string
          new_champion_id: string
          reset_triggered?: boolean | null
        }
        Update: {
          defeat_agi_similarity?: number
          defeat_score?: number
          defeat_timestamp?: string
          defeated_champion_id?: string
          id?: string
          leaderboard_id?: string
          new_champion_id?: string
          reset_triggered?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "championship_defeats_defeated_champion_id_fkey"
            columns: ["defeated_champion_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championship_defeats_defeated_champion_id_fkey"
            columns: ["defeated_champion_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championship_defeats_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championship_defeats_new_champion_id_fkey"
            columns: ["new_champion_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championship_defeats_new_champion_id_fkey"
            columns: ["new_champion_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      colors: {
        Row: {
          blue: number | null
          green: number | null
          hex: string
          hue: number | null
          id: number
          light_hsl: number | null
          name: string | null
          red: number | null
          sat_hsl: number | null
          sat_hsv: number | null
          source: Database["public"]["Enums"]["color_source"] | null
          val_hsv: number | null
        }
        Insert: {
          blue?: number | null
          green?: number | null
          hex: string
          hue?: number | null
          id?: number
          light_hsl?: number | null
          name?: string | null
          red?: number | null
          sat_hsl?: number | null
          sat_hsv?: number | null
          source?: Database["public"]["Enums"]["color_source"] | null
          val_hsv?: number | null
        }
        Update: {
          blue?: number | null
          green?: number | null
          hex?: string
          hue?: number | null
          id?: number
          light_hsl?: number | null
          name?: string | null
          red?: number | null
          sat_hsl?: number | null
          sat_hsv?: number | null
          source?: Database["public"]["Enums"]["color_source"] | null
          val_hsv?: number | null
        }
        Relationships: []
      }
      control_settings: {
        Row: {
          control_id: string
          created_at: string
          id: string
          is_enabled: boolean
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          control_id: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          control_id?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      device_schedules: {
        Row: {
          created_at: string | null
          created_by_agent: boolean | null
          device_id: string
          energy_source_preference: string | null
          estimated_duration_minutes: number
          id: string
          optimization_reason: string | null
          priority_score: number | null
          scheduled_end: string | null
          scheduled_start: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by_agent?: boolean | null
          device_id: string
          energy_source_preference?: string | null
          estimated_duration_minutes: number
          id?: string
          optimization_reason?: string | null
          priority_score?: number | null
          scheduled_end?: string | null
          scheduled_start: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by_agent?: boolean | null
          device_id?: string
          energy_source_preference?: string | null
          estimated_duration_minutes?: number
          id?: string
          optimization_reason?: string | null
          priority_score?: number | null
          scheduled_end?: string | null
          scheduled_start?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_schedules_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "smart_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_rates: {
        Row: {
          carbon_intensity: number | null
          created_at: string | null
          grid_rate_per_kwh: number
          id: string
          peak_demand_period: boolean | null
          solar_availability_percent: number | null
          timestamp: string | null
        }
        Insert: {
          carbon_intensity?: number | null
          created_at?: string | null
          grid_rate_per_kwh: number
          id?: string
          peak_demand_period?: boolean | null
          solar_availability_percent?: number | null
          timestamp?: string | null
        }
        Update: {
          carbon_intensity?: number | null
          created_at?: string | null
          grid_rate_per_kwh?: number
          id?: string
          peak_demand_period?: boolean | null
          solar_availability_percent?: number | null
          timestamp?: string | null
        }
        Relationships: []
      }
      energy_usage: {
        Row: {
          cost_estimate: number | null
          created_at: string | null
          device_id: string
          duration_minutes: number | null
          energy_source: string | null
          id: string
          power_watts: number
          timestamp: string | null
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string | null
          device_id: string
          duration_minutes?: number | null
          energy_source?: string | null
          id?: string
          power_watts: number
          timestamp?: string | null
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string | null
          device_id?: string
          duration_minutes?: number | null
          energy_source?: string | null
          id?: string
          power_watts?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_usage_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "smart_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      game_players: {
        Row: {
          ai_description: string | null
          created_at: string
          display_name: string
          id: string
          is_ai: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_description?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_ai?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_description?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_ai?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          agi_similarity_score: number | null
          best_streak: number | null
          category_scores: Json | null
          correct_answers: number | null
          created_at: string
          current_streak: number | null
          id: string
          player_id: string
          session_end: string | null
          session_start: string
          status: Database["public"]["Enums"]["game_status"] | null
          total_questions: number | null
          total_score: number | null
        }
        Insert: {
          agi_similarity_score?: number | null
          best_streak?: number | null
          category_scores?: Json | null
          correct_answers?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          player_id: string
          session_end?: string | null
          session_start?: string
          status?: Database["public"]["Enums"]["game_status"] | null
          total_questions?: number | null
          total_score?: number | null
        }
        Update: {
          agi_similarity_score?: number | null
          best_streak?: number | null
          category_scores?: Json | null
          correct_answers?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          player_id?: string
          session_end?: string | null
          session_start?: string
          status?: Database["public"]["Enums"]["game_status"] | null
          total_questions?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          champion_agi_similarity: number | null
          champion_player_id: string | null
          champion_score: number | null
          created_at: string
          id: string
          is_active: boolean | null
          period: Database["public"]["Enums"]["championship_period"]
          period_end: string
          period_start: string
          total_participants: number | null
        }
        Insert: {
          champion_agi_similarity?: number | null
          champion_player_id?: string | null
          champion_score?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          period: Database["public"]["Enums"]["championship_period"]
          period_end: string
          period_start: string
          total_participants?: number | null
        }
        Update: {
          champion_agi_similarity?: number | null
          champion_player_id?: string | null
          champion_score?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          period?: Database["public"]["Enums"]["championship_period"]
          period_end?: string
          period_start?: string
          total_participants?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_champion_player_id_fkey"
            columns: ["champion_player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboards_champion_player_id_fkey"
            columns: ["champion_player_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          emotion: string | null
          id: string
          reasoning: string | null
          sender: string
          sources: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          emotion?: string | null
          id?: string
          reasoning?: string | null
          sender: string
          sources?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          emotion?: string | null
          id?: string
          reasoning?: string | null
          sender?: string
          sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          id: string
          identifier: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      smart_devices: {
        Row: {
          created_at: string | null
          current_power_usage: number | null
          device_status: string | null
          device_type: string
          id: string
          is_schedulable: boolean | null
          location: string
          name: string
          power_rating_watts: number
          priority_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_power_usage?: number | null
          device_status?: string | null
          device_type: string
          id?: string
          is_schedulable?: boolean | null
          location: string
          name: string
          power_rating_watts: number
          priority_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_power_usage?: number | null
          device_status?: string | null
          device_type?: string
          id?: string
          is_schedulable?: boolean | null
          location?: string
          name?: string
          power_rating_watts?: number
          priority_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      table_name: {
        Row: {
          data: Json | null
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          encrypted_key: string
          id: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_key: string
          id?: string
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_key?: string
          id?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_energy_preferences: {
        Row: {
          auto_optimization_enabled: boolean | null
          comfort_priority: number | null
          created_at: string | null
          id: string
          max_monthly_budget: number | null
          notification_preferences: Json | null
          prefer_green_energy: boolean | null
          time_of_use_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_optimization_enabled?: boolean | null
          comfort_priority?: number | null
          created_at?: string | null
          id?: string
          max_monthly_budget?: number | null
          notification_preferences?: Json | null
          prefer_green_energy?: boolean | null
          time_of_use_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_optimization_enabled?: boolean | null
          comfort_priority?: number | null
          created_at?: string | null
          id?: string
          max_monthly_budget?: number | null
          notification_preferences?: Json | null
          prefer_green_energy?: boolean | null
          time_of_use_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zone_champions: {
        Row: {
          champion_agi_similarity: number
          champion_player_id: string
          champion_score: number
          championship_end: string | null
          championship_start: string
          id: string
          is_active: boolean | null
          zone_identifier: string
          zone_type: string
        }
        Insert: {
          champion_agi_similarity: number
          champion_player_id: string
          champion_score: number
          championship_end?: string | null
          championship_start?: string
          id?: string
          is_active?: boolean | null
          zone_identifier: string
          zone_type: string
        }
        Update: {
          champion_agi_similarity?: number
          champion_player_id?: string
          champion_score?: number
          championship_end?: string | null
          championship_start?: string
          id?: string
          is_active?: boolean | null
          zone_identifier?: string
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_champions_champion_player_id_fkey"
            columns: ["champion_player_id"]
            isOneToOne: false
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zone_champions_champion_player_id_fkey"
            columns: ["champion_player_id"]
            isOneToOne: false
            referencedRelation: "game_players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      zynx_agi_tasks: {
        Row: {
          Agent: string
          API_Endpoint: string
          Component: string | null
          Functionality: string | null
          Notes: string | null
          Phase: string | null
          Related_Files: string | null
          Tools_Tech: string | null
          user_id: string | null
        }
        Insert: {
          Agent: string
          API_Endpoint: string
          Component?: string | null
          Functionality?: string | null
          Notes?: string | null
          Phase?: string | null
          Related_Files?: string | null
          Tools_Tech?: string | null
          user_id?: string | null
        }
        Update: {
          Agent?: string
          API_Endpoint?: string
          Component?: string | null
          Functionality?: string | null
          Notes?: string | null
          Phase?: string | null
          Related_Files?: string | null
          Tools_Tech?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      game_players_public: {
        Row: {
          ai_description: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          is_ai: boolean | null
          user_id: string | null
        }
        Insert: {
          ai_description?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_ai?: boolean | null
          user_id?: never
        }
        Update: {
          ai_description?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_ai?: boolean | null
          user_id?: never
        }
        Relationships: []
      }
    }
    Functions: {
      admin_get_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_agi_similarity: {
        Args: {
          accuracy_percentage: number
          category_diversity: number
          streak_bonus: number
          total_score: number
        }
        Returns: number
      }
      calculate_energy_cost: {
        Args: {
          duration_minutes: number
          power_watts: number
          rate_per_kwh: number
        }
        Returns: number
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          user_email: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      create_first_owner: {
        Args: { owner_email: string; owner_password: string }
        Returns: {
          message: string
          success: boolean
          user_id: string
        }[]
      }
      delete_user_api_key: {
        Args: { p_service_name: string; p_user_id: string }
        Returns: undefined
      }
      get_current_energy_rate: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_public_user_profile: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          username: string
        }[]
      }
      get_security_summary: {
        Args: { time_window?: unknown }
        Returns: {
          count: number
          event_type: string
          latest_event: string
          severity: string
        }[]
      }
      get_user_api_key: {
        Args: { p_service_name: string; p_user_id: string }
        Returns: string
      }
      get_user_control_settings: {
        Args: { p_user_id: string }
        Returns: {
          control_id: string
          is_enabled: boolean
          settings: Json
        }[]
      }
      get_user_profile: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          email: string
          username: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin_or_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      log_security_event: {
        Args: { p_details?: Json; p_event_type: string; p_severity: string }
        Returns: undefined
      }
      optimize_device_schedule: {
        Args: { optimization_window_hours?: number; target_user_id: string }
        Returns: {
          device_id: string
          estimated_savings: number
          reasoning: string
          recommended_start: string
        }[]
      }
      search_knowledge_base: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
          title: string
        }[]
      }
      should_enable_championship: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      trigger_championship_reset: {
        Args: {
          defeated_champion_id: string
          leaderboard_id: string
          new_champion_id: string
        }
        Returns: undefined
      }
      upgrade_user_to_owner: {
        Args: { user_email: string }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      upsert_control_setting: {
        Args: {
          p_control_id: string
          p_is_enabled: boolean
          p_settings?: Json
          p_user_id: string
        }
        Returns: undefined
      }
      upsert_user_api_key: {
        Args: {
          p_encrypted_key: string
          p_service_name: string
          p_user_id: string
        }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "user"
      championship_period: "monthly" | "seasonal" | "yearly"
      color_source:
        | "99COLORS_NET"
        | "ART_PAINTS_YG07S"
        | "BYRNE"
        | "CRAYOLA"
        | "CMYK_COLOR_MODEL"
        | "COLORCODE_IS"
        | "COLORHEXA"
        | "COLORXS"
        | "CORNELL_UNIVERSITY"
        | "COLUMBIA_UNIVERSITY"
        | "DUKE_UNIVERSITY"
        | "ENCYCOLORPEDIA_COM"
        | "ETON_COLLEGE"
        | "FANTETTI_AND_PETRACCHI"
        | "FINDTHEDATA_COM"
        | "FERRARIO_1919"
        | "FEDERAL_STANDARD_595"
        | "FLAG_OF_INDIA"
        | "FLAG_OF_SOUTH_AFRICA"
        | "GLAZEBROOK_AND_BALDRY"
        | "GOOGLE"
        | "HEXCOLOR_CO"
        | "ISCC_NBS"
        | "KELLY_MOORE"
        | "MATTEL"
        | "MAERZ_AND_PAUL"
        | "MILK_PAINT"
        | "MUNSELL_COLOR_WHEEL"
        | "NATURAL_COLOR_SYSTEM"
        | "PANTONE"
        | "PLOCHERE"
        | "POURPRE_COM"
        | "RAL"
        | "RESENE"
        | "RGB_COLOR_MODEL"
        | "THOM_POOLE"
        | "UNIVERSITY_OF_ALABAMA"
        | "UNIVERSITY_OF_CALIFORNIA_DAVIS"
        | "UNIVERSITY_OF_CAMBRIDGE"
        | "UNIVERSITY_OF_NORTH_CAROLINA"
        | "UNIVERSITY_OF_TEXAS_AT_AUSTIN"
        | "X11_WEB"
        | "XONA_COM"
      game_status: "active" | "completed" | "champion_defeated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "user"],
      championship_period: ["monthly", "seasonal", "yearly"],
      color_source: [
        "99COLORS_NET",
        "ART_PAINTS_YG07S",
        "BYRNE",
        "CRAYOLA",
        "CMYK_COLOR_MODEL",
        "COLORCODE_IS",
        "COLORHEXA",
        "COLORXS",
        "CORNELL_UNIVERSITY",
        "COLUMBIA_UNIVERSITY",
        "DUKE_UNIVERSITY",
        "ENCYCOLORPEDIA_COM",
        "ETON_COLLEGE",
        "FANTETTI_AND_PETRACCHI",
        "FINDTHEDATA_COM",
        "FERRARIO_1919",
        "FEDERAL_STANDARD_595",
        "FLAG_OF_INDIA",
        "FLAG_OF_SOUTH_AFRICA",
        "GLAZEBROOK_AND_BALDRY",
        "GOOGLE",
        "HEXCOLOR_CO",
        "ISCC_NBS",
        "KELLY_MOORE",
        "MATTEL",
        "MAERZ_AND_PAUL",
        "MILK_PAINT",
        "MUNSELL_COLOR_WHEEL",
        "NATURAL_COLOR_SYSTEM",
        "PANTONE",
        "PLOCHERE",
        "POURPRE_COM",
        "RAL",
        "RESENE",
        "RGB_COLOR_MODEL",
        "THOM_POOLE",
        "UNIVERSITY_OF_ALABAMA",
        "UNIVERSITY_OF_CALIFORNIA_DAVIS",
        "UNIVERSITY_OF_CAMBRIDGE",
        "UNIVERSITY_OF_NORTH_CAROLINA",
        "UNIVERSITY_OF_TEXAS_AT_AUSTIN",
        "X11_WEB",
        "XONA_COM",
      ],
      game_status: ["active", "completed", "champion_defeated"],
    },
  },
} as const
