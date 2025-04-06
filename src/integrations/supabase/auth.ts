
import { supabase } from "./client";

/**
 * Gets the current authenticated user ID
 * @returns The current user ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error getting current user:", error.message);
    throw error;
  }
  
  if (!data.user) {
    throw new Error("No authenticated user found");
  }
  
  return data.user.id;
};
