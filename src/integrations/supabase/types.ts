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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      checkin_items: {
        Row: {
          checkin_id: string
          created_at: string
          id: string
          item_key: string
          notes: string | null
          result: string | null
          service_needed: boolean | null
          updated_at: string
        }
        Insert: {
          checkin_id: string
          created_at?: string
          id?: string
          item_key: string
          notes?: string | null
          result?: string | null
          service_needed?: boolean | null
          updated_at?: string
        }
        Update: {
          checkin_id?: string
          created_at?: string
          id?: string
          item_key?: string
          notes?: string | null
          result?: string | null
          service_needed?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_items_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_media: {
        Row: {
          checkin_id: string
          created_at: string
          file_path: string
          id: string
          media_type: string
        }
        Insert: {
          checkin_id: string
          created_at?: string
          file_path: string
          id?: string
          media_type: string
        }
        Update: {
          checkin_id?: string
          created_at?: string
          file_path?: string
          id?: string
          media_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_media_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          car_model: string | null
          car_year: string | null
          checkin_approved: boolean | null
          checkout_approved: boolean | null
          client_id: string | null
          client_notes: string | null
          created_at: string
          id: string
          mechanic_id: string | null
          mileage: number | null
          plate: string | null
          status: string
          updated_at: string
          vehicle_vin: string | null
        }
        Insert: {
          car_model?: string | null
          car_year?: string | null
          checkin_approved?: boolean | null
          checkout_approved?: boolean | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string
          id?: string
          mechanic_id?: string | null
          mileage?: number | null
          plate?: string | null
          status?: string
          updated_at?: string
          vehicle_vin?: string | null
        }
        Update: {
          car_model?: string | null
          car_year?: string | null
          checkin_approved?: boolean | null
          checkout_approved?: boolean | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string
          id?: string
          mechanic_id?: string | null
          mileage?: number | null
          plate?: string | null
          status?: string
          updated_at?: string
          vehicle_vin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          checkout_items: Json
          client_id: string
          created_at: string
          general_media: Json
          id: string
          status: string
          updated_at: string
          vehicle_details: Json
        }
        Insert: {
          checkout_items?: Json
          client_id: string
          created_at?: string
          general_media?: Json
          id?: string
          status?: string
          updated_at?: string
          vehicle_details?: Json
        }
        Update: {
          checkout_items?: Json
          client_id?: string
          created_at?: string
          general_media?: Json
          id?: string
          status?: string
          updated_at?: string
          vehicle_details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_number: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          updated_at: string
        }
        Insert: {
          client_number: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          client_number?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_parts: {
        Row: {
          created_at: string
          id: string
          in_stock: boolean
          location: string | null
          name: string
          serial_number: string
          sku: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          in_stock?: boolean
          location?: string | null
          name: string
          serial_number: string
          sku?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          in_stock?: boolean
          location?: string | null
          name?: string
          serial_number?: string
          sku?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      part_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          checkin_id: string
          created_at: string
          id: string
          notes: string | null
          part_id: string
          requested_by: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          checkin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          part_id: string
          requested_by: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          checkin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          part_id?: string
          requested_by?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_requests_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_requests_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "inventory_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      parts_service_sessions: {
        Row: {
          client_id: string
          created_at: string
          general_media: Json
          id: string
          parts_data: Json
          status: string
          updated_at: string
          vehicle_details: Json
        }
        Insert: {
          client_id: string
          created_at?: string
          general_media?: Json
          id?: string
          parts_data?: Json
          status?: string
          updated_at?: string
          vehicle_details?: Json
        }
        Update: {
          client_id?: string
          created_at?: string
          general_media?: Json
          id?: string
          parts_data?: Json
          status?: string
          updated_at?: string
          vehicle_details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "parts_service_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      service_approvals: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          checkin_id: string
          client_notes: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          part_request_id: string | null
          service_description: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          checkin_id: string
          client_notes?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          part_request_id?: string | null
          service_description: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          checkin_id?: string
          client_notes?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          part_request_id?: string | null
          service_description?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_approvals_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_approvals_part_request_id_fkey"
            columns: ["part_request_id"]
            isOneToOne: false
            referencedRelation: "part_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_client_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "mechanic" | "supervisor"
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
      app_role: ["mechanic", "supervisor"],
    },
  },
} as const
