import { createClient } from "@supabase/supabase-js";
import type { Booking } from "@/features/bookings/model/types";

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Booking, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
