export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
        ]
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
      [_ in never]: never
    }
    Functions: {
      calculate_agi_similarity: {
        Args: {
          total_score: number
          accuracy_percentage: number
          streak_bonus: number
          category_diversity: number
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
          user_id: string
          success: boolean
          message: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_security_summary: {
        Args: { time_window?: unknown }
        Returns: {
          event_type: string
          severity: string
          count: number
          latest_event: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_or_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      should_enable_championship: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      trigger_championship_reset: {
        Args: {
          defeated_champion_id: string
          new_champion_id: string
          leaderboard_id: string
        }
        Returns: undefined
      }
      upgrade_user_to_owner: {
        Args: { user_email: string }
        Returns: {
          success: boolean
          message: string
        }[]
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "user"
      championship_period: "monthly" | "seasonal" | "yearly"
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
      game_status: ["active", "completed", "champion_defeated"],
    },
  },
} as const
