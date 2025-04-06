export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cart: {
        Row: {
          created_at: string;
          id: number;
          menu_cnt: number | null;
          menu_id: number;
          ordered_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          menu_cnt?: number | null;
          menu_id: number;
          ordered_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          menu_cnt?: number | null;
          menu_id?: number;
          ordered_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menu";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      driver: {
        Row: {
          created_at: string;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "driver_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      driver_location: {
        Row: {
          created_at: string;
          driver_id: number;
          id: number;
          lat: number;
          lon: number;
          order_id: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          driver_id: number;
          id?: number;
          lat?: number;
          lon?: number;
          order_id: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          driver_id?: number;
          id?: number;
          lat?: number;
          lon?: number;
          order_id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "driver_location_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "driver";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "driver_location_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
        ];
      };
      menu: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          price: number;
          restaurant_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          price: number;
          restaurant_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          price?: number;
          restaurant_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "menu_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurant";
            referencedColumns: ["id"];
          },
        ];
      };
      order: {
        Row: {
          amount: number;
          created_at: string;
          driver_at: string | null;
          driver_id: number | null;
          id: number;
        };
        Insert: {
          amount: number;
          created_at?: string;
          driver_at?: string | null;
          driver_id?: number | null;
          id?: number;
        };
        Update: {
          amount?: number;
          created_at?: string;
          driver_at?: string | null;
          driver_id?: number | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "driver";
            referencedColumns: ["id"];
          },
        ];
      };
      order_menu: {
        Row: {
          created_at: string;
          id: number;
          menu_cnt: number;
          menu_id: number;
          menu_name: string;
          menu_price: number;
          order_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          menu_cnt?: number;
          menu_id: number;
          menu_name: string;
          menu_price: number;
          order_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          menu_cnt?: number;
          menu_id?: number;
          menu_name?: string;
          menu_price?: number;
          order_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_menu_menu_id_fkey";
            columns: ["menu_id"];
            isOneToOne: false;
            referencedRelation: "menu";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_menu_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status: {
        Row: {
          created_at: string;
          id: number;
          order_id: number;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          order_id: number;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          order_id?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_status_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["id"];
          },
        ];
      };
      restaurant: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          created_at: string;
          id: string;
          lat: number | null;
          lon: number | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          lat?: number | null;
          lon?: number | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          lat?: number | null;
          lon?: number | null;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
