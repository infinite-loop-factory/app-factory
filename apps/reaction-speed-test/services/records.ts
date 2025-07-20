import { supabase } from "@/utils/supabase";

export interface ReactionRecord {
  id?: string;
  user_id: string;
  reaction_time: number;
  created_at?: string;
}

export const insertRecord = async (
  userId: string,
  reactionTime: number,
): Promise<void> => {
  const { error } = await supabase.from("records").insert([
    {
      user_id: userId,
      reaction_time: reactionTime,
    },
  ]);

  if (error) {
    throw error;
  }
};

export const fetchRecords = async (
  userId: string,
): Promise<ReactionRecord[]> => {
  const { data, error } = await supabase
    .from("records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const deleteRecord = async (recordId: string): Promise<void> => {
  const { error } = await supabase.from("records").delete().eq("id", recordId);

  if (error) {
    throw error;
  }
};
