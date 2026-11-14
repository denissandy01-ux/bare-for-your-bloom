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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      beauty_posts: {
        Row: {
          author: string
          brand_id: string | null
          caption: string
          country_id: string
          created_at: string
          disclosure: string
          duration_weeks: number | null
          id: string
          kind: string
          media_path: string
          media_type: string
          owner_id: string
          product_id: string | null
          repurchase: boolean | null
        }
        Insert: {
          author: string
          brand_id?: string | null
          caption: string
          country_id: string
          created_at?: string
          disclosure?: string
          duration_weeks?: number | null
          id?: string
          kind: string
          media_path: string
          media_type: string
          owner_id: string
          product_id?: string | null
          repurchase?: boolean | null
        }
        Update: {
          author?: string
          brand_id?: string | null
          caption?: string
          country_id?: string
          created_at?: string
          disclosure?: string
          duration_weeks?: number | null
          id?: string
          kind?: string
          media_path?: string
          media_type?: string
          owner_id?: string
          product_id?: string | null
          repurchase?: boolean | null
        }
        Relationships: []
      }
      business_products: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_products_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_drafts: {
        Row: {
          caption: string
          category: string
          created_at: string
          disclosure: string
          id: string
          license_available: boolean
          owner_id: string
          product_name: string
          title: string
        }
        Insert: {
          caption?: string
          category: string
          created_at?: string
          disclosure?: string
          id?: string
          license_available?: boolean
          owner_id: string
          product_name?: string
          title: string
        }
        Update: {
          caption?: string
          category?: string
          created_at?: string
          disclosure?: string
          id?: string
          license_available?: boolean
          owner_id?: string
          product_name?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_drafts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      license_requests: {
        Row: {
          brand_id: string
          budget: number
          content_id: string
          created_at: string
          creator_id: string
          duration_days: number
          id: string
          status: string
          usage: string
        }
        Insert: {
          brand_id: string
          budget: number
          content_id: string
          created_at?: string
          creator_id: string
          duration_days: number
          id?: string
          status?: string
          usage: string
        }
        Update: {
          brand_id?: string
          budget?: number
          content_id?: string
          created_at?: string
          creator_id?: string
          duration_days?: number
          id?: string
          status?: string
          usage?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_requests_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_requests_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          analytics_consent: boolean
          canvas: Json
          display_name: string
          id: string
        }
        Insert: {
          analytics_consent?: boolean
          canvas?: Json
          display_name?: string
          id: string
        }
        Update: {
          analytics_consent?: boolean
          canvas?: Json
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_workspace_role: { Args: { kind: string }; Returns: boolean }
      join_workspace: { Args: { kind: string }; Returns: undefined }
      licensing_catalog: {
        Args: never
        Returns: {
          category: string
          creator_id: string
          display_name: string
          id: string
          product_name: string
          title: string
        }[]
      }
      request_license: {
        Args: {
          content: string
          days: number
          offered_budget: number
          requested_usage: string
        }
        Returns: undefined
      }
      respond_license: {
        Args: { decision: string; request_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
