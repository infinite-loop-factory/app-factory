import { supabase } from "@/utils/supabase";

export interface ReactionRecord {
  id?: string;
  user_id: string;
  result_value: number;
  unit: string;
  created_at?: string;
  // Legacy support - computed property
  reaction_time?: number;
}

export const insertRecord = async (
  userId: string,
  reactionTime: number,
): Promise<void> => {
  try {
    const { error } = await supabase.from("records").insert([
      {
        user_id: userId,
        result_value: reactionTime,
        unit: "ms",
      },
    ]);

    if (error) {
      // If table doesn't exist, log but don't crash
      if (
        error.code === "PGRST204" ||
        error.message.includes("Could not find")
      ) {
        console.error(
          "Database table 'records' not found. Please run migrations:",
          error.message,
        );
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to save record:", error);
    throw error;
  }
};

export const fetchRecords = async (
  userId: string,
): Promise<ReactionRecord[]> => {
  try {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array
      if (
        error.code === "PGRST204" ||
        error.message.includes("Could not find")
      ) {
        console.error(
          "Database table 'records' not found. Returning empty array:",
          error.message,
        );
        return [];
      }
      throw error;
    }

    // Transform data to include reaction_time for backward compatibility
    const transformedData = (data || []).map((record) => ({
      ...record,
      reaction_time: record.result_value, // Add computed property
    }));

    return transformedData;
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return []; // Return empty array instead of crashing
  }
};

// Alias for getRecords (commonly used function name)
export const getRecords = fetchRecords;

export const deleteRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase.from("records").delete().eq("id", recordId);

  if (error) {
    throw error;
  }
};
