
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication and user management
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || "";
};

export const isUserLoggedIn = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};
